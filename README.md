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


---

<h2>Sequelize</h2>

- Mais detalhes acesse: [Sequelize](https://github.com/mrcarromesa/sequelize)

- [Documentação](https://sequelize.org/v5/)

- Na pasta `src` criar uma pasta `config` com um arquivo `database.js` que ficarão as credenciais para acessar a base de dados.

- Criar a pasta `src/database/migrations` ficará tudo relativo a database.

- Criar a pasta `src/app` e dentro adicionar as pastas `controllers` e `models`

- Instalar a biblioteca do `sequelize`:

```bash
yarn add sequelize
```

- Instalar também:

```bash
yarn add sequelize-cli
```

- Essa dependencia será utilizada para criar e executar as migrations.

- Criar o arquivo na raiz do projeto `.sequelizerc`, serve para configurar os caminhos onde obter os dados relativo a migrations, seeders, models e o arquivo de conexão com a base.

e adicionar o seguinte conteúdo:

```js
const { resolve } = require('path'); //padronizar os caminhos tanto no windows, mac e linux


module.exports = {
    config: resolve(__dirname, 'src', 'config', 'database.js'),
    'models-path': resolve(__dirname, 'src', 'app', 'models'),
    'migrations-path': resolve(__dirname, 'src', 'database', 'migrations'),
    'seeders-path': resolve(__dirname, 'src', 'database', 'seeds'),
}
```

- No arquivo `src/config/database.js` adicionar o seguinte:

```js

module.exports = {
    dialect: 'postgres', // driver. O sequelize suporta: postgres, mysql, mariaDB, mssql, sqlite
    host: 'localhost',
    username: '',
    password: '',
    database: '',
    define: {
        timestamps: true, // garante que haverá uma coluna created_at e update_at em cada tabela da base de dados
        underscored: true,
        underscoredAll: true, // os dois parametros permitem utilizar o nome tabela e coluna no formato snack case
        // Então por padrão se eu criasse um model UserGroup o sequelize irá criar user_groups
    },
};

```

- Nos arquivos anteriores não utiliza a interface de import/export pois outras ferramentas que utilizam como `sequelize-cli` não suporta esse formato.

- dependendo do `dialect` informado é necessário instalar mais dependencias [Dialects](https://sequelize.org/v5/manual/dialects.html).

- No caso do postgres instalar:

```bash
yarn add pg pg-hstore
```


---

<h2>Migration</h2>

- Para criar uma migration utilizar o comando:

```bash
yarn sequelize migration:create -name=create-users
```

- No lugar de `create-users` inserir o nome da migration

- Será criado um arquivo na pasta `src/database/migrations/` só verificar o conteúdo.

- Para executar a migration realziar o seguinte comando:

```bash
yarn sequelize db:migrate
```

- Será criada a tabela na nossa base de dados.

- Além disso o sequelize cria uma tabela chamada `SequelizeMeta` para controlar as migrations

- Para realizar um **rollback** da migration utilizar o seguinte comando:

```bash
yarn sequelize db:migrate:undo
```

- Irá realizar o último rollback

- ou

```bash
yarn sequelize db:migrate:undo:all
```

- Irá realizar o rollback de tudo.

---

<h2>Models</h2>

- Inicialmente criar o model `src/app/models/User.js`

- Conteúdo inicial que definirá a estrutura presente na tabela, ignorando campos auto increment, primary key...:

```js
import Sequelize, { Model } from 'sequelize';

class User extends Model {
    static init(sequelize) { // Esse parametro sequelize é a conexao com a base de dados.
        super.init(
            {
                name: Sequelize.STRING,
                email: Sequelize.STRING,
                password: Sequelize.VIRTUAL,
                password_hash: Sequelize.STRING,
                provider: Sequelize.BOOLEAN,
            },
            {
                sequelize,
            }
        );
    }
}
```

- Vamos criar o arquivo `src/database/index.js` esse arquivo irá conectar com a base e carregar os models, passando a conexão para eles, adicionar o conteúdo ao arquivo:

```js
import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import User from '../app/models/User';

// Array de models
const models = [User];

class Database {
    constructor() {
        this.init();
    }

    init() {
        //Realiza conexão com o banco com base nas configurações
        this.connection = new Sequelize(databaseConfig);

        // inicia todos os models dentro do array passando a conexão
        models.map(model => model.init(this.connection));
    }
}

// Aqui já está sendo feita a instancia dessa classe.
export default new Database();

```

- Agora vamos importar esse arquivo em `src/app.js`, como não preciso obter nenhum retorno apenas adicionar o import:

```js
import './database';
```

- Para realizar um create utilizamos o seguinte comando:

```js
import User from './models/User';

const user = await User.create({
    name: 'nome',
    email: 'email@email.com',
    password_hash: '123456',
});

return res.json(user);

```
