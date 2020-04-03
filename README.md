<h1>Go Barber</h1>

<h2>Iniciar novo projeto</h2>

```bash
yarn init -y
```

- Dessa forma cria o arquivo `package.json`

---

<h2>Instalar o express</h2>

```bash
yarn add express
```

---

<h2>Criar pasta src/</h2>

- Adicionar o arquivo `app.js`

- Adicionar o arquivo `routes.js`

- Adicionar o arquivo `server.js`

- No conteudo dos arquivos será no formato de class

- Uma estrutura básica para o arquivo `src/app.js`:

```js
import express from 'express';
import path from 'path';
import routes from './routes';

class App {
    constructor() {
        this.server = express();

        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.server.use(Sentry.Handlers.requestHandler());

        this.server.use(express.json());
        this.server.use(
            '/files',
            express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
        );
    }

    routes() {
        this.server.use(routes);
    }
}

export default new App().server;
```

- No arquivo `src/server.js` adicionar o seguinte:

```js
import app from './app';

app.listen(3333);
```

- Esse modelo separado o `app.listen()` da class `App` do arquivo `src/app.js` é para depois quando for realizar testes na aplicação, por isso separar dessa forma.

- No arquivo `src/routes.js` inserimos nossas rotas:

```js
import { Router } from 'express';

const routes = new Router();

// ... adicionar rotas

export default routes;
```

----

<h2>Utilizar o surcrase para utilizar funcionalidades de `import/export`</h2>

- [ES6 no NodeJS - Sucrase](https://github.com/mrcarromesa/sucrase)

---

<h2>Docker</h2>

- Criação de ambientes isolados(containers)

- Não precisa instalar programas direto no sistema operacional, no qual irá gerar vários arquivos desnecessários e quando precisar realizar alguma nova instalação/atualização será bem mais fácil de implementar.

- Utiliza portas para comunicação.

- Conceito
    - Imagem é o serviço ou programa como o Postgres, ou Mongo
    - Container irá conter a imagem

- Configurar o Docker:

- Documentação do docker:

- Procurar no google Docker CE, ou:

- [Docker Engine overview](https://docs.docker.com/install/)

- Instalação para Mac:

[Get started with Docker Desktop for Mac](https://docs.docker.com/docker-for-mac/)

- Instalar o postgres, Buscar no google docekr postgres, ou acessar:

[Postgres](https://hub.docker.com/_/postgres)

**Instalar base postgres:**
```
docker run --name database -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres:11
```
**Detalhes:**
>-p  X:Y

>-p = porta

>X = porta na minha máquina, escolher alguma disponível.

>Y = Porta equivalente no docker para emparelhar com a porta X.

>postgres:ZZ

>ZZ = versão da base de dados

----
**Comandos Docker**

* parar docker:
```
docker stop <nome do docker>
```

* Mostrar todos os docker mesmo os que estão parados
```
docker ps -a
```

* Mostrar apenas os docker em execução
```
docker ps
```

* Iniciar o container:
```
docker start <nome do docker>
```

* Ver log do docker:
```
docker log <nome do docker>
```

----

- Inteface gráfica para o postgres:

[Postbird](https://www.electronjs.org/apps/postbird)

---

<h2>Sequelize</h2>

<h3>ORM</h3>

- Abstração do banco de dados
- Tabelas viram models
- Sem SQL, apenas código javascript, EX.:

Ao invés de fazer dessa maneira:

```sql
INSERT INTO users(name, email) VALUES ("Nome", "email@email.com");
```

Realizamos dessa forma:

```js
User.create({
    name: "Nome",
    email: "email@email.com",
});
```

Outro exemplo:

```sql
SELECT * FROM users WHERE email="email@email.com" LIMIT 1;
```

Em js:

```js
User.findOne({
    where: {
        email: "email@email.com"
    }
});
```

<h3>Migrations</h3>

- Controle de versão para base de dados

- Cada arquivo contém instruções para criação, alteração ou remoção de tabelas ou colunas

- Mantém a base de dados atualizada entre todos desenvolvedores do time e também no ambiente de produção

- Cada arquivo é uma migration e sua ordenação ocorre por data

- Exemplo de migration:

```js
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('users', { //Cria uma tabela com nome users
            id: { //Coluna
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            name: { //Coluna
                type: Sequelize.STRING,
                allowNull: false,
            },
            email: { //Coluna
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
        });
    },

    down: queryInterface => { //Rollback
        return queryInterface.dropTable('users');
    },
};

```

- Quando eu repasso a migration para outro dev, devo evitar alterar essa migration, e caso precisar alterar algo na tabela, seja para alterar/remover/adicionar campo, devo criar uma nova migration.

- Em ambiente de desenvolvimento em caso de erro podemos utilizar o rollback, porém em ambiente de desenvolvimento jamais devo alterar essa migration.

- Cada migration deve criar/alterar/remover uma única tabela

<h2>Seeds</h2>

- Criar dados ficticios na aplicação

- Utilizado para popular dados para testes

- Jamais utilizar em produção

- Mas caso precise adicionar os dados na tabela em produção é melhor utilizar a migration ao invés do seeds

<h2>Arquitetura MVC</h2>

- M: Model => Armazena a abstração do banco, manipula dados da tabela, não tem responsabilidade sobre a regra de negócio da aplicação

- C: Controller => Ponto de entrada das requisições uma rota geralmente está associada com o controller, grande parte da regra de negócios podemos incluir no controller.

    - Sempre será uma classe
    - Sempre retorna um JSON
    - Não chama outro controller/ ou método dele mesmo;
    - Quando criar um controller:
        - Máximo de 5 metodos: (index{listar}, store{inserir}, update{atualizar}, delete{remover}, show{exibir um único registro})
        - Quando tiver uma entidade, que não necessariamente é o mesmo que model,

- V: View => retorno ao cliente em aplicações que não utilizam API REST isso pode retornar um HTML, porém nesse projeto a View será apenas um JSON que será consumido pelo front-end

---

<h2>ESLint e Prettier</h2>

- Alguns detalhes em [Utilizar ESLint VSCode](https://github.com/mrcarromesa/eslint)

- Instalar o ESLint em Desenvolvimento:

```bash
yarn add eslint -D
```

- Com ele instalado executar:

```bash
yarn eslint --init
```

- Pergunta: `How would you like to use ESLint?`:

- Resposta: `To check syntax, find problems, and enforce code style`

- Pergunta: `What type of modules does your project use?`

- Resposta: `JavaScript modules (import/export)`

- Pergunta: `Which framework does your project use?`

- Resposta: `None of these`

- Pergunta: `Does your project use TypeScript?`

- Resposta: `N`

- Pergunta: `Where does your code run?`

- Reposta: `Node`

- Pergunta: `How would you like to define a style for your project?`

- Resposta: `Use a popular style guide`

- Pergunta: `Which style guide do you want to follow?`

- Resposta: `Airbnb (https://github.com/airbnb/javascript)`

- Pergunta: `What format do you want your config file to be in?`

- Resposta: `JavaScript`

---

- Será instalado utilizando o npm, será gerado o `package.json.lock` então vamos remover esse arquivo e executar o comando:

```bash
yarn
```

- E será gerado um arquivo `.eslintrc.js` na raiz do projeto

- No VSCode instalar o plugin: [ESLint - Code Style Guide](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

- Nas configurações do VSCode:

- No mac OS Pressionar `command + shift + P`
- No input que aparece digitar `JSON`
- Selecionar `Preferences: Open Settings (JSON)`
- Adicionar o seguinte:

```js
"eslint.validate": ["javascript", "javascriptreact"],

// Corrigir automáticamente quando salva
"editor.codeActionsOnSave": {
    "source.fixAll": true,
    "source.fixAll.eslint": true
},
```

- No arquivo `eslintrc.js` alterar para o seguinte:

```js
 module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'prettier'
  ],
  plugins: ['prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    "prettier/prettier": "error",
    "class-methods-use-this": "off",
    "no-param-reassign": "off",
    "camelcase": "off",
    "no-unused-vars": ["error", { "argsIgnorePattern": "next" }]
  },
};

```

- Instalar o prettier:

```bash
yarn add prettier eslint-config-prettier eslint-plugin-prettier -D
```

- Criar na raiz do projeto o arquivo `.prettierrc` e adicionar o seguinte:

```js
{
    "singleQuote" : true,
    "trailingComma": "es5"
}
```

- Comando para realizar correção em vários arquivos com o eslint:


```bash
yarn eslint --fix src --ext .js
```

- no lugar do `src` colocar o nome da pasta.

---

- Quando trabalhamos com equipe de desenvolvimento que utilizam editores diferentes é bom utilizarmos o plugin:

[EditorConfig for VS Code - Manter padrão para outras ides](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)

- Depois de instalar, ir na raiz do projeto e clicar com o botão direito do mouse e selecionar `Generate .editorconfig` e substituir por:

```js
root = true

[*]
indent_style = space
indent_size = 2
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
```
