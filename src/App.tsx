import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { python } from '@codemirror/lang-python'
import { indentUnit } from '@codemirror/language'
import { MODULES, ALL_LESSONS, findLesson, lessonNeighbors, outputsMatch } from './content'
import { loadProgress, saveProgress } from './storage'
import { runPython, runRepl, stopExecution, type ExecStatus } from './executor'
import type { Lesson, Progress } from './types'
import './styles.css'

const LAB_DEFAULT = '# Laboratório livre — escreva qualquer Python aqui\n# Dica: use print() para ver o resultado.\nprint("Olá do laboratório!")\n'
const FIRST_SLUG = 'print-primeiro-programa'
const FINAL_SLUG = 'calculadora-integradora'

type Route =
  | { name: 'aprender'; slug: string }
  | { name: 'lab' }
  | { name: 'sobre' }

function initialSlug(): string {
  try {
    const raw = localStorage.getItem('pypasso:v1')
    if (raw) {
      const p = JSON.parse(raw) as Partial<Progress>
      if (typeof p.lastSlug === 'string' && findLesson(p.lastSlug)) return p.lastSlug
    }
  } catch { /* ignore */ }
  return FIRST_SLUG
}

function parseHash(): Route {
  const h = window.location.hash || ''
  const m = h.match(/^#\/aprender\/([\w-]+)/)
  if (m && findLesson(m[1])) return { name: 'aprender', slug: m[1] }
  if (h.startsWith('#/laboratorio')) return { name: 'lab' }
  if (h.startsWith('#/sobre')) return { name: 'sobre' }
  if (h === '' || h === '#/' || h === '#') return { name: 'aprender', slug: initialSlug() }
  return { name: 'aprender', slug: initialSlug() }
}

function go(hash: string) {
  if (window.location.hash === hash) window.dispatchEvent(new HashChangeEvent('hashchange'))
  else window.location.hash = hash
}

function initialTheme(): 'light' | 'dark' {
  try {
    const saved = localStorage.getItem('pypasso:tema')
    if (saved === 'dark' || saved === 'light') return saved
  } catch { /* ignore */ }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/** Pega o texto do n-ésimo input("...") do código para mostrar no modal ("" se não houver). */
function extractInputPrompt(code: string, index: number): string {
  const re = /input\(\s*(?:(['"])(.*?)\1)?\s*\)/g
  const prompts: string[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(code)) !== null) prompts.push(m[2] ?? '')
  return prompts[index] ?? ''
}

function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash())
  useEffect(() => {
    const onChange = () => {
      setRoute(parseHash())
      document.getElementById('conteudo')?.focus({ preventScroll: true })
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}

export default function App() {
  const route = useRoute()
  const [progress, setProgress] = useState<Progress>(() => loadProgress())

  useEffect(() => { saveProgress(progress) }, [progress])

  const lesson = route.name === 'aprender' ? (findLesson(route.slug) ?? findLesson(FIRST_SLUG)!) : undefined
  const storageKey = route.name === 'lab' ? '__lab__' : (lesson?.slug ?? FIRST_SLUG)

  const [code, setCode] = useState('')
  const [output, setOutput] = useState('')
  const [status, setStatus] = useState<ExecStatus>('pronto')
  const stopRef = useRef(false)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => initialTheme())
  const [tab, setTab] = useState<'ler' | 'desafio'>('ler')
  const [inputModal, setInputModal] = useState<{ hint: string; value: string } | null>(null)
  const inputWaiter = useRef<((v: string | null) => void) | null>(null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('pypasso:tema', theme)
    } catch { /* ignore */ }
  }, [theme])

  useEffect(() => {
    if (route.name === 'lab') {
      setCode(progress.labCode || LAB_DEFAULT)
    } else if (lesson) {
      setCode(progress.drafts[lesson.slug] ?? lesson.starterCode)
      setProgress((p) => (p.lastSlug === lesson.slug ? p : { ...p, lastSlug: lesson.slug }))
    }
    setOutput('')
    setStatus('pronto')
    setTab('ler')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey])

  const dirty = useMemo(() => {
    if (route.name === 'lab') return code !== (progress.labCode || LAB_DEFAULT)
    if (lesson) return code !== (progress.drafts[lesson.slug] ?? lesson.starterCode)
    return false
  }, [code, progress, route.name, lesson])

  useEffect(() => {
    if (!dirty) return
    const t = setTimeout(() => {
      setProgress((p) =>
        route.name === 'lab' ? { ...p, labCode: code } : { ...p, drafts: { ...p.drafts, [storageKey]: code } },
      )
    }, 500)
    return () => clearTimeout(t)
  }, [code, dirty, route.name, storageKey])

  const submitModalInput = useCallback((v: string | null) => {
    setInputModal(null)
    inputWaiter.current?.(v)
    inputWaiter.current = null
  }, [])

  const waitForModalInput = useCallback((hint: string): Promise<string | null> => {
    setInputModal({ hint, value: '' })
    return new Promise((resolve) => {
      inputWaiter.current = resolve
    })
  }, [])

  const run = useCallback(async () => {
    if (status === 'executando' || status === 'loading') return
    stopRef.current = false
    setStatus(code.length > 200 ? 'loading' : 'executando')
    await new Promise((r) => setTimeout(r, 30))
    setStatus('executando')
    // Sem caixa de entradas: a cada input() sem resposta, abre o modal,
    // anexa o valor digitado e executa de novo (até 10 entradas).
    const collected: string[] = []
    for (let attempt = 0; attempt < 10; attempt++) {
      const res = await runPython(code, collected.join('\n'))
      if (stopRef.current) {
        stopRef.current = false
        submitModalInput(null)
        setOutput('Execução interrompida — aperte Executar para tentar de novo.')
        setStatus('pronto')
        return
      }
      if (res.ok) {
        setOutput(res.output)
        setStatus('concluido')
        return
      }
      if (!/faltou entrada/i.test(res.output)) {
        setOutput(res.output)
        setStatus('erro')
        return
      }
      const answer = await waitForModalInput(extractInputPrompt(code, collected.length))
      if (answer === null) {
        setOutput('Execução cancelada antes de digitar a entrada.')
        setStatus('pronto')
        return
      }
      collected.push(answer)
    }
    setOutput('Muitas entradas pedidas de uma vez (limite 10). Confira se há input() dentro de um laço sem fim.')
    setStatus('erro')
  }, [code, status, waitForModalInput, submitModalInput])

  const stop = useCallback(() => {
    stopRef.current = true
    stopExecution()
  }, [])

  const clearOutput = useCallback(() => {
    setOutput('')
    if (status !== 'executando' && status !== 'loading') setStatus('pronto')
  }, [status])

  const toggleDone = useCallback((slug: string) => {
    setProgress((p) => ({
      ...p,
      completed: p.completed.includes(slug) ? p.completed.filter((s) => s !== slug) : [...p.completed, slug],
    }))
  }, [])

  const markDone = useCallback((slug: string) => {
    setProgress((p) => (p.completed.includes(slug) ? p : { ...p, completed: [...p.completed, slug] }))
  }, [])

  const restoreCode = useCallback(() => {
    if (route.name === 'lab') setCode(LAB_DEFAULT)
    else if (lesson) setCode(lesson.starterCode)
    setOutput('')
    setStatus('pronto')
  }, [route.name, lesson])

  const loadExerciseStarter = useCallback(() => {
    if (!lesson) return
    setCode(lesson.exercise.starterCode)
    setOutput('')
    setStatus('pronto')
  }, [lesson])

  const neighbors = lesson ? lessonNeighbors(lesson.slug) : {}
  const doneCount = progress.completed.length
  const lessonIndex = Math.max(0, ALL_LESSONS.findIndex((l) => l.slug === lesson?.slug))

  return (
    <div className="shell">
      <a className="skip" href="#conteudo">Pular para o conteúdo</a>
      <header className="topbar">
        <a className="brand" href={`#/aprender/${FIRST_SLUG}`}>📓 PyPasso</a>
        <nav className="tabs" aria-label="Navegação principal">
          <a href={`#/aprender/${lesson?.slug ?? progress.lastSlug ?? FIRST_SLUG}`} className={route.name === 'aprender' ? 'active' : ''} aria-current={route.name === 'aprender' ? 'page' : undefined}>Aprender</a>
          <a href="#/laboratorio" className={route.name === 'lab' ? 'active' : ''} aria-current={route.name === 'lab' ? 'page' : undefined}>Laboratório</a>
          <a href="#/sobre" className={route.name === 'sobre' ? 'active' : ''} aria-current={route.name === 'sobre' ? 'page' : undefined}>Sobre</a>
        </nav>
        <span className="progress-pill" role="status" aria-label={`${doneCount} de ${ALL_LESSONS.length} aulas concluídas`}>{doneCount}/{ALL_LESSONS.length} concluídas</span>
        <button
          type="button"
          className="themebtn"
          onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          aria-pressed={theme === 'dark'}
          title={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
          aria-label={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
        >
          {theme === 'dark' ? '☀' : '☾'}
        </button>
      </header>

      {route.name === 'sobre' ? (
        <main className="single" id="conteudo" tabIndex={-1}>
          <article className="card doc">
            <h1>Sobre o PyPasso</h1>
            <p><strong>PyPasso é um caderno interativo em português para aprender Python do zero, direto no navegador.</strong> São 8 módulos × 3 microaulas = 24 aulas curtas, cada uma com um exemplo editável e um exercício com correção automática pela saída do programa. O curso termina na calculadora integradora, que junta tudo o que você aprendeu.</p>
            <h2>Para quem é</h2>
            <p>Estudantes do ensino fundamental II e médio, curiosos de qualquer idade e professores que queiram um material pronto para a sala de aula. Não é preciso instalar nada nem criar conta: o Python roda localmente via Pyodide (WebAssembly) em um Web Worker.</p>
            <h2>Como estudar</h2>
            <ol>
              <li>Leia a explicação curta e execute o exemplo ao lado (Ctrl+Enter também executa).</li>
              <li>Brinque com o exemplo: troque valores e preveja a saída antes de executar.</li>
              <li>Faça o exercício no mesmo editor, aperte <strong>Verificar</strong> e leia a conclusão.</li>
              <li>Marque a aula como concluída (ou ela é marcada ao passar) e avance. Volte pelo menu quando quiser revisar.</li>
            </ol>
            <h2>O que você vai aprender</h2>
            <p>print() e comentários · variáveis, operadores e type() · f-strings, fatias e input() · comparações, if/elif/else, and/or/not · for, while, break/continue · listas, tuplas, conjuntos e dicionários · def, parâmetros e return · try/except, math/random e o projeto da calculadora.</p>
            <h2>Limites honestos</h2>
            <ul>
              <li>O Python carrega de uma CDN na primeira execução — sem internet, a execução falha com aviso.</li>
              <li>Cada execução tem limite de 5 segundos e 50 mil caracteres, para evitar travamentos.</li>
              <li><code>input()</code> lê da caixa “Entradas” (uma linha por chamada); arquivos, rede e janelas gráficas não estão disponíveis.</li>
              <li>Seu progresso fica só neste navegador (localStorage <code>pypasso:v1</code>); limpar os dados do site apaga rascunhos e conclusões.</li>
            </ul>
            <h2>Acessibilidade</h2>
            <p>Navegável por teclado, com foco visível, contraste reforçado, suporte a zoom de 200% e respeito a <code>prefers-reduced-motion</code>. Encontrou uma barreira? Descreva-a e ajuste o tamanho da fonte do navegador sem medo: o layout acompanha.</p>
            <p><a href={`#/aprender/${progress.lastSlug ?? FIRST_SLUG}`}> {progress.lastSlug ? 'Retomar minha última aula →' : 'Começar pela primeira aula →'}</a></p>
          </article>
        </main>
      ) : route.name === 'lab' ? (
        <main className="single" id="conteudo" tabIndex={-1}>
          <article className="card doc">
            <h1>Laboratório livre</h1>
            <p className="muted small"><a href={`#/aprender/${progress.lastSlug ?? FIRST_SLUG}`}>← voltar para a aula</a> · salvo neste navegador</p>
            <EditorBlock key={storageKey} code={code} setCode={setCode} output={output} status={status} dark={theme === 'dark'} onRun={run} onStop={stop} onRestore={restoreCode} onClear={clearOutput} />
          </article>
        </main>
      ) : (
        <main className="grid" id="conteudo" tabIndex={-1}>
          <div className="lessonbar card" role="navigation" aria-label="Escolher aula">
            {neighbors.prev ? <a href={`#/aprender/${neighbors.prev.slug}`} title={neighbors.prev.title} aria-label={`Aula anterior: ${neighbors.prev.title}`}>←</a> : <span aria-hidden="true" className="muted">·</span>}
            <select
              value={lesson?.slug ?? FIRST_SLUG}
              onChange={(e) => go(`#/aprender/${e.target.value}`)}
              aria-label="Aula atual — trocar de aula"
            >
              {MODULES.map((m) => (
                <optgroup key={m.id} label={m.title}>
                  {m.lessons.map((l) => (
                    <option key={l.slug} value={l.slug}>
                      {progress.completed.includes(l.slug) ? '✓ ' : ''}{l.title}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <span className="muted small">{lessonIndex + 1}/{ALL_LESSONS.length}</span>
            {neighbors.next ? <a href={`#/aprender/${neighbors.next.slug}`} title={neighbors.next.title} aria-label={`Próxima aula: ${neighbors.next.title}`}>→</a> : <span aria-hidden="true" className="muted">·</span>}
          </div>

          <article className="card doc" aria-labelledby="lesson-title">
            <h1 id="lesson-title">{lesson?.title}</h1>
            {lesson && (
              <>
                <div className="seg" role="tablist" aria-label="Etapas da aula">
                  <button type="button" role="tab" aria-selected={tab === 'ler'} className={tab === 'ler' ? 'on' : ''} onClick={() => setTab('ler')}>1 · Ler</button>
                  <button type="button" role="tab" aria-selected={tab === 'desafio'} className={tab === 'desafio' ? 'on' : ''} onClick={() => setTab('desafio')}>2 · Desafio{progress.completed.includes(lesson.slug) ? ' ✓' : ''}</button>
                </div>
                {tab === 'ler' ? (
                  <>
                    <details className="goals-box">
                      <summary>O que você vai aprender ({lesson.goals.length})</summary>
                      <ul className="goals">
                        {lesson.goals.map((g) => <li key={g}>{g}</li>)}
                      </ul>
                    </details>
                    {lesson.explanation.split('\n').map((p, i) => (p.trim() === '' ? null : <p key={i}>{p}</p>))}
                  </>
                ) : (
                  <>
                    <ExerciseBlock
                      lesson={lesson}
                      code={code}
                      completed={progress.completed.includes(lesson.slug)}
                      onLoadStarter={loadExerciseStarter}
                      onPass={() => markDone(lesson.slug)}
                    />
                    <div className="lesson-nav">
                      <label className="done">
                        <input type="checkbox" checked={progress.completed.includes(lesson.slug)} onChange={() => toggleDone(lesson.slug)} />
                        Concluída
                      </label>
                    </div>
                  </>
                )}
              </>
            )}
          </article>

          <section className="card workbench" aria-label="Editor e resultado">
            <EditorBlock key={storageKey} code={code} setCode={setCode} output={output} status={status} dark={theme === 'dark'} onRun={run} onStop={stop} onRestore={restoreCode} onClear={clearOutput} />
          </section>
        </main>
      )}

      {inputModal && (
        <div className="modal-overlay" onClick={() => submitModalInput(null)}>
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="input-modal-title" onClick={(e) => e.stopPropagation()}>
            <h2 id="input-modal-title">O programa pediu uma entrada</h2>
            {inputModal.hint ? (
              <p>Ele mostrou: <code>{inputModal.hint}</code></p>
            ) : (
              <p>Digite o valor e aperte Enter.</p>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                submitModalInput(inputModal.value)
              }}
            >
              <input
                autoFocus
                className="modal-input"
                value={inputModal.value}
                onChange={(e) => setInputModal({ ...inputModal, value: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') submitModalInput(null)
                }}
                aria-label="Valor de entrada do programa"
                placeholder="digite aqui"
                autoComplete="off"
              />
              <div className="modal-actions">
                <button type="submit" className="primary">Enviar</button>
                <button type="button" className="ghost" onClick={() => submitModalInput(null)}>Cancelar execução</button>
              </div>
            </form>
            <p className="muted small">Repete para cada <code>input()</code> do programa.</p>
          </div>
        </div>
      )}

      <footer className="foot">
        <span>PyPasso</span>
        <span className="muted">salvo localmente</span>
      </footer>
    </div>
  )
}

function ExerciseBlock(props: {
  lesson: Lesson
  code: string
  completed: boolean
  onLoadStarter: () => void
  onPass: () => void
}) {
  const { lesson, code, completed, onLoadStarter, onPass } = props
  const ex = lesson.exercise
  const [verifyState, setVerifyState] = useState<'idle' | 'checking' | 'pass' | 'fail'>('idle')
  const [verifyMsg, setVerifyMsg] = useState('')
  const [got, setGot] = useState('')
  const isFinal = lesson.slug === FINAL_SLUG

  useEffect(() => {
    setVerifyState('idle')
    setVerifyMsg('')
    setGot('')
  }, [lesson.slug])

  const verify = useCallback(async () => {
    if (verifyState === 'checking') return
    setVerifyState('checking')
    setVerifyMsg('Verificando…')
    const res = await runPython(code, ex.check.inputs)
    if (!res.ok) {
      setVerifyState('fail')
      setGot(res.output)
      setVerifyMsg('Seu programa deu erro. Leia a mensagem no Resultado e tente de novo.')
      return
    }
    const ok = outputsMatch(res.output, ex.check.expected, isFinal)
    setGot(res.output)
    if (ok) {
      setVerifyState('pass')
      setVerifyMsg(ex.successMessage)
      onPass()
    } else {
      setVerifyState('fail')
      setVerifyMsg(
        'Ainda não bateu. Compare sua saída com o esperado abaixo. Vale qualquer código que imprima o certo — tente de outro jeito!',
      )
    }
  }, [code, ex, isFinal, onPass, verifyState])

  return (
    <section className="exercise" aria-labelledby={`${ex.id}-title`}>
      <h2 id={`${ex.id}-title`} className="exercise-title">{ex.title}</h2>
      {ex.prompt.split('\n').map((p, i) => (p.trim() === '' ? null : <p key={i}>{p}</p>))}
      <div className="exercise-actions">
        <button type="button" className="primary" onClick={() => void verify()} disabled={verifyState === 'checking'}>
          {verifyState === 'checking' ? 'Verificando…' : '✓ Verificar'}
        </button>
        <button type="button" className="ghost" onClick={onLoadStarter}>Carregar código inicial do exercício</button>
      </div>
      <details className="reveal">
        <summary>Dica</summary>
        <p>{ex.hint}</p>
      </details>
      <details className="reveal">
        <summary>Ver solução (tente primeiro!)</summary>
        <pre className="solution" tabIndex={0}><code>{ex.solution}</code></pre>
      </details>
      <div
        className={`verdict v-${verifyState}${completed && verifyState !== 'fail' ? ' v-done' : ''}`}
        role="status"
        aria-live="polite"
      >
        {verifyState === 'idle' && (completed ? '✓ Concluída.' : 'Aperte Verificar quando estiver pronto.')}
        {verifyState === 'checking' && 'Verificando sua saída…'}
        {verifyState === 'pass' && (<><strong>✓ Passou!</strong> {verifyMsg}</>)}
        {verifyState === 'fail' && (
          <>
            <p><strong>✗ {verifyMsg}</strong></p>
            <p className="small">Esperado:<br /><code>{ex.check.expected}</code>{isFinal && ' (vale como ÚLTIMA linha)'}</p>
            {got !== '' && <p className="small">Sua saída:<br /><code>{got.replace(/\n$/, '') || '(vazia)'}</code></p>}
          </>
        )}
      </div>
    </section>
  )
}

function EditorBlock(props: {
  code: string; setCode: (s: string) => void
  output: string; status: ExecStatus
  dark: boolean
  onRun: () => void; onStop: () => void; onRestore: () => void; onClear: () => void
}) {
  const { code, setCode, output, status, dark, onRun, onStop, onRestore, onClear } = props
  const busy = status === 'executando' || status === 'loading'
  return (
    <div
      className="wb"
      onKeyDown={(e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
          e.preventDefault()
          onRun()
        }
      }}
    >
      <div className="wb-row wb-head">
        <h2 className="wb-title">Editor</h2>
      </div>
      <div className="wb-row wb-actions">
        <button onClick={onRun} disabled={busy} className="primary" title="Executar (Ctrl+Enter)">▶ Executar</button>
        <button onClick={onStop} disabled={!busy} className="ghost" title="Interromper a execução">■ Parar</button>
        <details className="more-actions">
          <summary>Mais ações</summary>
          <div className="more-row">
            <button onClick={onRestore} disabled={busy} className="ghost" title="Voltar ao código inicial da aula">↺ Restaurar</button>
            <button onClick={onClear} disabled={busy} className="ghost" title="Apagar o resultado">✕ Limpar</button>
          </div>
        </details>
      </div>
      <CodeMirror
        value={code}
        onChange={(v) => setCode(v)}
        theme={dark ? 'dark' : 'light'}
        extensions={[python(), indentUnit.of('    ')]}
        basicSetup={{ lineNumbers: true, highlightActiveLine: true, tabSize: 4 }}
        className="editor"
        aria-label="Editor Python — exemplo editável da aula"
      />
      <h2 className="wb-title">Resultado</h2>
      <pre className={`result ${status === 'erro' ? 'is-error' : ''}`} role="status" aria-live="polite" tabIndex={0}>{output || '— aperte Executar —'}</pre>
      <details className="repl-wrap">
        <summary>Console extra (opcional)</summary>
        <ReplConsole editorBusy={busy} />
      </details>
    </div>
  )
}

type ReplLine = { kind: 'in' | 'out' | 'err' | 'info'; text: string }

/** Remove o conteúdo de strings simples para contar parênteses/colchetes com segurança. */
function stripStrings(src: string): string {
  return src.replace(/('[^'\n]*'|"[^"\n]*")/g, '')
}

/** Heurística local de bloco incompleto (o worker confirma de verdade). */
function looksIncomplete(src: string): boolean {
  const trimmedEnd = src.replace(/\s+$/, '')
  if (/:\s*(#.*)?$/.test(trimmedEnd)) return true
  let depth = 0
  for (const ch of stripStrings(src)) {
    if (ch === '(' || ch === '[' || ch === '{') depth++
    else if (ch === ')' || ch === ']' || ch === '}') depth--
  }
  if (depth > 0) return true
  const lines = src.split('\n')
  const last = lines[lines.length - 1]
  const hasIndented = lines.some((l) => /^\s+\S/.test(l))
  if (hasIndented && last.trim() !== '') return true
  return false
}

/**
 * Console REPL: prompts >>>/... , histórico (↑/↓), multilinha e
 * variáveis persistentes compartilhadas com o editor.
 */
function ReplConsole({ editorBusy }: { editorBusy: boolean }) {
  const [lines, setLines] = useState<ReplLine[]>([
    { kind: 'info', text: 'Experimente 2 + 3 ou x = 10.' },
  ])
  const [buffer, setBuffer] = useState<string[]>([])
  const [value, setValue] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState<number | null>(null)
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'nearest' })
  }, [lines, buffer])

  const prompt = buffer.length > 0 ? '...' : '>>>'

  async function execSrc(src: string) {
    setBusy(true)
    try {
      const res = await runRepl(src)
      if (res.incomplete) {
        setBuffer(src.split('\n'))
        return
      }
      setHistory((h) => [src, ...h].slice(0, 100))
      if (res.output !== '') {
        setLines((l) => [...l, { kind: res.ok ? 'out' : 'err', text: res.output.replace(/\n$/, '') }])
      } else if (!res.ok) {
        setLines((l) => [...l, { kind: 'err', text: res.output }])
      }
    } finally {
      setBusy(false)
    }
  }

  async function submit(raw: string) {
    if (busy || editorBusy) return
    const line = raw
    if (line.trim() === '' && buffer.length === 0) return
    if (line.trim() === '' && buffer.length > 0) {
      const src = buffer.join('\n')
      setLines((l) => [...l, { kind: 'in', text: '...' }])
      setBuffer([])
      setValue('')
      setHistIdx(null)
      await execSrc(src)
      return
    }
    const activePrompt = buffer.length > 0 ? '...' : '>>>'
    setLines((l) => [...l, { kind: 'in', text: `${activePrompt} ${line}` }])
    const candidate = buffer.length > 0 ? [...buffer, line].join('\n') : line
    if (looksIncomplete(candidate)) {
      setBuffer(buffer.length > 0 ? [...buffer, line] : [line])
      setValue('')
      setHistIdx(null)
      return
    }
    setBuffer([])
    setValue('')
    setHistIdx(null)
    await execSrc(candidate)
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      void submit(value)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length === 0) return
      const next = histIdx === null ? 0 : Math.min(histIdx + 1, history.length - 1)
      if (histIdx === null) setDraft(value)
      setHistIdx(next)
      setValue(history[next])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (histIdx === null) return
      if (histIdx === 0) {
        setHistIdx(null)
        setValue(draft)
      } else {
        const next = histIdx - 1
        setHistIdx(next)
        setValue(history[next])
      }
    }
  }

  return (
    <div className="repl">
      <h2 className="wb-title">Console <span className="muted small">(opcional)</span></h2>
      <div className="repl-log" onClick={() => inputRef.current?.focus()} role="log" aria-label="Console Python">
        {lines.map((l, i) => (
          <div key={i} className={`repl-line r-${l.kind}`}>{l.text}</div>
        ))}
        {buffer.length > 0 && (
          <div className="repl-pending muted">{buffer.length} linha(s) no bloco — termine com linha vazia (Enter)</div>
        )}
        <div className="repl-inputrow">
          <span className="repl-prompt" aria-hidden="true">{busy ? '...' : prompt}</span>
          <input
            ref={inputRef}
            className="repl-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={busy || editorBusy}
            spellCheck={false}
            autoComplete="off"
            aria-label="Console Python — digite código e aperte Enter"
            placeholder={busy ? 'executando…' : 'digite Python e aperte Enter'}
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
