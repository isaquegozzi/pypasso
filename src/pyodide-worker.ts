/* Pyodide Web Worker: executa Python fora da thread principal.
 * Carrega o Pyodide via CDN sob demanda e redireciona input()/print().
 * O namespace global do Pyodide é compartilhado entre editor e REPL:
 * variáveis criadas no console continuam valendo no editor (e vice-versa).
 * Saída sempre em texto puro (sem HTML).
 */

type RunMsg = {
  type: 'run'
  id: number
  code: string
  inputs: string
}

type ReplMsg = {
  type: 'repl'
  id: number
  code: string
}

type InMsg = RunMsg | ReplMsg

let pyodide: any = null
let loading: Promise<any> | null = null

const PYODIDE_INDEX = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/'

async function ensurePyodide(): Promise<any> {
  if (pyodide) return pyodide
  if (!loading) {
    loading = (async () => {
      // Worker é ESM (type: 'module'), então importScripts() não existe aqui.
      // Usa o build ESM oficial do Pyodide via import dinâmico.
      // @ts-ignore — URL remota; @vite-ignore impede o Vite de tentar empacotar
      const mod = await import(/* @vite-ignore */ `${PYODIDE_INDEX}pyodide.mjs`)
      const api = await mod.loadPyodide({ indexURL: PYODIDE_INDEX })
      return api
    })()
  }
  pyodide = await loading
  return pyodide
}

function splitInputLines(inputs: string): string[] {
  const queue = (inputs ?? '').split('\n')
  if (queue.length > 0 && queue[queue.length - 1] === '') queue.pop()
  return queue
}

/** Mensagens de SyntaxError que indicam bloco ainda incompleto (continuar com ...). */
function isIncompleteError(text: string): boolean {
  return /incomplete input|unexpected EOF|expected an indented block|unexpected indent|expected ':'$/im.test(text)
}

function post(msg: unknown) {
  ;(self as any).postMessage(msg)
}

/**
 * Avalia um trecho no estilo REPL dentro do namespace global compartilhado:
 * - expressão única → ecoa repr(valor), exceto None (como o console do Python);
 * - declarações → exec, compartilhando variáveis com o editor;
 * - SyntaxError de entrada incompleta → o chamador deve continuar com "...".
 */
const REPL_DRIVER = `
import ast as _pypasso_ast
try:
    _pypasso_tree = _pypasso_ast.parse(_repl_src)
    if len(_pypasso_tree.body) == 1 and isinstance(_pypasso_tree.body[0], _pypasso_ast.Expr):
        _pypasso_val = eval(
            compile(_pypasso_ast.Expression(_pypasso_tree.body[0].value), '<console>', 'eval'),
            globals(), globals())
        if _pypasso_val is not None:
            print(repr(_pypasso_val))
    else:
        exec(compile(_pypasso_tree, '<console>', 'exec'), globals(), globals())
finally:
    for _pypasso_n in ('_pypasso_ast', '_pypasso_tree', '_pypasso_val'):
        try:
            del globals()[_pypasso_n]
        except KeyError:
            pass
`

self.onmessage = async (e: MessageEvent) => {
  const msg = e.data as InMsg
  if (msg.type === 'run') {
    const queue = splitInputLines(msg.inputs)
    let inputIndex = 0
    let output = ''
    try {
      const py = await ensurePyodide()
      py.setStdin({
        stdin: () => {
          if (inputIndex >= queue.length) {
            throw new Error('EOFError: faltou entrada — o programa chamou input() e não recebeu resposta.')
          }
          const line = queue[inputIndex++]
          return line + '\n'
        },
      })
      py.setStdout({ batched: (s: string) => { output += s + '\n' } })
      py.setStderr({ batched: (s: string) => { output += s + '\n' } })
      await py.runPythonAsync(msg.code)
      post({ type: 'done', id: msg.id, output })
    } catch (err: any) {
      const text = err?.message ?? String(err)
      post({ type: 'error', id: msg.id, error: text })
    }
    return
  }

  if (msg.type === 'repl') {
    let output = ''
    try {
      const py = await ensurePyodide()
      py.setStdin({
        stdin: () => {
          throw new Error(
            'EOFError: o console não aceita input() — use o editor acima para programas com input().',
          )
        },
      })
      py.setStdout({ batched: (s: string) => { output += s + '\n' } })
      py.setStderr({ batched: (s: string) => { output += s + '\n' } })
      py.globals.set('_repl_src', msg.code)
      try {
        await py.runPythonAsync(REPL_DRIVER)
      } finally {
        try { py.globals.delete('_repl_src') } catch { /* ignore */ }
      }
      post({ type: 'done', id: msg.id, output })
    } catch (err: any) {
      const text = err?.message ?? String(err)
      if (isIncompleteError(text)) {
        post({ type: 'incomplete', id: msg.id })
        return
      }
      post({ type: 'error', id: msg.id, error: text })
    }
    return
  }
}

export {}
