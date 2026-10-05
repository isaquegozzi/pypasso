# PyPasso

Caderno interativo em português para aprender Python do zero, direto no navegador. São 8 módulos com 3 microaulas cada, o que dá 24 aulas curtas. Cada aula tem um exemplo editável e um exercício corrigido automaticamente. O curso termina num projeto de calculadora.

Não é preciso instalar Python, nem criar conta, nem ter servidor. O Python roda dentro do navegador, via Pyodide, que é o CPython compilado para WebAssembly.

## Estado atual

Curso completo: as 24 aulas existem, com explicação, objetivos, código inicial e exercício corrigido.

O que já funciona:

- Navegação por hash entre as aulas, com seletor agrupado por módulo, contador de progresso e indicação de aula concluída.
- Editor de código com realce de sintaxe Python, executável por botão ou por `Ctrl`/`Cmd + Enter`.
- Execução do Python em um Web Worker, com um console REPL opcional que compartilha as variáveis com o editor.
- Correção do exercício pela saída do programa.
- Persistência de progresso e rascunhos no navegador.
- Tema claro e escuro.
- Um laboratório livre, separado das aulas.

O que não está resolvido:

- **Não há suíte de testes.** A única verificação automatizada é a checagem de tipos do TypeScript, que roda dentro do `build`.
- **O projeto não tem arquivo de licença.**
- A documentação e parte do texto da aplicação ainda citam uma caixa de texto de entradas que não existe mais. Hoje o `input()` abre uma janela modal.

## Funcionalidades implementadas

### Percurso do curso

- Navegação por hash entre as aulas, com seletor agrupado por módulo, contador de progresso e indicação de aula concluída.
- Cada aula tem duas abas: **Ler**, com objetivos e explicação, e **Desafio**, com o enunciado e o botão de verificação.
- O editor já vem preenchido com o código inicial da aula, ou com o rascunho do aluno.
- Botões de executar, parar, restaurar o código inicial e limpar.
- Bloco de resultado com os erros traduzidos para português, indicando a dica e o número da linha.

### Execução do Python

- O Python roda em um Web Worker, com o Pyodide carregado sob demanda.
- Cada execução tem limite de 5 segundos e o limite é de uma execução por vez.
- Há uma nova tentativa automática se o Pyodide falhar ao carregar.
- Console REPL opcional, com histórico, que compartilha as variáveis com o editor.
- Respostas de `input()` são coletadas em uma janela modal e o programa roda de novo com a resposta.

### Correção e progresso

- O exercício é verificado comparando a saída do programa com a saída esperada. O mecanismo está detalhado abaixo.
- A aula é marcada como concluída automaticamente quando o exercício passa.
- A marcação também pode ser feita manualmente.
- Progresso e rascunhos são gravados no navegador, com salvamento automático.
- Um laboratório separado das aulas, com rascunho próprio.
- Tema claro e escuro, respeitando a preferência do sistema na primeira visita.

### Como o exercício é corrigido

Este é o ponto central do projeto, e vale explicar direito.

**A correção compara a saída do programa, não o texto do código.** O aluno pode escrever a solução como quiser, desde que imprima o resultado esperado.

O mecanismo:

1. O botão **Verificar** roda o código que está no editor, alimentando a entrada padrão com valores fixos da aula.
2. Se o programa terminar com erro, a tentativa é reprovada e o motivo aparece.
3. Se terminar bem, a saída é comparada com a saída esperada, depois de normalizar quebras de linha, espaços no fim de cada linha e linhas em branco nas pontas.
4. A comparação é de igualdade exata da saída inteira. Não há análise de sintaxe nem de lógica.

Consequência prática: um programa que calcula certo mas imprime de outro jeito é reprovado. Existe uma única exceção, a última aula, a do projeto da calculadora, que aceita a saída terminada com o valor esperado, para permitir uma linha de cabeçalho a mais.

O campo `solution` existe em cada exercício e aparece num bloco "Ver solução", mas **não participa da correção**.

Como o `input()` funciona, já que a aula é sobre entrada de dados:

- Não existe campo para digitar entradas. Quando o programa chama `input()` e não há resposta, abre uma janela modal mostrando o texto exato do pedido.
- Cada resposta coletada faz o programa **rodar de novo desde o início**.
- São aceitas no máximo 10 entradas por execução.
- O console REPL recusa `input()`.

Das 24 aulas, 5 têm exercício com entrada.

## Tecnologias

| | Versão declarada | Versão instalada |
|---|---|---|
| React | ^18.3.1 | 18.3.1 |
| Vite | ^6.0.3 | 6.4.3 |
| TypeScript | ^5.6.3 | 5.9.3 |
| `@uiw/react-codemirror` | ^4.23.10 | 4.25.12 |
| `@codemirror/lang-python` | ^6.1.6 | 6.2.1 |
| `@codemirror/language` | ^6.12.4 | 6.12.4 |

- **Pyodide na versão 0.26.4**, carregado em tempo de execução de um CDN. Não é uma dependência do npm.
- **CodeMirror 6** como editor, com indentação de 4 espaços e osprompts `>>>` e `...` no console.
- **Web Worker** em formato de módulo. O Pyodide roda inteiramente na worker; a thread principal nunca executa Python.
- TypeScript em modo estrito, com `noUncheckedIndexedAccess`.

O Pyodide é importado por URL, com `import()` dinâmico e um comentário no código explicando que `importScripts()` não é usado porque a worker é um módulo ES.

## Como executar

### Requisitos

Node.js 18 ou superior e npm. A regra de versão do Vite aceita Node 18, 20 ou 22 em diante.

**A internet é necessária na primeira execução**, porque o Pyodide e a biblioteca padrão são baixados do CDN. Sem rede, o aplicativo abre, mas a execução falha com uma mensagem explicando o problema, depois de uma nova tentativa automática.

### Comandos

```bash
npm install
npm run dev       # servidor de desenvolvimento
npm run build     # checagem de tipos e depois build de produção
npm run preview   # serve o build
```

O `npm run build` executa `tsc` antes do Vite, então erro de tipo impede o build.

O build gera um site estático em `dist/`, com caminhos absolutos para os arquivos em `/assets/`. Isso significa que ele precisa ser hospedado na raiz de um domínio.

O projeto **não usa variáveis de ambiente**. Nenhum arquivo em `src/` lê `import.meta.env` ou `process.env`.

## Como usar

1. Abra o site. Ele começa na última aula visitada, ou na primeira.
2. A tela tem duas abas: **Ler**, com os objetivos e a explicação, e **Desafio**, com o enunciado e o botão **Verificar**.
3. O editor já vem com o código inicial da aula, ou com o seu rascunho salvo.
4. Edite e execute com **Executar** ou `Ctrl`/`Cmd + Enter`.
5. Se o programa pedir entrada, responda na janela que aparecer. O programa roda de novo com a resposta.
6. Leia o resultado no bloco abaixo do editor. Erros vêm traduzidos para português, com a dica e o número da linha.
7. Na aba **Desafio**, clique em **Verificar**. Se passar, a aula é marcada como concluída e aparece a mensagem de sucesso.
8. Passe para a próxima aula com a seta na barra de aulas.
9. Opcionalmente, use o console REPL para experimentar comandos. Ele divide as variáveis com o editor.
10. A aba **Laboratório** é um editor livre, com rascunho próprio, para praticar sem exercício.

O progresso e os rascunhos são gravados no `localStorage`, na chave `pypasso:v1`, com salvamento automático meio segundo depois de cada edição. O tema fica em outra chave, `pypasso:tema`.

## O conteúdo do curso

O curso inteiro está em `src/content.ts`, 606 linhas. O resto do código são 1.301 linhas.

| Módulo | Aulas |
|---|---|
| 1. Primeiros passos | Seu primeiro `print()`, comentários com `#`, erros são normais |
| 2. Variáveis e operadores | Variáveis, operadores, `type()` e conversões |
| 3. Texto e entrada | f-strings, fatiamento de texto, `input()` na prática |
| 4. Decisões | Comparações, `if`/`elif`/`else`, `and`/`or`/`not` |
| 5. Repetições | `for` com `range`, `while`, `break` e `continue` |
| 6. Coleções | Listas, tuplas e conjuntos, dicionários |
| 7. Funções | `def` para organizar, parâmetros, `return` |
| 8. Erros, bibliotecas e projeto | `try`/`except`, `math` e `random`, projeto da calculadora |

## Organização do projeto

| Arquivo | Responsabilidade |
|---|---|
| `src/App.tsx` | Toda a interface: rotas, telas, editor, REPL, exercício |
| `src/content.ts` | O curso: módulos, aulas e exercícios, mais as funções de comparação de saída |
| `src/executor.ts` | Worker, timeout, limite de execução e tradução de erros |
| `src/pyodide-worker.ts` | O Web Worker: carrega o Pyodide e executa o código |
| `src/storage.ts` | Leitura e gravação do progresso no `localStorage` |
| `src/styles.css` | Estilos, com tema claro e escuro |
| `src/types.ts` | Tipos do curso e do progresso |
| `docs/VISUAL.md` | Documento do sistema visual |

## Limitações e pendências

### Restrições de funcionamento

- **Sem internet, o Python não carrega.** O Pyodide vem do CDN e não é empacotado.
- **Cada execução tem 5 segundos de limite.** Passando disso, a worker é destruída e recriada, com a mensagem explicando que provavelmente é um laço infinito.
- **Uma execução por vez.** Pedir outra enquanto há uma em andamento devolve um aviso para esperar.
- **O código é limitado a 50.000 caracteres.**
- **Não há sistema de arquivos, rede nem interface gráfica.** Não dá para usar `tkinter` ou `pygame`.
- **O progresso fica só neste navegador.** Limpar os dados do site apaga tudo. Não há conta, servidor nem sincronização.
- **O histórico do console REPL guarda 100 entradas.**

### Limitações da correção

- **A comparação é da saída inteira, depois de normalizar espaços.** Um resultado correto com formatação diferente é reprovado.
- **As entradas dos exercícios são fixas.** Se o código do aluno pedir um número diferente de entradas, a execução falha por falta de entrada.
- **Cada resposta dada ao `input()` reexecuta o programa inteiro**, então efeitos colaterais são repetidos.

### Problemas conhecidos

- **O texto da aplicação e de 3 exercícios ainda fala em "caixa de entradas"**, que foi substituída pela janela modal. Está em `App.tsx` na tela "Sobre" e em três dicas de exercício.
- **O campo `defaultInputs` está declarado e preenchido, mas nunca é lido.** Sobrou de quando existia a caixa de entradas.
- **A pasta `dist/` do repositório está desatualizada** em relação ao código atual: foi gerada antes do tema escuro, das abas e da janela modal.
- **Não havia `.gitignore` no projeto.** Um foi criado na publicação, ignorando `node_modules`, `dist` e a configuração local de ferramentas de IA.
- **`docs/VISUAL.md` descreve o layout como "duas colunas mais uma barra de aula"**, que é o estado atual, mas o README antigo dizia três colunas.

### Não implementado

- Múltipla escolha, comparação de texto de código ou qualquer outro tipo de exercício além da comparação de saída.
- Console REPL com `input()`.
- Exportação de progresso.

## Próximos passos

O projeto não tem seção de próximos passos, nem lista de pendências na documentação. Não há roadmap registrado, e não é-appropriate inventar um.

O que a documentação aponta hoje é o conjunto de correções já aplicadas na última entrega, registrado em `docs/VISUAL.md` como regra de revisão.

## Testes

**Não há testes automatizados.** Não existe suíte, framework, nem pasta de testes. O `package.json` tem apenas três scripts: `dev`, `build` e `preview`.

A única verificação automatizada é a checagem de tipos, que faz parte do build:

```bash
npm run build
```

Ela executa `tsc -p tsconfig.json` antes do Vite. Isso pega erro de tipo e não verifica comportamento.

## Licença

O projeto **não tem arquivo de licença**. O `package.json` está marcado como privado e não declara licença. Se for reutilizar o material, é preciso escolher uma licença.