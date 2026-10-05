import { MAX_CODE_CHARS } from './storage'

export type ExecStatus = 'loading' | 'pronto' | 'executando' | 'concluido' | 'erro'

export interface ExecResult {
  ok: boolean
  output: string
}

export interface ReplResult extends ExecResult {
  /** true quando o bloco está incompleto e o console deve continuar com "..." */
  incomplete?: boolean
}

const TIMEOUT_MS = 5_000

let worker: Worker | null = null
let running = false
let seq = 0

type Pending = {
  id: number
  timer: ReturnType<typeof setTimeout>
  onMsg: (e: MessageEvent) => void
  resolve: (r: ExecResult & { incomplete?: boolean }) => void
  worker: Worker
}

let pending: Pending | null = null

function createWorker(): Worker {
  if (worker) worker.terminate()
  worker = new Worker(new URL('./pyodide-worker.ts', import.meta.url), { type: 'module' })
  return worker
}

function settlePending() {
  pending = null
}

/** Traduz mensagens cruas do Python para PT-BR amigável, com nº da linha + erro original. */
export function friendlyError(raw: string): string {
  const clean = raw.trim() || 'Erro desconhecido'
  const line = clean.match(/line (\d+)/)?.[1]
  const where = line ? ` (linha ${line})` : ''
  let tip: string
  if (/SyntaxError/i.test(clean))
    tip = `Erro de escrita${where}: confira parênteses, aspas e os dois-pontos do if/for/def.`
  else if (/NameError/i.test(clean))
    tip = `Nome desconhecido${where}: confira se a variável/função foi criada antes de usar (letras maiúsculas × minúsculas contam!).`
  else if (/IndentationError/i.test(clean))
    tip = `Indentação${where}: use 4 espaços no início das linhas dentro de if/for/def.`
  else if (/TypeError/i.test(clean))
    tip = `Tipo incompatível${where}: talvez você misturou texto com número — use int() para converter a entrada.`
  else if (/ValueError/i.test(clean))
    tip = `Valor inválido${where}: o número digitado não foi entendido — confira o valor digitado.`
  else if (/ZeroDivisionError/i.test(clean))
    tip = `Divisão por zero${where}: proteja com "if b == 0" antes de dividir.`
  else if (/EOFError|faltou entrada/i.test(clean))
    tip = `Faltou entrada: o programa chamou input() e não recebeu resposta. Execute de novo e digite na janela que abrir.`
  else if (/KeyboardInterrupt|Timeout|tempo esgotado/i.test(clean))
    tip = `Tempo esgotado (5s): seu programa pode ter entrado em loop infinito — confira o while.`
  else if (/LoadPyodide|Failed to fetch|NetworkError|importScripts/i.test(clean))
    tip = `Não foi possível carregar o Python (rede). Confira sua internet e tente de novo.`
  else tip = `Algo deu errado${where}.`
  return `${tip}\n\nDetalhe original:\n${clean.slice(0, 600)}`
}

function callWorker(payload: Record<string, unknown>): Promise<ExecResult & { incomplete?: boolean }> {
  return new Promise((resolve) => {
    const w = worker ?? createWorker()
    const id = ++seq
    const timer = setTimeout(() => {
      // timeout de 5s: recria o worker para destravar a próxima execução
      try { w.terminate() } catch { /* ignore */ }
      if (worker === w) worker = null
      if (pending?.id === id) settlePending()
      resolve({ ok: false, output: 'Tempo esgotado (5s): seu programa pode ter entrado em loop infinito — confira o while.' })
    }, TIMEOUT_MS)
    const onMsg = (e: MessageEvent) => {
      const d = e.data as { type: string; id: number; output?: string; error?: string }
      if (d.id !== id) return
      clearTimeout(timer)
      w.removeEventListener('message', onMsg)
      if (pending?.id === id) settlePending()
      if (d.type === 'done') resolve({ ok: true, output: d.output ?? '' })
      else if (d.type === 'incomplete') resolve({ ok: true, output: '', incomplete: true })
      else resolve({ ok: false, output: friendlyError(d.error ?? 'Erro desconhecido') })
    }
    pending = { id, timer, onMsg, resolve, worker: w }
    w.addEventListener('message', onMsg)
    w.postMessage({ ...payload, id })
  })
}

/** Interrompe a execução em andamento (botão Parar): destrói e recria o worker. */
export function stopExecution(): void {
  const p = pending
  if (!p) return
  clearTimeout(p.timer)
  try { p.worker.removeEventListener('message', p.onMsg) } catch { /* ignore */ }
  try { p.worker.terminate() } catch { /* ignore */ }
  if (worker === p.worker) worker = null
  settlePending()
  p.resolve({ ok: false, output: 'Execução interrompida — aperte Executar para tentar de novo.' })
}

/**
 * Executa Python com as regras do PyPasso:
 * - 1 execução por vez (chamadas concorrentes são recusadas)
 * - limite de 50k caracteres
 * - timeout de 5s com recriação do worker
 * - 1 retry automático se o Pyodide falhar ao carregar
 */
export async function runPython(code: string, inputs: string): Promise<ExecResult> {
  if (running) return { ok: false, output: 'Já há uma execução em andamento — aguarde terminar.' }
  if (code.length > MAX_CODE_CHARS)
    return { ok: false, output: `Código muito grande (${code.length} caracteres; limite ${MAX_CODE_CHARS}). Divida o programa.` }
  running = true
  try {
    const first = await callWorker({ type: 'run', code, inputs })
    if (!first.ok && /carregar o Python/i.test(first.output)) {
      // retry: força recriação do worker e tenta mais uma vez
      worker = null
      const second = await callWorker({ type: 'run', code, inputs })
      return second
    }
    return first
  } finally {
    running = false
  }
}

/**
 * Avalia um trecho no console REPL (namespace compartilhado com o editor,
 * então variáveis criadas aqui continuam valendo no editor e vice-versa).
 * Respeita a trava de 1 execução por vez, o timeout de 5s e o retry de carga.
 */
export async function runRepl(code: string): Promise<ReplResult> {
  if (running) return { ok: false, output: 'Já há uma execução em andamento — aguarde terminar.' }
  if (code.length > MAX_CODE_CHARS)
    return { ok: false, output: `Trecho muito grande (limite ${MAX_CODE_CHARS} caracteres).` }
  if (code.trim() === '') return { ok: true, output: '' }
  running = true
  try {
    const first = await callWorker({ type: 'repl', code })
    if (!first.ok && /carregar o Python/i.test(first.output)) {
      worker = null
      const second = await callWorker({ type: 'repl', code })
      return second
    }
    return first
  } finally {
    running = false
  }
}
