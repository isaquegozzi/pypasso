# Sistema visual do PyPasso

CSS próprio em `src/styles.css` (sem framework). Conceito: **caderno de papel**
— fundo pautado quente, cartões como folhas, verde-escuros como tinta de
correção.

## Tokens (`:root`)

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#f6f1e7` | fundo da página (com pauta `repeating-linear-gradient`) |
| `--paper` | `#fffdf7` | cartões, topbar |
| `--ink` | `#23201a` | texto, abas ativas |
| `--muted` | `#5f564a` | textos secundários (contraste ≈ 5.9:1) |
| `--line` | `#d9c9ac` | bordas, divisórias |
| `--accent` | `#8f3d0f` | links de aula atual, detalhes |
| `--accent-2` | `#145843` | botões primários, exercício, veredito ok |
| `--danger` | `#9c1f16` | veredito de erro, borda de resultado com erro |
| `--focus` | `#0b5fff` | anel de foco visível (3px + offset) |
| `--radius` | `12px` | cartões e blocos |
| `--mono` / `--sans` | pilhas monospace / system | código vs. prosa |

Tema escuro via `[data-theme="dark"]` no `<html>` (botão ☾/☀ no topo,
`aria-pressed`, salvo em `localStorage pypasso:tema`, padrão inicial segue
`prefers-color-scheme`): paleta quente escura com os mesmos componentes;
blocos de código/resultado/console já eram escuros e não mudam.

## Layout

- **Desktop (2 colunas iguais):** `.grid` → conteúdo `1fr` | bancada
  `1fr`, máx. `120rem` com respiro lateral, `align-items: stretch` para
  os dois cartões manterem a mesma altura. Topbar `sticky`. Sem coluna
  de capítulos: a troca de aula é pela `.lessonbar`
  (← seletor com os 24 títulos → + `n/24`).
- **Tablet (`≤ 61.25rem`):** 1 coluna na ordem explicação → editor → resultado
  (`.workbench { order: 2 }`).
- **Celular 390px (`≤ 30rem`):** topbar compacta, pílula de progresso em linha
  própria, todos os botões de ação em largura total.
- **Zoom 200%:** `overflow-wrap: anywhere` em `pre/code`; resultado e console
  rolam internamente (`max-height` 24rem/22rem) em vez de estourar a página.
- **`prefers-reduced-motion`:** animações/transições desligadas, fundo chapado.

## Componentes

- **Topbar:** marca, abas (Aprender/Laboratório/Sobre, `aria-current`), pílula
  de progresso `n/24`, botão de menu com `aria-expanded`. Link de pulo
  “Pular para o conteúdo” (só aparece no teclado).
- **Troca de aula:** `.lessonbar` no topo (← seletor agrupado por módulo
  com ✓ nas concluídas → + contador `n/24`); última aula visitada retoma
  sozinha ao abrir o site.
- **Exercício:** faixa verde lateral; ações Verificar/Carregar início;
  `details` de dica e solução (solução em bloco escuro, focável);
  **veredito** com `role="status"` + `aria-live` — estados `idle/checking/pass/fail`
  e `v-done` (aula já concluída, verde claro com borda sólida).
- **Bancada:** Executar (Ctrl+Enter) + Parar visíveis e Restaurar/Limpar
  em `details.more-actions` (sem selo de estado), editor CodeMirror
  (Python, indentação 4 espaços), bloco Resultado (`pre`, focável, borda
  vermelha em erro).
- **Modal de entrada:** sem caixa de entradas — cada `input()` sem resposta
  abre um `dialog` modal com o texto do prompt, campo com foco automático,
  Enter para enviar e Esc/clique fora para cancelar (até 10 entradas por
  execução).
- **Console REPL:** recolhido em `details.repl-wrap` (“Console extra”);
  prompts `>>>`/`...`, histórico com ↑/↓, blocos multilinha (linha vazia
  encerra), namespace compartilhado com o editor, log com `role="log"`.
- **Progressive disclosure:** a aula tem abas `1 · Ler` e `2 · Desafio`
  (só uma visível por vez); metas em `details.goals-box`, dica/solução em
  `details.reveal` e console em `details.repl-wrap`.

## Regras de revisão (lote “impecável”)

1. Todo interativo tem foco visível e nome acessível; alvos de toque ≥ 2.75rem.
2. Nada depende só de cor: vereditos e selos têm texto explícito.
3. Nenhum bloco de código estoura em 390px ou 200% (rolagem interna).
4. Correção aplicada nesta entrega: classe `v-done` emitida pelo App sem
   regra correspondente — adicionada em `styles.css` (fundo `#e7f2ec`,
   borda sólida `--accent-2`).
