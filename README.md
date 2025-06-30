PRISM.AMADO - PASSO A PASSO PARA EXECUTAR O PROJETO EM OUTRO COMPUTADOR

Requisitos:
-------------
1. Node.js instalado (https://nodejs.org)
2. Editor de código (opcional, ex: VS Code)
3. Terminal ou prompt de comando

Como Rodar o Projeto:
------------------------
1. Copie a pasta completa do projeto para o novo computador.

2. Abra o terminal na pasta do projeto:
   - No Windows: Shift + clique com o botão direito na pasta > "Abrir terminal aqui".

3. Instale as dependências do Node.js:
   npm install

4. Inicie o servidor:
   node server.js

5. Acesse no navegador:
   http://localhost:3000

 Observações:
--------------
- O arquivo database.db já vem com a estrutura. Se estiver ausente, as tabelas serão criadas automaticamente ao rodar o servidor.
- Se a porta 3000 estiver ocupada, altere no arquivo server.js para outra porta (ex: 3001).

Problemas comuns:
-------------------
- Erro: "command not found: npm" → Node.js não está instalado corretamente.
- Erro: "Cannot find module 'express'" → Faltou rodar `npm install`.
- Erro: "EADDRINUSE: port 3000" → Porta já usada, mude a porta no server.js.

Estrutura esperada do projeto:
---------------------------------
- server.js
- package.json
- database.db
- public/
  - index.html
  - style.css
  - script.js
  - formulario.html
  - formulario-denuncia.html
  - imagens/


