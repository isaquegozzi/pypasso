import type { CourseModule, Lesson } from './types'

function L(lesson: Lesson): Lesson {
  return lesson
}

/**
 * Conteúdo autoral PT-BR: 8 módulos × 3 aulas = 24 microaulas.
 * Cada aula: explicação curta + exemplo editável (starterCode) + exercício
 * com dica, solução revelável e verificação comportamental pela SAÍDA
 * (múltiplas soluções passam, desde que imprimam o esperado).
 */
export const MODULES: CourseModule[] = [
  {
    id: 'primeiros-passos',
    title: '1 · Primeiros passos',
    description: 'print(), comentários e como lidar com erros.',
    lessons: [
      L({
        slug: 'print-primeiro-programa',
        moduleId: 'primeiros-passos',
        order: 1,
        title: 'Seu primeiro print()',
        goals: ['Usar print() para mostrar texto', 'Executar e editar um programa', 'Entender aspas e parênteses'],
        explanation:
          'Um programa em Python é uma lista de instruções que o computador executa de cima para baixo.\n\nA instrução print() mostra algo na tela. O texto (string) vai entre aspas, dentro dos parênteses:\n\nprint("Olá, mundo!")\n\nO exemplo ao lado já funciona. Aperte Executar, depois troque a mensagem e execute de novo — errar faz parte.',
        starterCode: 'print("Olá, mundo!")\nprint("Estou aprendendo Python!")\n',
        defaultInputs: '',
        exercise: {
          id: 'ex-print-cartao',
          title: 'Exercício: cartão de visita',
          prompt: 'Mostre exatamente estas 2 linhas:\nLinha 1: Meu nome é Ada\nLinha 2: Gosto de Python',
          starterCode: 'print("troque esta linha")\n',
          hint: 'Use dois print(), um por linha. Copie as frases exatamente, com maiúsculas e acentos iguais.',
          solution: 'print("Meu nome é Ada")\nprint("Gosto de Python")\n',
          check: { inputs: '', expected: 'Meu nome é Ada\nGosto de Python' },
          successMessage: 'Cartão pronto! Você domina o básico do print() — ele mostra uma linha por chamada.',
        },
      }),
      L({
        slug: 'comentarios',
        moduleId: 'primeiros-passos',
        order: 2,
        title: 'Comentários com #',
        goals: ['Explicar o código com comentários', 'Desligar linhas sem apagar', 'Manter o programa funcionando igual'],
        explanation:
          'Tudo que vem depois de # na mesma linha é um comentário: o Python ignora.\n\nComentários explicam o porquê para o seu "eu de amanhã":\n\n# mostra o total de pontos\nprint(10 + 5)  # soma bônus da fase\n\nUse para desligar uma linha temporariamente sem apagá-la. O programa continua funcionando.',
        starterCode: '# Meu caderno de testes\nprint("começando...")\n# print("esta linha está desligada")\nprint("terminei!")  # comentário no fim da linha\n',
        defaultInputs: '',
        exercise: {
          id: 'ex-comentario-receita',
          title: 'Exercício: receita comentada',
          prompt: 'Escreva um programa que mostre exatamente:\nPreaquecer o forno\nMisturar tudo\nAssar por 30 min\nE inclua pelo menos 1 comentário com # (qualquer texto). A saída deve ter só as 3 linhas acima.',
          starterCode: '# escreva seu programa abaixo\nprint("troque-me")\n',
          hint: 'Três print(), um por linha. O comentário pode ficar na primeira linha; ele não aparece na saída.',
          solution: '# receita de bolo\nprint("Preaquecer o forno")\nprint("Misturar tudo")\nprint("Assar por 30 min")\n',
          check: { inputs: '', expected: 'Preaquecer o forno\nMisturar tudo\nAssar por 30 min' },
          successMessage: 'Receita documentada! Comentários não mudam a saída — servem para humanos lerem.',
        },
      }),
      L({
        slug: 'erros-sao-normais',
        moduleId: 'primeiros-passos',
        order: 3,
        title: 'Erros são normais',
        goals: ['Ler a última linha do erro com calma', 'Achar a linha indicada', 'Corrigir parênteses e aspas'],
        explanation:
          'Todo programador vê erros — a mensagem é uma ajuda, não um castigo.\n\nLeia a ÚLTIMA linha primeiro: ela diz o tipo (ex.: SyntaxError) e muitas vezes a linha:\n\nprint("oi"\n# SyntaxError: faltou fechar o parêntese\n\nO exemplo ao lado tem um erro de propósito. Aperte Executar, leia o resultado e corrija.',
        starterCode: 'print("Falta um parêntese aqui..."\nprint("esta linha está certa")\n',
        defaultInputs: '',
        exercise: {
          id: 'ex-conserta-erro',
          title: 'Exercício: conserte o cartaz',
          prompt: 'Este programa quebrou. Corrija para mostrar exatamente:\nAtenção: aula às 19h',
          starterCode: 'print("Atenção: aula às 19h"\n',
          hint: 'Falta um parêntese de fechamento no fim. Compare com o exemplo da explicação.',
          solution: 'print("Atenção: aula às 19h")\n',
          check: { inputs: '', expected: 'Atenção: aula às 19h' },
          successMessage: 'Cartaz consertado! Ler o erro e corrigir a linha indicada já é programar de verdade.',
        },
      }),
    ],
  },
  {
    id: 'variaveis-operadores',
    title: '2 · Variáveis e operadores',
    description: 'Guardar valores, calcular e descobrir tipos com type().',
    lessons: [
      L({
        slug: 'variaveis',
        moduleId: 'variaveis-operadores',
        order: 1,
        title: 'Variáveis guardam valores',
        goals: ['Criar variáveis com =', 'Reutilizar valores pelo nome', 'Seguir regras de nomes'],
        explanation:
          'Uma variável é um nome que guarda um valor. O = guarda (não confunda com igualdade matemática):\n\nnome = "Ada"\npontos = 10\nprint(nome)\nprint(pontos)\n\nNomes usam letras, números e _ , sem espaço e sem começar por número. Troque os valores no exemplo e execute.',
        starterCode: 'nome = "Ada"\npontos = 10\nprint(nome)\nprint(pontos + 5)\n',
        defaultInputs: '',
        exercise: {
          id: 'ex-variavel-perfil',
          title: 'Exercício: miniperfil',
          prompt: 'Crie as variáveis cidade = "Olinda" e ano = 2026 e mostre exatamente:\nOlinda\n2026',
          starterCode: 'cidade = "troque-me"\nano = 0\nprint(cidade)\nprint(ano)\n',
          hint: 'Atribua os valores pedidos às duas variáveis e imprima cada uma com print().',
          solution: 'cidade = "Olinda"\nano = 2026\nprint(cidade)\nprint(ano)\n',
          check: { inputs: '', expected: 'Olinda\n2026' },
          successMessage: 'Perfil criado! Variáveis guardam para você reutilizar sem repetir valores.',
        },
      }),
      L({
        slug: 'operadores',
        moduleId: 'variaveis-operadores',
        order: 2,
        title: 'Operadores: a calculadora básica',
        goals: ['Somar, subtrair, multiplicar e dividir', 'Usar //, % e **', 'Respeitar a ordem das contas'],
        explanation:
          'Python calcula com +  -  *  / e três extras: // (divisão inteira), % (resto) e ** (potência).\n\nOrdem: primeiro **, depois * / // %, por fim + -. Parênteses mandam em tudo:\n\nprint(2 + 3 * 4)    # 14\nprint((2 + 3) * 4)  # 20\nprint(7 % 3)        # 1 (resto)',
        starterCode: 'a = 17\nb = 5\nprint(a + b)\nprint(a - b)\nprint(a * b)\nprint(a / b)\nprint(a // b)\nprint(a % b)\nprint(2 ** 3)\n',
        defaultInputs: '',
        exercise: {
          id: 'ex-operadores-troco',
          title: 'Exercício: resto da divisão',
          prompt: 'Com total = 17 e pessoas = 5, mostre exatamente estas 2 linhas:\n3\n2\nSendo a divisão inteira (//) e o resto (%) nessa ordem.',
          starterCode: 'total = 17\npessoas = 5\nprint(0)\nprint(0)\n',
          hint: 'Linha 1: total // pessoas. Linha 2: total % pessoas.',
          solution: 'total = 17\npessoas = 5\nprint(total // pessoas)\nprint(total % pessoas)\n',
          check: { inputs: '', expected: '3\n2' },
          successMessage: '// e % dominados! Servem para dividir contas, páginas e rodadas de jogo.',
        },
      }),
      L({
        slug: 'type-conversoes',
        moduleId: 'variaveis-operadores',
        order: 3,
        title: 'type() e conversões',
        goals: ['Ver o tipo com type()', 'Converter com int(), float() e str()', 'Evitar misturar texto com número'],
        explanation:
          'Todo valor tem um tipo: "7" (str, texto) é diferente de 7 (int, número). A função type() revela:\n\nprint(type("7"))  # <class \'str\'>\nprint(type(7))    # <class \'int\'>\n\nTexto + texto cola ("7" + "3" dá "73"); número + número soma. Converta com int(), float() e str() antes de misturar.',
        starterCode: 'print(type("7"))\nprint(type(7))\nprint(type(7.5))\nprint(int("21") + 1)\nprint(str(21) + "!")\n',
        defaultInputs: '',
        exercise: {
          id: 'ex-type-soma-texto',
          title: 'Exercício: somando textos',
          prompt: 'Dadas as strings a = "12" e b = "8", converta para int e mostre exatamente:\n20\n<class \'int\'>\n(Dica: a segunda linha é o type() da soma.)',
          starterCode: 'a = "12"\nb = "8"\nprint(0)\nprint(type("?"))\n',
          hint: 'Soma = int(a) + int(b). Depois mostre type(soma). Qualquer nome de variável vale.',
          solution: 'a = "12"\nb = "8"\nsoma = int(a) + int(b)\nprint(soma)\nprint(type(soma))\n',
          check: { inputs: '', expected: "20\n<class 'int'>" },
          successMessage: 'Conversão certa! Regra de ouro: converta texto em número antes de calcular.',
        },
      }),
    ],
  },
  {
    id: 'texto-entrada',
    title: '3 · Texto e entrada',
    description: 'f-strings, fatias de texto e leitura com input().',
    lessons: [
      L({
        slug: 'fstrings',
        moduleId: 'texto-entrada',
        order: 1,
        title: 'f-strings: texto com valores',
        goals: ['Montar frases com f"..."', 'Colocar variáveis entre { }', 'Formatar com :.2f e :.0f'],
        explanation:
          'Coloque f antes das aspas e variáveis entre chaves — o Python substitui:\n\nnome = "Ada"\npontos = 10\nprint(f"Olá, {nome}! Você tem {pontos} pontos.")\n\nPara números, formate: f"{3.14159:.2f}" mostra 3.14. Teste trocar nome e pontos no exemplo.',
        starterCode: 'nome = "Ada"\npontos = 10\nmedia = 8.567\nprint(f"Olá, {nome}! Você tem {pontos} pontos.")\nprint(f"Média: {media:.1f}")\n',
        defaultInputs: '',
        exercise: {
          id: 'ex-fstring-boletim',
          title: 'Exercício: boletim em 1 linha',
          prompt: 'Com nome = "Bia" e nota = 9.5, mostre exatamente:\nBia tirou 9.5!',
          starterCode: 'nome = "Bia"\nnota = 9.5\nprint("troque-me")\n',
          hint: 'Use f"..." com {nome} e {nota} dentro. Qualquer variável extra é permitida.',
          solution: 'nome = "Bia"\nnota = 9.5\nprint(f"{nome} tirou {nota}!")\n',
          check: { inputs: '', expected: 'Bia tirou 9.5!' },
          successMessage: 'Boletim impresso! f-strings deixam frases com valores muito mais legíveis.',
        },
      }),
      L({
        slug: 'fatias',
        moduleId: 'texto-entrada',
        order: 2,
        title: 'Fatias: pedaços do texto',
        goals: ['Acessar letras por índice', 'Fatiar com [início:fim]', 'Usar len() e negativos'],
        explanation:
          'Cada letra tem um número (índice), começando do 0. Índices negativos contam do fim:\n\npalavra = "Python"\nprint(palavra[0])    # P\nprint(palavra[-1])   # n\nprint(palavra[0:4])  # Pyth (do 0 até antes do 4)\nprint(len(palavra))  # 6\n\n[início:fim] pega do início até ANTES do fim. Experimente outros intervalos.',
        starterCode: 'palavra = "Python"\nprint(palavra[0])\nprint(palavra[-1])\nprint(palavra[0:4])\nprint(palavra[2:])\nprint(len(palavra))\n',
        defaultInputs: '',
        exercise: {
          id: 'ex-fatias-sigla',
          title: 'Exercício: sigla de 3 letras',
          prompt: 'Com palavra = "Brasília", mostre exatamente estas 3 linhas:\nB\nBras\n8\nOu seja: primeira letra, fatia [0:4] e o tamanho com len().',
          starterCode: 'palavra = "Brasília"\nprint("?")\nprint("?")\nprint(0)\n',
          hint: 'Linha 1: palavra[0]. Linha 2: palavra[0:4]. Linha 3: len(palavra).',
          solution: 'palavra = "Brasília"\nprint(palavra[0])\nprint(palavra[0:4])\nprint(len(palavra))\n',
          check: { inputs: '', expected: 'B\nBras\n8' },
          successMessage: 'Fatia perfeita! Índices e len() são a base para validar nomes, senhas e códigos.',
        },
      }),
      L({
        slug: 'input-pratica',
        moduleId: 'texto-entrada',
        order: 3,
        title: 'input() na prática',
        goals: ['Ler o teclado com input()', 'Usar a caixa Entradas', 'Converter com int()/float()'],
        explanation:
          'input() lê UMA linha da caixa Entradas e devolve sempre como texto (str).\n\nCada chamada consome uma linha, na ordem. Para calcular, converta:\n\nnome = input()        # 1ª linha das Entradas\nidade = int(input())  # 2ª linha, convertida\nprint(f"{nome} tem {idade + 1} ano(s) ano que vem.")\n\nO exemplo já vem com Entradas preenchidas. Adicione linhas se seu programa pedir mais.',
        starterCode: 'nome = input()\nidade = int(input())\nprint(f"{nome} tem {idade} anos.")\nprint(f"Ano que vem: {idade + 1}")\n',
        defaultInputs: 'Ada\n30',
        exercise: {
          id: 'ex-input-soma',
          title: 'Exercício: soma do teclado',
          prompt: 'Leia 2 números inteiros (um por input()) e mostre exatamente:\nSoma: 15\n(Com as entradas 7 e 8.)',
          starterCode: 'a = int(input())\nb = int(input())\nprint("troque-me")\n',
          hint: 'Some a + b e monte a frase com f"Soma: {soma}". Confira se há 2 linhas nas Entradas.',
          solution: 'a = int(input())\nb = int(input())\nprint(f"Soma: {a + b}")\n',
          check: { inputs: '7\n8', expected: 'Soma: 15' },
          successMessage: 'Soma lida do teclado! Lembre: input() sempre entrega texto — converta para somar.',
        },
      }),
    ],
  },
  {
    id: 'decisoes',
    title: '4 · Decisões',
    description: 'Comparações, if/elif/else e lógica com and, or, not.',
    lessons: [
      L({
        slug: 'comparacoes',
        moduleId: 'decisoes',
        order: 1,
        title: 'Comparando valores',
        goals: ['Usar ==, !=, >, <, >=, <=', 'Distinguir = de ==', 'Prever True/False'],
        explanation:
          'Comparações respondem True (verdadeiro) ou False (falso). Atenção: = guarda, == compara:\n\nprint(7 == 7)   # True\nprint(7 != 3)   # True (diferente)\nprint(5 > 9)    # False\nprint("ana" == "Ana")  # False (maiúscula conta!)\n\nTeste cada operador no exemplo. O resultado booleano é o que o if usa para decidir.',
        starterCode: 'print(7 == 7)\nprint(7 != 3)\nprint(5 > 9)\nprint(12 >= 12)\nprint("ana" == "Ana")\n',
        defaultInputs: '',
        exercise: {
          id: 'ex-maioridade-bool',
          title: 'Exercício: é maior de idade?',
          prompt: 'Com idade = 20, mostre exatamente:\nTrue',
          starterCode: 'idade = 20\nprint(False)\n',
          hint: 'Compare idade >= 18 dentro do print().',
          solution: 'idade = 20\nprint(idade >= 18)\n',
          check: { inputs: '', expected: 'True' },
          successMessage: 'Comparação correta! Booleanos True/False são a matéria-prima das decisões.',
        },
      }),
      L({
        slug: 'if-elif-else',
        moduleId: 'decisoes',
        order: 2,
        title: 'if, elif e else',
        goals: ['Desviar o fluxo com if/else', 'Encadear faixas com elif', 'Indentar com 4 espaços'],
        explanation:
          'O if executa o bloco só se a condição for True. Dois-pontos + indentação (4 espaços) marcam o bloco:\n\nnota = 8\nif nota >= 7:\n    print("Aprovado!")\nelif nota >= 5:\n    print("Recuperação")\nelse:\n    print("Reprovado")\n\nelif é "senão, se...". Só um dos blocos roda. Troque a nota e execute cada caminho.',
        starterCode: 'nota = int(input())\nif nota >= 7:\n    print("Aprovado!")\nelif nota >= 5:\n    print("Recuperação")\nelse:\n    print("Reprovado")\n',
        defaultInputs: '8',
        exercise: {
          id: 'ex-meia-entrada',
          title: 'Exercício: meia-entrada',
          prompt: 'Leia a idade (int(input())). Mostre exatamente:\n"Meia!" se idade < 18, senão "Inteira".\n(Verificação usa a entrada 15.)',
          starterCode: 'idade = int(input())\nprint("troque-me")\n',
          hint: 'if idade < 18: print("Meia!") else: print("Inteira"). Não esqueça os dois-pontos.',
          solution: 'idade = int(input())\nif idade < 18:\n    print("Meia!")\nelse:\n    print("Inteira")\n',
          check: { inputs: '15', expected: 'Meia!' },
          successMessage: 'Decisão tomada! if/else escolhe o caminho — a indentação diz o que pertence a cada um.',
        },
      }),
      L({
        slug: 'and-or-not',
        moduleId: 'decisoes',
        order: 3,
        title: 'and, or e not',
        goals: ['Combinar condições com and/or', 'Inverter com not', 'Evitar armadilhas de precedência'],
        explanation:
          'Para combinar: and exige as DUAS verdadeiras; or aceita UMA; not inverte:\n\nidade = 20\ntem_convite = True\nprint(idade >= 18 and tem_convite)  # True\nprint(idade < 18 or tem_convite)    # True\nprint(not tem_convite)              # False\n\nUse parênteses quando misturar: (a or b) and c. Teste trocar os valores.',
        starterCode: 'idade = 20\ntem_convite = True\nprint(idade >= 18 and tem_convite)\nprint(idade < 18 or tem_convite)\nprint(not tem_convite)\n',
        defaultInputs: '',
        exercise: {
          id: 'ex-acesso-festa',
          title: 'Exercício: pode entrar?',
          prompt: 'Com idade = 16 e acompanhado = True, mostre exatamente:\nPode entrar\nRegra: pode entrar se (idade >= 18) OR (acompanhado). Use and/or/not na solução.',
          starterCode: 'idade = 16\nacompanhado = True\n# mostre "Pode entrar" ou "Barrado"\nprint("troque-me")\n',
          hint: 'if idade >= 18 or acompanhado: print("Pode entrar") else: print("Barrado").',
          solution: 'idade = 16\nacompanhado = True\nif idade >= 18 or acompanhado:\n    print("Pode entrar")\nelse:\n    print("Barrado")\n',
          check: { inputs: '', expected: 'Pode entrar' },
          successMessage: 'Lógica afiada! or abre exceções, and fecha critérios, not inverte tudo.',
        },
      }),
    ],
  },
  {
    id: 'repeticoes',
    title: '5 · Repetições',
    description: 'for + range, while, break e continue.',
    lessons: [
      L({
        slug: 'for-range',
        moduleId: 'repeticoes',
        order: 1,
        title: 'for + range: repetir contando',
        goals: ['Repetir com for e range()', 'Entender que range(n) vai de 0 a n-1', 'Somar dentro do laço'],
        explanation:
          'for i in range(3): repete 3 vezes, com i valendo 0, 1, 2. range(1, 6) vai de 1 a 5; range(0, 10, 2) pula de 2 em 2.\n\nO corpo indentado roda a cada volta:\n\nfor i in range(3):\n    print(f"volta {i}")\n\nTroque o range e observe quantas linhas saem.',
        starterCode: 'for i in range(3):\n    print(f"volta {i}")\nprint("---")\nfor n in range(1, 6):\n    print(n)\n',
        defaultInputs: '',
        exercise: {
          id: 'ex-tabuada-2',
          title: 'Exercício: tabuada do 2',
          prompt: 'Com for + range, mostre exatamente estas 5 linhas:\n2 x 1 = 2\n2 x 2 = 4\n2 x 3 = 6\n2 x 4 = 8\n2 x 5 = 10',
          starterCode: 'for i in range(1, 6):\n    print("troque-me")\n',
          hint: 'Dentro do laço: print(f"2 x {i} = {2 * i}"). O range(1, 6) já dá 1..5.',
          solution: 'for i in range(1, 6):\n    print(f"2 x {i} = {2 * i}")\n',
          check: { inputs: '', expected: '2 x 1 = 2\n2 x 2 = 4\n2 x 3 = 6\n2 x 4 = 8\n2 x 5 = 10' },
          successMessage: 'Tabuada pronta! for + range é o carrossel oficial das repetições contadas.',
        },
      }),
      L({
        slug: 'while',
        moduleId: 'repeticoes',
        order: 2,
        title: 'while: repetir até parar',
        goals: ['Repetir enquanto a condição é True', 'Atualizar a variável de controle', 'Evitar loop infinito'],
        explanation:
          'while repete ENQUANTO a condição for verdadeira. Algo dentro precisa um dia torná-la falsa:\n\nn = 3\nwhile n > 0:\n    print(n)\n    n = n - 1  # sem esta linha, loop infinito!\nprint("Já!")\n\nSe travar, o limite de 5s interrompe e o botão Parar destrava. Teste tirar o -1 para sentir o perigo (com calma!).',
        starterCode: 'n = 3\nwhile n > 0:\n    print(n)\n    n = n - 1\nprint("Já!")\n',
        defaultInputs: '',
        exercise: {
          id: 'ex-contagem-regressiva',
          title: 'Exercício: contagem regressiva',
          prompt: 'Com while, a partir de n = 5, mostre exatamente:\n5\n4\n3\n2\n1\nFogo!',
          starterCode: 'n = 5\nwhile n > 0:\n    print("troque-me")\n',
          hint: 'Imprima n e depois faça n = n - 1. Fora do laço, imprima Fogo!.',
          solution: 'n = 5\nwhile n > 0:\n    print(n)\n    n = n - 1\nprint("Fogo!")\n',
          check: { inputs: '', expected: '5\n4\n3\n2\n1\nFogo!' },
          successMessage: 'Decolagem! while é ideal quando você não sabe quantas voltas serão.',
        },
      }),
      L({
        slug: 'break-continue',
        moduleId: 'repeticoes',
        order: 3,
        title: 'break e continue',
        goals: ['Sair do laço com break', 'Pular voltas com continue', 'Combinar com if'],
        explanation:
          'break sai do laço na hora; continue pula para a próxima volta:\n\nfor n in range(10):\n    if n == 3:\n        break  # para tudo no 3\n    if n % 2 == 0:\n        continue  # pula os pares\n    print(n)  # mostra 1\n\nLeia como: "se achou, pare; se não serve, pule". Teste mover as condições.',
        starterCode: 'for n in range(10):\n    if n == 5:\n        break\n    if n % 2 == 0:\n        continue\n    print(n)\n',
        defaultInputs: '',
        exercise: {
          id: 'ex-procura-numero',
          title: 'Exercício: pare no 7',
          prompt: 'Percorra range(20) e mostre só os ÍMPARES até encontrar o 7 (inclusive), usando continue e break. Saída exata:\n1\n3\n5\n7',
          starterCode: 'for n in range(20):\n    print("troque-me")\n',
          hint: 'Ordem: se n > 7: break; se n % 2 == 0: continue; senão print(n). Teste com 7 ímpar incluído.',
          solution: 'for n in range(20):\n    if n > 7:\n        break\n    if n % 2 == 0:\n        continue\n    print(n)\n',
          check: { inputs: '', expected: '1\n3\n5\n7' },
          successMessage: 'Freio e filtro no ponto! break/continue dão controle fino sobre qualquer laço.',
        },
      }),
    ],
  },
  {
    id: 'colecoes',
    title: '6 · Coleções',
    description: 'Listas, tuplas/conjuntos e dicionários.',
    lessons: [
      L({
        slug: 'listas',
        moduleId: 'colecoes',
        order: 1,
        title: 'Listas: vários valores juntos',
        goals: ['Criar listas e acessar por índice', 'Usar append() e len()', 'Percorrer com for'],
        explanation:
          'Listas guardam vários valores entre colchetes. A primeira posição é a 0:\n\nfrutas = ["maçã", "banana"]\nfrutas.append("uva")  # adiciona no fim\nprint(frutas[0])      # maçã\nprint(len(frutas))    # 3\nfor f in frutas:\n    print(f)\n\nListas aceitam repetidos e mudam depois de criadas. Adicione sua fruta favorita.',
        starterCode: 'frutas = ["maçã", "banana"]\nfrutas.append("uva")\nprint(frutas)\nprint(frutas[0])\nprint(len(frutas))\nfor f in frutas:\n    print(f)\n',
        defaultInputs: '',
        exercise: {
          id: 'ex-lista-media',
          title: 'Exercício: média da turma',
          prompt: 'Com notas = [7, 8, 9], mostre exatamente:\n8.0\n(Calcule com sum(notas) / len(notas).)',
          starterCode: 'notas = [7, 8, 9]\nprint(0)\n',
          hint: 'print(sum(notas) / len(notas)). sum() soma tudo; len() conta quantos são.',
          solution: 'notas = [7, 8, 9]\nprint(sum(notas) / len(notas))\n',
          check: { inputs: '', expected: '8.0' },
          successMessage: 'Média calculada! Listas + for + sum()/len() resolvem metade da vida real.',
        },
      }),
      L({
        slug: 'tuplas-conjuntos',
        moduleId: 'colecoes',
        order: 2,
        title: 'Tuplas e conjuntos',
        goals: ['Diferenciar lista, tupla e conjunto', 'Desempacotar tuplas', 'Eliminar repetidos com set()'],
        explanation:
          'Tupla (parênteses) é a lista "travada": não muda depois de criada — ótima para coordenadas e pares:\n\nponto = (3, 4)\nx, y = ponto  # desempacota\nprint(x, y)\n\nConjunto (chaves ou set()) guarda SEM repetidos e sem ordem garantida:\n\nprint(set([1, 2, 2, 3]))  # {1, 2, 3}\n\nTeste trocar valores e veja o que cada tipo permite.',
        starterCode: 'ponto = (3, 4)\nx, y = ponto\nprint(x)\nprint(y)\nconvidados = ["ana", "bia", "ana", "lia"]\nprint(set(convidados))\nprint(len(set(convidados)))\n',
        defaultInputs: '',
        exercise: {
          id: 'ex-votos-unicos',
          title: 'Exercício: votos únicos',
          prompt: 'Com votos = ["ana", "bia", "ana", "lia", "bia"], mostre exatamente:\n3\n(O número de nomes DIFERENTES, usando set() + len().)',
          starterCode: 'votos = ["ana", "bia", "ana", "lia", "bia"]\nprint(0)\n',
          hint: 'print(len(set(votos))). O set() remove repetidos antes de contar.',
          solution: 'votos = ["ana", "bia", "ana", "lia", "bia"]\nprint(len(set(votos)))\n',
          check: { inputs: '', expected: '3' },
          successMessage: 'Contagem sem repetidos! Conjuntos são o filtro natural de duplicatas.',
        },
      }),
      L({
        slug: 'dicionarios',
        moduleId: 'colecoes',
        order: 3,
        title: 'Dicionários: nome → valor',
        goals: ['Guardar pares chave-valor', 'Ler e atualizar por chave', 'Usar .get() com segurança'],
        explanation:
          'Dicionários guardam por NOME (chave) em vez de posição:\n\naluno = {"nome": "Ada", "nota": 9}\nprint(aluno["nome"])   # Ada\naluno["nota"] = 10     # atualiza\nprint(aluno)\n\n.get("tel", "—") devolve um padrão se a chave não existir, sem quebrar. Adicione um campo "cidade".',
        starterCode: 'aluno = {"nome": "Ada", "nota": 9}\nprint(aluno["nome"])\naluno["nota"] = 10\nprint(aluno)\nprint(aluno.get("tel", "sem telefone"))\n',
        defaultInputs: '',
        exercise: {
          id: 'ex-dict-cracha',
          title: 'Exercício: crachá',
          prompt: 'Com pessoa = {"nome": "Lia", "cargo": "dev", "turno": "noite"}, mostre exatamente:\nLia - dev (noite)',
          starterCode: 'pessoa = {"nome": "Lia", "cargo": "dev", "turno": "noite"}\nprint("troque-me")\n',
          hint: 'Monte com f-string: f"{pessoa[\'nome\']} - {pessoa[\'cargo\']} ({pessoa[\'turno\']})". Cuidado com as aspas.',
          solution: 'pessoa = {"nome": "Lia", "cargo": "dev", "turno": "noite"}\nprint(f"{pessoa[\'nome\']} - {pessoa[\'cargo\']} ({pessoa[\'turno\']})")\n',
          check: { inputs: '', expected: 'Lia - dev (noite)' },
          successMessage: 'Crachá impresso! Dicionários organizam fichas, cadastros e respostas de APIs.',
        },
      }),
    ],
  },
  {
    id: 'funcoes',
    title: '7 · Funções',
    description: 'def, parâmetros, return e organização.',
    lessons: [
      L({
        slug: 'def-organizacao',
        moduleId: 'funcoes',
        order: 1,
        title: 'def: organize em blocos',
        goals: ['Criar funções com def', 'Chamar funções pelo nome', 'Reaproveitar sem copiar e colar'],
        explanation:
          'def cria um bloco com nome. Nada roda até você CHAMAR com parênteses:\n\ndef linha():\n    print("-" * 20)\n\nlinha()  # agora sim executa\nlinha()\n\nFunções organizam: cada uma faz UMA coisa bem feita. Crie uma função aviso() no exemplo.',
        starterCode: 'def linha():\n    print("-" * 20)\n\nprint("Relatório")\nlinha()\nprint("Fim")\nlinha()\n',
        defaultInputs: '',
        exercise: {
          id: 'ex-def-selo',
          title: 'Exercício: carimbo duplo',
          prompt: 'Crie def selo(): que mostra "PyPasso!" e chame 2 vezes. Saída exata:\nPyPasso!\nPyPasso!',
          starterCode: 'def selo():\n    print("troque-me")\n',
          hint: 'Dentro da função: print("PyPasso!"). Fora (sem indentação): selo() duas vezes.',
          solution: 'def selo():\n    print("PyPasso!")\n\nselo()\nselo()\n',
          check: { inputs: '', expected: 'PyPasso!\nPyPasso!' },
          successMessage: 'Carimbo criado! Nomear um bloco e reutilizar é o coração da programação.',
        },
      }),
      L({
        slug: 'parametros',
        moduleId: 'funcoes',
        order: 2,
        title: 'Parâmetros: funções que recebem',
        goals: ['Passar valores entre parênteses', 'Usar o parâmetro dentro da função', 'Chamar com valores diferentes'],
        explanation:
          'Parâmetros são as ENTRADAS da função — nomes que recebem valores na chamada:\n\ndef ola(nome):\n    print(f"Olá, {nome}!")\n\nola("Ada")  # nome vale "Ada" aqui\nola("Bia")\n\nA mesma função serve para qualquer valor. Teste chamar com o seu nome.',
        starterCode: 'def ola(nome):\n    print(f"Olá, {nome}!")\n\nola("Ada")\nola("Bia")\n',
        defaultInputs: '',
        exercise: {
          id: 'ex-dobro-print',
          title: 'Exercício: etiqueta de preço',
          prompt: 'Crie def etiqueta(produto, preco): que mostra "X custa R$ Y". Chame com ("caderno", 25) e ("caneta", 4). Saída exata:\ncaderno custa R$ 25\ncaneta custa R$ 4',
          starterCode: 'def etiqueta(produto, preco):\n    print("troque-me")\n',
          hint: 'Dentro: print(f"{produto} custa R$ {preco}"). Depois chame 2 vezes com os valores pedidos.',
          solution: 'def etiqueta(produto, preco):\n    print(f"{produto} custa R$ {preco}")\n\netiqueta("caderno", 25)\netiqueta("caneta", 4)\n',
          check: { inputs: '', expected: 'caderno custa R$ 25\ncaneta custa R$ 4' },
          successMessage: 'Etiquetas impressas! Parâmetros transformam funções fixas em ferramentas flexíveis.',
        },
      }),
      L({
        slug: 'return',
        moduleId: 'funcoes',
        order: 3,
        title: 'return: funções que devolvem',
        goals: ['Devolver valores com return', 'Guardar o retorno em variável', 'Distinguir print de return'],
        explanation:
          'print mostra na tela; return ENTREGA um valor para quem chamou:\n\ndef dobro(n):\n    return n * 2\n\nr = dobro(5)  # r vale 10\nprint(r)\n\nSem return, a função faz mas não entrega (vale None). Teste somar dois retornos: dobro(3) + dobro(4).',
        starterCode: 'def dobro(n):\n    return n * 2\n\nprint(dobro(5))\nr = dobro(7)\nprint(f"dobro de 7 = {r}")\n',
        defaultInputs: '',
        exercise: {
          id: 'ex-area-retangulo',
          title: 'Exercício: área com return',
          prompt: 'Crie def area(larg, alt): que RETORNA larg * alt. Depois mostre exatamente:\n20\n(Chamando area(4, 5) dentro de um print.)',
          starterCode: 'def area(larg, alt):\n    return 0\n\nprint(area(4, 5))\n',
          hint: 'Troque return 0 por return larg * alt. O print da chamada já está pronto.',
          solution: 'def area(larg, alt):\n    return larg * alt\n\nprint(area(4, 5))\n',
          check: { inputs: '', expected: '20' },
          successMessage: 'Área entregue! return permite encadear funções como peças de Lego.',
        },
      }),
    ],
  },
  {
    id: 'erros-bibliotecas-projeto',
    title: '8 · Erros, bibliotecas e projeto',
    description: 'try/except, import math/random e a calculadora integradora.',
    lessons: [
      L({
        slug: 'try-except',
        moduleId: 'erros-bibliotecas-projeto',
        order: 1,
        title: 'try/except: programa à prova de sustos',
        goals: ['Proteger trechos com try/except', 'Tratar ValueError e ZeroDivisionError', 'Dar mensagem amigável'],
        explanation:
          'Quando algo pode falhar (digitação, divisão), proteja com try/except em vez de deixar quebrar:\n\ntry:\n    n = int(input())\n    print(10 / n)\nexcept ValueError:\n    print("Digite um número!")\nexcept ZeroDivisionError:\n    print("Não divido por zero!")\n\nO exemplo vem com entrada válida. Troque para "abc" ou "0" e veja cada ramo proteger.',
        starterCode: 'try:\n    n = int(input())\n    print(10 / n)\nexcept ValueError:\n    print("Digite um número!")\nexcept ZeroDivisionError:\n    print("Não divido por zero!")\n',
        defaultInputs: '2',
        exercise: {
          id: 'ex-try-queda',
          title: 'Exercício: divisão segura',
          prompt: 'Leia n (int) e mostre 100 / n. Se n for 0, mostre exatamente:\nIndivisível!\n(Use try/except ZeroDivisionError. Verificação usa a entrada 0.)',
          starterCode: 'try:\n    n = int(input())\n    print(100 / n)\nexcept ZeroDivisionError:\n    print("troque-me")\n',
          hint: 'No except, coloque print("Indivisível!"). Teste com Entradas = 0 e depois com 4.',
          solution: 'try:\n    n = int(input())\n    print(100 / n)\nexcept ZeroDivisionError:\n    print("Indivisível!")\n',
          check: { inputs: '0', expected: 'Indivisível!' },
          successMessage: 'Queda amortecida! try/except separa o caminho feliz do plano B.',
        },
      }),
      L({
        slug: 'math-random',
        moduleId: 'erros-bibliotecas-projeto',
        order: 2,
        title: 'import: math e random',
        goals: ['Importar módulos da biblioteca padrão', 'Usar math.sqrt/pi/floor', 'Sortear com random'],
        explanation:
          'import traz ferramentas prontas. math tem cálculos; random tem sorteios:\n\nimport math\nimport random\nprint(math.sqrt(16))  # 4.0\nprint(math.pi)        # 3.14159...\nprint(random.randint(1, 6))  # dado de 6 lados\n\nNão reinvente a roda: a biblioteca padrão já resolveu. Rode várias vezes e veja o dado mudar.',
        starterCode: 'import math\nimport random\nprint(math.sqrt(16))\nprint(math.floor(9.7))\nprint(f"pi = {math.pi:.2f}")\nprint(random.randint(1, 6))\nprint(random.choice(["cara", "coroa"]))\n',
        defaultInputs: '',
        exercise: {
          id: 'ex-hipotenusa',
          title: 'Exercício: hipotenusa',
          prompt: 'Importe math, leia catetos 3 e 4 (um input() cada) e mostre exatamente:\n5.0\n(Use math.sqrt(a*a + b*b). Verificação usa entradas 3 e 4.)',
          starterCode: 'import math\na = int(input())\nb = int(input())\nprint(0)\n',
          hint: 'print(math.sqrt(a * a + b * b)). Com 3 e 4 o resultado é 5.0.',
          solution: 'import math\na = int(input())\nb = int(input())\nprint(math.sqrt(a * a + b * b))\n',
          check: { inputs: '3\n4', expected: '5.0' },
          successMessage: 'Pitágoras aprovado! import + math resolvem geometria em 1 linha.',
        },
      }),
      L({
        slug: 'calculadora-integradora',
        moduleId: 'erros-bibliotecas-projeto',
        order: 3,
        title: 'Projeto: calculadora PyPasso',
        goals: ['Juntar funções, if, input e try/except', 'Organizar uma operação por função', 'Entregar um programa completo'],
        explanation:
          'Hora de juntar tudo: funções por operação + if/elif para o menu + try/except contra sustos.\n\nO exemplo lê operação e dois números da caixa Entradas (uma linha cada):\n\n+ na 1ª linha, 10 na 2ª, 5 na 3ª → Resultado: 15.0\n\nTeste as 4 operações e a divisão por zero. Este é seu projeto integrador — capriche e marque como concluído!',
        starterCode: 'def somar(a, b):\n    return a + b\n\ndef subtrair(a, b):\n    return a - b\n\ndef multiplicar(a, b):\n    return a * b\n\ndef dividir(a, b):\n    if b == 0:\n        return "Não dá para dividir por zero!"\n    return a / b\n\nprint("=== Calculadora PyPasso ===")\nprint("Operações: +  -  *  /")\ntry:\n    op = input()\n    a = float(input())\n    b = float(input())\n    if op == "+":\n        print(f"Resultado: {somar(a, b)}")\n    elif op == "-":\n        print(f"Resultado: {subtrair(a, b)}")\n    elif op == "*":\n        print(f"Resultado: {multiplicar(a, b)}")\n    elif op == "/":\n        print(f"Resultado: {dividir(a, b)}")\n    else:\n        print("Operação desconhecida. Use + - * /")\nexcept ValueError:\n    print("Número inválido! Digite números como 10 ou 2.5.")\n',
        defaultInputs: '+\n10\n5',
        exercise: {
          id: 'ex-calculadora-final',
          title: 'Desafio final: feche a calculadora',
          prompt: 'Usando o exemplo como base, garanta que com as entradas * , 6 e 7 a saída termine com:\nResultado: 42.0\n(Qualquer cabeçalho extra é permitido, desde que a ÚLTIMA linha seja essa.)',
          starterCode: 'def somar(a, b):\n    return a + b\n\ndef subtrair(a, b):\n    return a - b\n\ndef multiplicar(a, b):\n    return a * b\n\ndef dividir(a, b):\n    if b == 0:\n        return "Não dá para dividir por zero!"\n    return a / b\n\nop = input()\na = float(input())\nb = float(input())\nprint("troque-me")\n',
          hint: 'Use if/elif para as 4 operações como no exemplo. Teste com Entradas: * (linha 1), 6 (linha 2), 7 (linha 3).',
          solution: 'def somar(a, b):\n    return a + b\n\ndef subtrair(a, b):\n    return a - b\n\ndef multiplicar(a, b):\n    return a * b\n\ndef dividir(a, b):\n    if b == 0:\n        return "Não dá para dividir por zero!"\n    return a / b\n\nop = input()\na = float(input())\nb = float(input())\nif op == "+":\n    print(f"Resultado: {somar(a, b)}")\nelif op == "-":\n    print(f"Resultado: {subtrair(a, b)}")\nelif op == "*":\n    print(f"Resultado: {multiplicar(a, b)}")\nelif op == "/":\n    print(f"Resultado: {dividir(a, b)}")\nelse:\n    print("Operação desconhecida. Use + - * /")\n',
          check: { inputs: '*\n6\n7', expected: 'Resultado: 42.0' },
          successMessage: 'Calculadora entregue! Você juntou print, variáveis, input, if, funções e try/except. Retome esta aula quando quiser revisar — ela resume o curso inteiro.',
        },
      }),
    ],
  },
]

export const ALL_LESSONS: Lesson[] = MODULES.flatMap((m) => m.lessons)

export function findLesson(slug: string): Lesson | undefined {
  return ALL_LESSONS.find((l) => l.slug === slug)
}

export function lessonNeighbors(slug: string): { prev?: Lesson; next?: Lesson } {
  const i = ALL_LESSONS.findIndex((l) => l.slug === slug)
  if (i < 0) return {}
  return { prev: ALL_LESSONS[i - 1], next: ALL_LESSONS[i + 1] }
}

/** Normaliza saída para verificação comportamental (múltiplas soluções passam). */
export function normalizeOutput(s: string): string {
  return s
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.replace(/[ \t]+$/g, ''))
    .join('\n')
    .replace(/^\n+/, '')
    .replace(/\n+$/, '')
}

/** Compara saída obtida × esperada; última-aula aceita "termina com" para permitir cabeçalho. */
export function outputsMatch(obtained: string, expected: string, endsWith = false): boolean {
  const a = normalizeOutput(obtained)
  const b = normalizeOutput(expected)
  if (endsWith) return a === b || a.endsWith('\n' + b) || a.endsWith(b)
  return a === b
}

