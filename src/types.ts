/** Tipos centrais do PyPasso. */

export interface ExerciseCheck {
  /** Entradas fornecidas ao programa na verificação (uma linha por input()). */
  inputs: string
  /** Saída exata esperada (comparação normalizada: quebras \n, espaços de borda). */
  expected: string
}

export interface Exercise {
  id: string
  title: string
  prompt: string
  starterCode: string
  hint?: string
  /** Solução autoral revelável (não usada na correção). */
  solution: string
  /** Verificação comportamental: roda o código do editor e compara a SAÍDA. */
  check: ExerciseCheck
  /** Mensagem de conclusão exibida ao passar. */
  successMessage: string
}

export interface Lesson {
  /** slug usado na rota #/aprender/:slug */
  slug: string
  moduleId: string
  order: number
  title: string
  goals: string[]
  /** Explicação curta em PT-BR (texto simples com quebras de linha). */
  explanation: string
  starterCode: string
  /** Entradas pré-preenchidas, uma por linha, consumidas por input(). */
  defaultInputs: string
  exercise: Exercise
}

export interface CourseModule {
  id: string
  title: string
  description: string
  lessons: Lesson[]
}

export interface Progress {
  version: number
  /** slugs de aulas marcadas como concluídas */
  completed: string[]
  /** rascunhos de código por slug de aula */
  drafts: Record<string, string>
  /** código do laboratório livre */
  labCode: string
  /** última aula visitada */
  lastSlug: string | null
}
