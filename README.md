<h1>Go Barber</h1>


<p align="left">
  <a href="#iniciar-novo-projeto">Iniciar novo projeto</a><br>
  <a href="#instalar-o-express">Instalar o express</a><br>
  <a href="#utilizar-o-surcrase-para-utilizar-funcionalidades-de-import-export">Utilizar o surcrase para utilizar funcionalidades de import export</a><br>
  <a href="#eslint-e-prettier">ESLint e Prettier</a><br>
  <a href="#docker">Docker</a><br>
  <a href="#sequelize-um-pouco-de-teoria">Sequelize um pouco de teoria</a><br>
  <a href="#criacao-de-controllers">Criação de controllers</a><br>
  <a href="#bcrypt">bcrypt</a><br>
  <a href="#jwt">JWT</a><br>
  <a href="#yup">Yup</a><br>
  <a href="#multer">multer</a><br>
  - Relacionamentos Sequelize<br>
  - fns<br>
  - mongo<br>
  - Emails e Templates<br>
  - Filas<br>
  - Tratamento de exceções<br>
</p>


## Iniciar novo projeto

```bash
yarn init -y
```

- Dessa forma cria o arquivo `package.json`

---

## Instalar o express

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

## Utilizar o surcrase para utilizar funcionalidades de import export

- [ES6 no NodeJS - Sucrase](https://github.com/mrcarromesa/sucrase)

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

## Docker

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

## Sequelize um pouco de teoria

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

<h3>Seeds</h3>

- Criar dados ficticios na aplicação

- Utilizado para popular dados para testes

- Jamais utilizar em produção

- Mas caso precise adicionar os dados na tabela em produção é melhor utilizar a migration ao invés do seeds

<h3>Arquitetura MVC</h3>

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

<h2>Sequelize Prática</h2>

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


<h3>Migration</h3>

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
---

## Criação de controllers

- Criar o arquivo `src/app/controller/UserController.js`

- Basicamente nesse controller será importado o model de Usuário;

```js
import User from '../models/User';
```

- Adicionar o seguinte:

```js
class UserController {
    async store(req, res) {
        const userExists = User.findOne({where: {email: req.body.email}});

        if(userExists) {
            return res.status(400).json({'error': 'User already exists.'});
        }

        const { id, name, email, provider } = User.create(req.body);

        return res.json({
            id, name, email, provider
        });
    }
}

export default new UserController();
```

- Nas rotas `src/routes.js` importar o controller:

```js
import UserController from './app/controllers/UserController';
```

- E criar a rota:

```js
routes.post('/users',UserController.sotore);
```

<h2>Testando no Isomnia</h2>

- No Isomnia, criar um novo workspace: gobarber
- Criar uma pasta: Users
- Criar rota post: {{ base_url  }}/users
- Body JSON com um conteúdo:

```json
{
	"name": "Nome",
	"email": "nome@email.com.br",
	"password_hash": "12345678"
}
```

---

## bcrypt
<h2>Utilizar hash no password</h2>

- Adicionar mais uma dependencia no projeto:

```bash
yarn add bcryptjs
```

- Agora importamos ele no arquivo `src/app/models/User.js`:

```js
import bcrypt from 'bcryptjs';
```

- Os campos que estão no model não necessariamente são um reflexo dos campos que estão na tabela,
são apenas os campos que o usuário poderá preencher quando der um User.create por exemplo.

- Agora criamos um campo `VIRTUAL` o qual não existirá na tabela ele só existirá no model:

```js
class User extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
                email: Sequelize.STRING,
                password: Sequelize.VIRTUAL, //campo adicionado
                password_hash: Sequelize.STRING,
                provider: Sequelize.BOOLEAN,
            },
            {
                sequelize,
            }
        );


        return this;
    }
}
```

- Por fim adicionamos um `Hook` do sequelize, basicamente são trechos de código executadas de forma automática baseado em ações que ocorrem no model. O primeiro parametro informamos quando queremos queremos executar a function, e o segundo parametro o trecho de código que será executado. Ex.:

```js
this.addHook('beforeSave', async user => {
    if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
    }
});
```

- Esse `Hook` acima irá executar antes de salvar os dados na tabela.

- Ele receberá o usuário informado como parametro e o campo que foi passado através do controller.

- Escolhemos o campo que queremos preencher na tabela e atribuímos um valor.

- Ali para utilizar o bcrypt utilizamos um async/await por se tratar de uma function assincrona, informamos o primeiro parametro que é uma string, o segundo que é a força, precisamos colocar um valor não muito alto, para não pesar no processamento.


- Dessa forma no Insomnia alteramos a rota de criação de usuário alterando o corpo da requsição para:

```json
{
	"name": "Nome",
	"email": "nome@email.com.br",
	"password": "12345678"
}
```

---

<h2>JWT Conceito</h2>

É uma forma de realizarmos autenticação em api rest full, que são comunicados através de JSON, pois não iremos utilizar o esquema de SESSION.

JWT é Json Web Token.

- Para isso criamos uma rota do tipo post;
- Envio para essa rota o e-mail e senha do usuário que estou logando;
- Essa rota verifica na base de dados se tudo está correto e se estiver correto...;
- Gera um token, ele é gerado através de uma biblioteca;
- Esse token jwt gera um token em três partes:
    - Headers: Ele basicamente define o tipo de token que foi gerado. Isso é importante pois quando o front-end for utilizar ele precisará saber o tipo de criptografia que foi gerado.
    - Payload: são os dados do usuários não sensiveis que podemos utilizar como id, nome, email..., o qual podemos resgatar depois
     - Assinatura:  Garante que não foi modificado externamete por outro usuário

---

## JWT

- No arquivo `src/app/models/User.js` vamos adicioar um metodo para verificar comparar a senha informada, criptografando ela e comparando com o hash na tabela, para isso adicionamos mais um metodo nessa class:

```js
checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
}
```

- Vamos criar um novo controller, `src/app/controllers/SessionController.js`, não iremos utilizar o UserController.js pois temos que pensar no projeto como entidades, pois estou armazenando uma session e não o usuário em si.

- Intale a nova extensão:

```bash
yarn add jsonwebtoken
```

- Basicamente importamos o `models/User` e o `jwt` para o arquivo `SessionController.js`:

```js
import jwt from 'jsonwebtoken';
import User from '../models/User';

class SessionController {
    async store(req, res) {

        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // verifica se a senha bate com o hash na tabela.
        if (!(await user.checkPassword(password))) {
            return res.status(401).json({ error: 'Password does not match' });
        }

        const { id, name } = user;

        return res.json({
            user: {
                id,
                name,
                email,
            },
            token: jwt.sign({ id }, 'VALOR_UNICO_QUE_SERA_UMA_CHAVE_CRIPTOGRAFA', {
                expiresIn: 'TEMPO_EXPIRACAO_EX.:_7d',
            }),
        });
    }
}

export default new SessionController();

```

- os parametros do `jwt`:
    - chamamos a function sign
    - Informamos um Payload, no caso informação que queremos incorporar ao jwt,
    - Um valor de chave único na aplicação
    - Algumas configurações como o expiresIn que é o tempo de expiração para que o token seja valido para sempre, e o usuário possa reutilizar pelo tempo que quiser. Exemplo de como informar: `7d`


- Adicionar em `src/routes.js` a rota para autenticação:

```js
import SessionController from './app/controllers/SessionController';
```

```js
routes.post('/sessions', SessionController.store);
```

- Testando com o Insomnia:

- Criar uma pasta `Sessions`
- Criar a rota Create url: {{ base_url  }}/sessions
- Body JSON:

```js
{
	"email": "rodolfo@email.com.br",
	"password": "12345678"
}
```

- Por fim vamos separar as configurações do jwt em um arquivo separado:

- Criar um arquivo `src/config/auth.js` com o seguinte conteúdo:

```js
export default {
    secret: 'MINHA_CHAVE', // pode gerar algo aleatorio e inserir aqui
    expiresIn: '7d', // tempo de expiracao
};

```

- Importar isso no `SessionController`:

```js
import authConfig from '../../config/auth';
```

- E utilizar ele no jwt:

```js
token: jwt.sign({ id }, authConfig.secret, {
    expiresIn: authConfig.expiresIn,
}),
```

- Mais detalhes: [JWT](https://github.com/mrcarromesa/jwt-nodejs)

---

<h2>Middleware de autenticação</h2>

Agora que conseguimos gerar o token, precisamos bloquear acesso as demais rotas para serem acessiveis apenas para quem envia o token corretamente, para isso utilizamos o middleware.

Inicialemnte adicionamos um metódo update no arquivo `src/app/controllers/UserController.js` para testarmos adicionamos só um retorne simples:

```js
async update(req, res) {
    return res.json({ok: true});
}
```

- Criamos a rota no Insomnia:

- Na pasta Users adicionamos a rota Update do tipo PUT com a seguinte url: {{ base_url  }}/users

- e o seguinte conteúo no corpo da requisição body json:

```json
{
	"email": "rodolfo@email.com.br",
	"password": "12345678"
}
```

- No arquivo `src/routes.js` criamos a rota do tipo put para users:

```js
routes.put('/users', UserController.update);
```

- Crie uma pastinha chamada `src/app/middlewares/` e crie o arquivo `src/app/middleware/auth.js`

- Para utilizar o token no insomnia adquirimos ele atraves da rota `sessions` e copiamos o token e colamos na aba Auth > Bearer Token e colamos esse token no campo token


- Por fim nesse arquivo `src/app/middlewares/auth.js` adicione o seguinte conteúdo:

```js
import jwt from 'jsonwebtoken';
import { promisify } from 'util'; // promise from node js para utilizar async no export
import authConfig from '../../config/auth';

export default async (req, res, next) => {
    // obtendo o token do header.
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Token not provided' });
    }

    // separa a string: 'Bearer tokensfdasfadsf34234sfsf'
    // desestruturar o array
    const [, token] = authHeader.split(' ');

    try {
        const decoded = await promisify(jwt.verify)(token, authConfig.secret);
        // console.log(decoded);
        req.userId = decoded.id;
        return next();
    } catch (error) {
        return res.status(401).json({ error: 'Token invalid' });
    }
};

```

- No arquivo `src/routes.js` importamos o middleware:

```js
import authMiddleware from './app/middlewares/auth';
```

- e adicionamos a use:

```js
routes.use(authMiddleware);
```

- Tudo acima dele executa normalmente.

- O que está abaixo dele será filtrado pelo próprio middleware para definir se será executado ou não.

- Para decodar o jwt, por padrão ele utiliza o metodo asincrono porém mais antigo que utiliza calback, então para utilizarmos o async/awaite, utilizamos uma lib que já vem por padrão no node:

```js
import { promisify } from 'util';
```

- O promisify pega uma função de callback e transforma ela em async/await
    - Primeiro informo a function que quero transformar em async/await
    - Informo uma segunda function que o promisify retorno informando
        - o token e o secret.

- No middleware utilizamos o try catch pois pode ser lançada uma exeção.

- Dentro do try caso conseguir decodificar  podemos dar o `return next();` ou seja continua o fluxo da aplicação normalmente, do contrário ele para e e retorna uma resposta através do `return res....`

- o `decoded.id` é a propriedade que passamos através do `SessionController.js` no trecho:

```js
token: jwt.sign({ id }, 'VALOR_UNICO_QUE_SERA_UMA_CHAVE_CRIPTOGRAFA', {
    expiresIn: 'TEMPO_EXPIRACAO_EX.:_7d',
}),
```

- Então id passado ali é o que estamos recuperando aqui no `decode.id` no arquivo `src/app/middlewares/auth.js`:

```js
const decoded = await promisify(jwt.verify)(token, authConfig.secret);
// console.log(decoded);
req.userId = decoded.id;
```

- Adicionamos a varivel de requisição o `req` uma propriedade que chamamos de `userId` ficando dessa forma:

```js
req.userId = decoded.id;
```

- Com isso podemos utilizar essa propriedade em qualquer rota após o middleware

- Dessa forma no `src/app/controllers/UserController.js`

```js
async update(req, res) {
    console.log(req.userId);
    return.json({ok: true});
}
```

- Agorar desestruturamos os dados que estão sendo obtidos por `req`,

o o id do usuário estmos obtendo através do header que está sendo enviando e
transformado no middleware:

```js
async update(req, res) {
    const { email, oldPassword } = req.body;


    const user = await User.findByPk(req.userId);

    if (email && email !== user.email) {
        const userExists = await User.findOne({
            where: { email },
        });

        if (userExists) {
            return res.status(400).json({ error: 'User already exists.' });
        }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
        return res.status(401).json({ error: 'Password does not match' });
    }

    // realizamos a atualização e obtemos os dados
    const { id, name, provider } = await user.update(req.body);

    return res.json({ id, name, email, provider });
}
```

- o `findByPk()` é uma function do sequelize para buscar pela chave primária

- precisamos verificar se o usuário está tentando alterar o e-mail e caso afirmativo precisamos verificar se o e-mail para o qual está tentando alterar já não está sendo utilizado.


- Verificamos se a senha antiga realmente bate.

- No Insomnia alteramos o body da url {{ base_url  }}/users, para:

```json
{
	"name": "Rodolfo",
	"email": "rodolfo@email.com.br",
	"oldPassword": "12345678",
	"password": "12345678",
	"confirmPassword": "12345678"
}
```

---

## yup

<h2>Validação de dados</h2>

Para isso podemos utilizar o `yup` instale-o:

```bash
yarn add yup
```

- Agora adicione ele no arquivo: `src/app/controllers/UserController.js` import o `yup`:

```js
import * as Yup from 'yup';
```

- Agora teremos acesso a todas validações do `yup`


- Um exemplo utilizando o Yup:

```js
const schema = Yup.object().shape({
    name: Yup.string().required(),
    email: Yup.string()
        .email()
        .required(),
    password: Yup.string()
        .required()
        .min(6),
});

// Verifica se a validação passou
if (!(await schema.isValid(req.body))) {
    return res.status(400).json({ error: 'Validations fails' });
}
```

- Um exemplo para atualização:

```js

const schema = Yup.object().shape({
    name: Yup.string(),
    email: Yup.string().email(),
    oldPassword: Yup.string().min(6),
    password: Yup.string()
        .min(6)
        // when condicional (quando o oldPawssword), (campo oldPassword, campo atual) =>
        // oldPassword totalmente ok ? torna o password obrigatorio : retorna o field (no caso password) como estava antes
        .when('oldPassword', (oldPassword, field) =>
            oldPassword ? field.required() : field
        ),
        // exemplo de confirmacao de senha
    confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
    ),
});

if (!(await schema.isValid(req.body))) {
    return res.status(400).json({ error: 'Validations fails' });
}
```

---

**Extra... Exemplo de validação de cpf e cpfOuEmail no mesmo campo**

```js
import * as Yup from 'yup';
// yarn add cpf-cnpj-validator
import { cpf } from 'cpf-cnpj-validator';

Yup.addMethod(Yup.string, 'cpf', () => {
  return Yup.mixed().test('cpf', 'CPF Inválido', (val) => {
    return cpf.isValid(val);
  });
});

Yup.addMethod(Yup.string, 'cpfEmail', () => {
  return Yup.mixed().test(
    'cpf-email',
    'Informe um e-mail ou CPF válido',
    (val) => {
      if (val === undefined) {
        return false;
      }

      if (val.includes('@')) {
        return Yup.string().email().isValid(val);
      }
      return Yup.string().cpf().isValid(val);
    }
  );
});

const schema = Yup.object().shape({
    login: Yup.string()
        .required('Campo obrigatório')
        .cpfEmail('Informe um e-mail ou CPF válido'),
});
```


---

## multer

<h2>Upload de arquivos</h2>

- Para o envio de arquivos para o servidor precisamos utilizar o formato `multipart form`

- Instalamos a dependência:

```bash
yarn add multer
```

- Criar na raiz do projeto uma pasta chamada `tmp/uploads/` no qual serão inseridos todos os uploads

- criar o arquivo `src/config/multer.js` ficará toda a configuração para o upload de arquivo

```js
import multer from 'multer'; // dependencia para upload de arquivos
import crypot from 'crypto'; // crypt dos nomes para garantir nomes únicos e evitar cache
import { extname, resolve } from 'path'; // encontrar o caminho das pastas facilmente

export default {
    storage: multer.diskStorage({
        // destino dos arquivos tipo string
        destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
        // aceita uma function
        //    (req: os dados da requisição,
        //     file: os dados do arquivo como nome, tamanho, tipo
        //     cb: aqui passamos o err em caso de erro ou o nome do arquivo
        //)
        filename: (req, file, cb) => {
            // gerar um nome unico é uma Promise
            crypot.randomBytes(16, (err, res) => {
                if (err) return cb(err);

                // cb (Primeiro parametro é o erro e como nao tem passamos null,
                //     Segundo parametro é o nome da imagem em si.
                //)
                // res.toString('hex') transforma o resultado de letras e números em um hexadecimal
                return cb(
                    null,
                    res.toString('hex') + extname(file.originalname)
                );
            });
        },
    }),
};

```

- Para utilizar o `multer` criamos uma nova rota em `src/routes.js`:

```js
import multer from 'multer';
import multerConfig from './config/multer';

// ...

// middleware
const upload = multer(multerConfig);

routes.post('/files', upload.single('file'), (req, res) => {
    return res.json({ok: true});
});

```

- No Insomnia vamos criar uma pasta chamada `Files`

- Uma requisição chamada `Create` metodo POST Multipart Form url {{base_url}}/files

- Adicionar o campo `file` e selecionar o arquivo que será enviado

- No Auth selecionar o Bearer Token e em Token adicionar o token obtido do session create

- Para obter o arquivo:
    - O multer libera uma variavel no req chamada `file` quando utiliza o single, quando utiliza vários seria `files` então podemos obter os dados do arquivo através de `req.file`

- Vamos criar o arquivo `src/app/controllers/FileController.js`

- Ajustamos o `routes.js`:

```js
import FileController from './app/controllers/FileController';

// ...

routes.post('/files', upload.single('file'), FileController.store);
```

- Vamos criar uma nova tabela no banco...
    - Execute o comando:
    ```bash
    yarn sequelize migrate:create --name=create-files
    ```
- Será criado o arquivo dentro da pasta `src/database/` o conteúdo já está no arquivo

- E só executar o comando:

```bash
yarn sequelize db:migrate
```

- Agora criamos o model `src/app/models/File.js`

- Adicionar no array de models em `src/database/index.js`:

```js

//...

import File from '../app/models/File';

const models = [
    //...
    File
    //...
    ];
```

- No arquivo `src/app/controllers/FileController.js` adicionar o model File

- Vamos ter uma desestruturação com alteração de nome de variavéis para adaptar o mesmo nome que será salvo na base de dados:

```js
const { originalname: name, filename: path } = req.file;

// Estamos recebendo `originalname` e transformando em `name` e `filename` e transformando para `path`
```

- Precisamos criar um campo na tabela de usuários para referenciar a imagem para isso criamos mais uma migration:

```bash
yarn sequelize migration:create --name=avatar-field-to-users
```

- Será criado um novo arquivo em `src/database/migrations/`

- Esse novo arquivo será um pouco diferente dos outros pois nos outros estavamos criando uma nova tabela
nesse queremos adicionar um novo campo, então só dá uma olhada no arquivo para mais detalhes, um trecho imporante:


```js
up: (queryInterface, Sequelize) => {
    // no addColumn inserimos o nome da tabela que queremos alterar
    // o nome do novo campo
    return queryInterface.addColumn('users', 'avatar_id', {
        type: Sequelize.INTEGER,
        references: { model: 'files', key: 'id' }, // foringkey (model: tabela que será referenciada, key campo equivalente que será referenciado na tabela filha)
        onUpdate: 'CASCADE', // Quando for atualizado o valor do campo
        onDelete: 'SET NULL', // Quando o registro for apagado
        allowNull: true,
    });
},
```

- Depois executar o comando:

```bash
yarn sequelize db:migrate
```

---

<h2>Relacionamento entre o model User com o model Files</h2>

- No arquivo `src/app/models/User.js` vamos adicionar mais um metodo static:

```js
/** Definir foring keys */
static associate(models) {
    // Recebe
    // 1 - a instancia do model Filho
    // 2 - { o campo da tabela pai que quermos associar }
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
}
```

- No arquivo `src/database/index.js` adicionamos mais um map para chamar o metodo associate:

```js
.map(
    model =>
        model.associate && model.associate(this.connection.models)
);
```

- Pecorre o array dos models, verifica se o model possuí o metodo `associate` caso afirmativo chama ele passando todos os models.

- No Insomnia atualizar a rota PUT {{base_url}}/users, adicionando no corpo da requisição o campo `avatar_id` nele iremos colocar o id retornado da requisição do envio do arquivo:

```js
{
	"name": "Rodolfo",
	"email": "rodolfo@email.com.br",
	"oldPassword": "12345678",
	"password": "12345678",
	"confirmPassword": "12345678",
	"avatar_id": 1
}
```


---

<h2>Consulta dos providers (Prestadores de serviços)</h2>

- Vermos campo virtual com sequelize
- criar rota para acessar arquivos estaticos

- Criar o controller `src/app/controllers/ProviderController.js` e ele irá utilizar o model de User pois o provider é um usuário

- Verifique os comentários

```js
import User from '../models/User';
import File from '../models/File';

class ProviderController {
    async index(req, res) {
        // buscar os usuários
        const providers = await User.findAll({
        // condicionar apenas os que forem providers
            where: { provider: true },
            // campos que devem ser retornados
            attributes: ['id', 'name', 'email', 'avatar_id'],
            // para incluir relacionamentos utilizamos o include
            // podemos incluir quantos relacionamentos forem necessários
            include: [
                {
                    // em model passamos o model que queremos obter os dados
                    model: File,
                    // para retornar não o nome da tabela e sim o nome que queremos utilizamos o `as`
                    as: 'avatar',
                    // para não retornar todos os campos e sim o que queremos utilizamos o attributes
                    attributes: ['name', 'path', 'url'],
                    // O campo url é obtido de um campo virtual no model File
                },
            ],
        });

        return res.json(providers);
    }
}

export default new ProviderController();

```

- No arquivo de rotas criamos uma rota:

```js
routes.get('/providers', ProviderController.index);
```


- No insomnia Criamos uma nova pasta `Providers` criar uma requisição chamada index
com a url `{{base_ur}}/provider` metodo get e adicionar o token no Auth

- Para retornar o url juntamente na estrutura do JSON, no arquivo `src/app/models/File.js` adicionamos um campo virtual:

```js
url: {
    type: Sequelize.VIRTUAL,
    get() {
        return `http://url.com.br/files/${this.path}`;
    },
},
```

- Dentro da function `get()` o que retornamos será exibido quando listarmos essa tabela. Esse campo não existe fisicamente, exemplo se inserirmos:

```js
url: {
    type: Sequelize.VIRTUAL,
    get() {
        return 'Qualquer coisa';
    }
}
```

- irá retornar para o campo `url` o valor `Qualquer coisa`.

- Mas como queremos concatenar a url com o campo `path` utilizamos isso: `return 'http://url.com.br/files/'+this.path;`

- Agora para permitir que o usário consiga acessar essa url e obter o arquivo precisamos realizar uma alteração

- No arquivo `src/app.js` utilizaremos o recurso `static` do `express` que serve para servir arquivos estáticos dentro da nossa aplicação em middlewares() adicionamos:

```js
import path from 'path'; // importar para facilitar escrever o caminho para pasta de uploads

// ...

// o `/files` é a rota que servirá os arquivos estáticos e ele utiliza apenas o metodo get
this.server.use(
    '/files',
    // inserimos o caminho da pasta onde contem os arquivos estaticos
    express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
);
```

---

<h2>Agendamentos</h2>

- Criar uma migration:

```bash
yarn sequelize migration:create --name=create-appointments
```

- Será gerado uma arquivo na pasta `src/database/migrations/`

- O conteúdo pode ser verificado no próprio arquivo.

- Para criar a tabela na base execute o comando:

```bash
yarn sequelize db:migrate
```

- Agora vamos criar o model `src/app/models/Appointment.js`

- Algo importante sobre o relacionamento dessa tabela vemos no trecho de código:

```js
static associate(models) {
    // quando tenho dois relacionamentos para mesma tabela, sou obrigado
    // a informar o "as", pois se nao o sequelize ira se perder sobre
    // qual relacionamento ele ira utilizar
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.User, {
        foreignKey: 'provider_id',
        as: 'provider',
    });
}
```

- Como temos mais de um relacionamento para mesma tabela obrigatóriamente é necessário informar um alias, para o sequelize não se perder.

- Não esqueça de no arquivo `src/database/index.js` importar e adicionar ao array de models mais esse model.

```js
import Appointment from '../app/models/Appointment';

// ...

const models = [User, File, Appointment];

// ...
```

- Agora vamos criar o controller do agendamento `src/app/controllers/AppointmentController.js`

- Criar no Insomnia uma pasta `Appointments`

- Criar nas rotas uma rota para os appointments:

```js
import AppointmentController from './app/controllers/AppointmentController';

// ...


routes.post('/appointments', AppointmentController.store);
routes.get('/appointments', AppointmentController.index);
```

- Criar uma rota POST nome create body em json, adicionar o token, precisamos assegurar que a requisição está sendo feita por um usuário comum e não um prestador de serviços, a url será `{{base_url}}/appointments`

- O body será:

```json
{
    "provider_id": 3,
    "date": "2019-07-01T18:00:00-03:00"
}
```

- Estamos passando o campo de data com o timezone do Brasil


---

<h2>Validação de datas</h2>

- Vamos verificar se o agendamento não é uma data passada
- Se o usuário não está tentando marcar no horário ocupado
- E trabalhar o intervalo de horários redondos

- Vamos utilizar uma dependencia para trabalhar com datas:

```bash
yarn add date-fns@next
```

- Utilizamos o @next para obter a última versão.


- No arquivo `src/app/controllers/AppointmentController.js` começamos importando o date-fns:

```js
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
```

- o `parseISO` transforma a data de string para o objeto Date do JS.

- o `startOfHour` sempre irá obter o inicio da hora e não os minutos e segundos, por exemplo, se eu informar `19:30:30` ele irá transformar para `19:00:00`

- Para verificar se a uma data é anterior a outra utilizamos o `isBefore`:

```js
if (isBefore(hourStart, new Date())) {
    return res
        .status(400)
        .json({ error: 'Past date are not permitted' });
}
```

---

- Listar agendamentos no arquivo `src/app/controllers/AppointmentController.js` temos:

```js
async index(req, res) {
    // Buscar todos os agendamentos
    const appointment = await Appointment.findAll({
        // Buscar onde o user_id for o usuário que está logado
        // e o agendamento não foi cancelado
        where: { user_id: req.userId, canceled_at: null },
        // Definimos os campos que serão retornados
        attributes: ['id', 'date', 'past', 'cancelable'],
        // ordenação dos registros
        order: [['date', 'ASC']],

        // Realizar relacionamento, ou JOIN com outra tabela/model
        include: [
            {
                // Inclumos o model User pois vamos obter os dados do prestador de serviços
                model: User,
                // Informamos de qual chave estrangeira estamos obtendo, aqui inserimos o mesmo apelido
                // da chave que precisamos buscar da tabela que está sendo relacionada
                as: 'provider', // precisa ser o mesmo as da funcao static associate()
                // apenas os campos que queremos exibir
                attributes: ['id', 'name', 'email'],
                // relacionamento aninhado, ou seja uma subquery
                include: [
                    {
                        // iremos obter o avatar do prestador de servidos
                        model: File,
                        as: 'avatar',
                        // o path é necessário pois o url é virtual e é gerado a partir do path
                        // sendo assim para exibirmos o url precisamos retornar o path.
                        attributes: ['name', 'path', 'url'],
                    },
                ],
            },
        ],
    });
    return res.json(appointment);
}

```

- Comentários explicam melhor o código

- No Insomnia criamos uma rota para pasta `Appointments` chamada List metodo get, url `{{base_url}}/appointments` e no auth inserimos o `token`


- Paginação:

- No arquivo `src/app/controllers/AppointmentController.js` adicionamos/alteramos:

```js
async index(req, res) {
    // estamos enviando /appointments?page=NUM
    // caso o page seja undefined atribuimos um valor padrão que será 1
    const { page: p = 1 } = req.query; // obter a paginação do query params
    const limit = 20; // Quantidade de limit por vez.

    const appointment = await Appointment.findAll({
        where: { user_id: req.userId, canceled_at: null },
        attributes: ['id', 'date', 'past', 'cancelable'],
        order: [['date', 'ASC']],
        limit, // limit para paginação
        offset: (p - 1) * limit, // quantos registros pular
        include: [
            {
                model: User,
                as: 'provider', // precisa ser o mesmo as da funcao static associate()
                attributes: ['id', 'name', 'email'],
                include: [
                    {
                        model: File,
                        as: 'avatar',
                        attributes: ['name', 'path', 'url'],
                    },
                ],
            },
        ],
    });
    return res.json(appointment);
}

```

- No Insomnia podemos realizar o teste por adicionar o parametro na url {{base_url}}/appointments no metodo get `?page=1`

---

<h2>Listagem para o prestador de serviços</h2>

- O prestador de serviços poderá verificar sua agenda.

- Criamos o controller `src/app/controllers/SchenduleController.js`

- Criamos a rota:

```js
import SchenduleController from './app/controllers/SchenduleController';

// ...

routes.get('/schendule', SchenduleController.index);
```

- No Insomnia criamos uma pasta `Schendule` e a requisição `List` metodo GET url `{{base_url}}/schendule`

- E preciso garantir que estou logado como um prestador de serviço e não um usuário comum

- Vamos criar um token_provider no Enviroments do workspace

- Nos parametros do url vamos adicionar `?date=2020-06-01T00:00:00-03:00`


- No nosso controller `src/app/controllers/SchenduleController.js` vamos realizar um between:

```js
import { startOfDay, endOfDay, parseISO, format } from 'date-fns'; // tratamento de data
import { Op } from 'sequelize'; // Operadores do sequelize


const { date } = req.query;

const parseDay = parseISO(date);

// Obter todos os agendamentos
const schendule = await Appointment.findAll({
    // Onde
    where: {
        // o provider_id for igual ao usuário logado
        provider_id: req.userId,
        // sem cancelamento
        canceled_at: null,
        // Between no sequelize
        date: {
            // O Op.between preciso colocar entre '[Op.between]' pois como ele é uma variavel e queremos definir como o nome da propriedade dentro do objeto precisamos inserir o '[' e o ']' e ele envia um array que no caso é a data inicial e a data até.
            [Op.between]: [startOfDay(parseDay), endOfDay(parseDay)],
        },
    },
    order: [['date', 'DESC']],
    include: [
        {
            model: User,
            as: 'user',
        },
    ],
});
```

- Alguns comentarios esclarecedores estão no código acima.

- a function `startOfDay` irá obter o inicio do dia informado exemplo se for informado `2020-06-01 10:00:00` será retornado `2020-06-01 10:00:00`

- a function `endOfDay` irá obter o inicio do dia informado exemplo se for informado `2020-06-01 10:00:00` será retornado `2020-06-01 23:59:59`


---

<h2>Utilizando o MongoDB</h2>

- Um banco não relacional e performatico

- Primeiro utilizando o docker vamos subir ele executando o seguinte comando no terminal:

```bash
docker run --name NOME_DA_BASE -p 27017:27017 -d -t mongo
```

- Executei assim:

```bash
docker run --name mongobarber -p 27017:27017 -d -t mongo
```

- Agora no projeto precisamos instalar a dependencia:

```bash
yarn add mongoose
```

- Faremos a parte de conexão com a base mongo no arquivo `src/database/index.js`

```js
import mongoose from 'mongoose';

// ...

constructor() {
    this.init();
    this.mongo();
}

// ...

mongo() {
    this.mongoConnection = mongoose.connect('mongodb://localhost:27017/gobarber', {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
    });
}
```

- `gobarber` é nome da base que iremos utilizar, o mongo irá criar para nós caso ela não exista.

- Mais detalhes: [Mongo Db](https://github.com/mrcarromesa/mongoose)

---


<h2>Criar notificação e salvar no mongo</h2>

- No mongo possuí schema e não tabelas, nas tabelas os dados são mais estruturados
as colunas são iguais para todos os dados daquela tabela.

- Dentro do mongo tem schema free que no caso é liberdade de schema.

- Crie uma pasta `src/app/schemas`

- Crie um arquivo `src/app/schemas/Notification.js`

- Basicamente no schema inserimos o nome do campo, o tipo dele que pode ser qualquer tipo primitivo do JS,
se ele é obrigatório ou não,

- Temos a opção de informar se esse schema terá os campos de created_at e update_at utilizando o `timestamps: true`

- E por fim exporto o schema passando um nome para ele que será utilizado para criar o schema no mongo e passo o schema.

- Mais detalhes dentro do próprio arquivo.

- Dentro de `src/app/controllers/AppointmentController.js` iremos realizar a inserção da Notificação:

```js
import Notification from '../schemas/Notifications';

// ...

await Notification.create({
    content: `Novo agendamento de ${user.name} para ${formattedDate}`,
    user: provider_id,
});

```

- Como formata a data:

- Importamos o seguinte:

```js
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';
```

- o `format` utilizamos para formata a data conforme necessidade
- o `pt` estamos importando o locale do `data-fns` para utilizar o nome do mês em português

- Dessa forma formatamos assim a data:

```js
// ...
const formattedDate = format(
    hourStart,
    "'dia' dd 'de' MMMM', às' hh:mm'h'",
    { locale: pt }
);

// ...

```

- o format o primeiro parametro é um tipo `Date` o segundo parametro é uma string de como queremos formata a nossa string, como algumas combinações são reservadas para realizar a formatação de da data tais como:

    - `d`
    - `dd`
    - `MM`
    - `MMMM`
    - `hh`
    - `mm`

- Precisamos utilizar `'` embrulhando os caracteres que serão texto estático.

----

<h2>Visualizar os dados do mongo db</h2>

- Podemos utilizar esse app [MongoDB Compass](https://www.mongodb.com/download-center/compass)

- Na conexão utilizamos isso:

```
mongodb://localhost:27017/barbermongo
```

- Ali onde está `barbermongo` é o nome da base que vc inseriu quando instalou via docker.


---

<h2>Listar as notifications</h2>

- No arquivo de rotas adicionar:

```js
import NotificationsController from './app/controllers/NotificationsController';

// ...

routes.get('/notifications', NotificationsController.index);
```

- Criar o controller `src/app/controllers/NoticationController.js`

- Para listar registro do mongodb realizamos da seguinte forma:

```js
// buscar todas as notifications onde:
const noitfications = await Notifications.find({
    // onde user for igual ao id do usuario logado.
    user: req.userId,
})
    // ordenar de forma decrescente o campo createdAt
    .sort({ createdAt: 'desc' })
    // limitar no máximo 20 registros
    .limit(20);
```

- No Insomnia criar uma pasta `Notifications` criar um request get `{{base_url}}/notifications`, adicionar o `{{token_provider}}` no Auth

---

<h2>Realizar update no mongoDB</h2>

- No arquivo de rotas adicionar:

```js
import NotificationsController from './app/controllers/NotificationsController';

// ...

routes.put('/notifications/:id', NotificationsController.update);
```

- Para atualizar no mongodb realizamos da seguinte forma no arquivo `src/app/controllers/NotificationsController.js`:

```js
async update(req, res) {
    const { id } = req.params;

    // Busca e atualiza caso encontrar
    const notification = await Notifications.findByIdAndUpdate(
        // Buscar pelo id
        id,
        { read: true }, // atualizar read para true
        { new: true } // Essa é uma opção que atualiza no banco e retorna o registro atualizado, sem essa opção ele iria fazer tudo porém não retornaria o registro atualizado
    );

    return res.json(notification);
}
```

- O `findByIdAndUpdate` utilizamos para encontrar e atualizar, o primeiro parametro é o id que queremos buscar, o segundo paramentro é o que queremos atualizar, o terceiro parametro são opções, no caso estamos utilizando `new: true` o qual permite retornar o registro após ele ser atualizado.

- No Insomnia criamos uma nova rota na pasta Notifications chamada `Update` metodo PUT url `{{base_url}}/notifications/id_no_banco`, adicionar o `{{token_provider}}` no Auth


---

<h2>Cancelamento de agendamento</h2>

- Nas rotas vamos adicionar a seguinte rota:

```js
routes.delete('/appointments/:id', AppointmentController.delete);
```

- No arquivo `src/app/controllers/AppointmentController.js` iremos adicionar o metodo delete:

```js
async delete(req, res) {

    // ...
}
```

- Uma function importante que será utilizada é a , primeiro importamos ela:

```js
import { subHours } from 'date-fns';
```

- E podemos subtrair quantas horas precisarmos:

```js
subHours(date, 2);
```

- Passamos um parametro do tipo `Date` e um número com a quantidade de horas que queremos subtrair
Ele irá retornar um objeto do tipo `Date` com as horas subtraídas.

- Para compararmos uma hora como outra utilizamos, verificando se a primeira é anterior ou menor que a segunda, utilizamos a function:

```js
import { isBefore } from 'date-fns';

isBefore(date1, date2);
```

- No Insomnia criamos uma nova rota dentro da pasta `Appointments` chamada `Delete` metodo `DELETE` url `{{base_url}}/appointments/ID_AQUI`, e inserimos o token em `Auth`


---

<h2>Node Mailer</h2>

- Lib para envio de e-mails com o Node.

- Para instalar no projeto execute o comando:

```bash
yarn add nodemailer
```

- Mais detalhes: [E-mail NodeJS](https://github.com/mrcarromesa/nodemailer)

- Criar uma config para esssa parte de e-mails em `src/config/mail.js` e inserimos as configurações:

```js
export default {
    host: '',
    port: '',
    secure: false,
    auth: {
        user: '',
        pass: '',
    },
    default: {
        from: 'Equipe GoBarber <noreply@gobarber.com>',
    },
};
```

- Para realizarmos testes com o envio de e-mail podemos utilizar um serviço chamado [Mailtrap](https://mailtrap.io) ele funciona apenas para ambiente de dev, não servirá para ambiente de prod, só acessar criar uma conta e uma caixa de entrada.

- Depois da conta criada só obter as credenciais que ele gera, e adicionar o arquivo de configuração `src/config/mail.js`

- Criamos também mais uma pasta `src/lib` que conterá algumas configuarações adicionais para o envio de e-mail, pois não faz sentido criá-las dentro do controller.


- E vamos criar um arquivo chamado `src/lib/Mail.js`:

```js
import nodemailer from 'nodemailer';
import mailConfig from '../config/mail';

class Mail {
    constructor() {
        const { host, port, secure, auth } = mailConfig;
        this.transporter = nodemailer.createTransport({
            host,
            port,
            secure,
            auth: auth.user ? auth : null,
        });
    }

    sendMail(message) {
        return this.transporter.sendMail({
            ...mailConfig.default,
            ...message,
        });
    }
}

export default new Mail();

```

- Poderiamos utilizar apenas o `transporter.sendMail()` porém como queremos adicionar ou redefinir algumas variaveis padrões, seja ela da configuração ou da mensagem utilizamos:

```js
{
    ...mailConfig.default,
    ...message,
}
```

- Para realizar o envio de e-mail utilizamos o seguinte:

```js
import Mail from '../../lib/Mail';

await Mail.sendMail({
    to: 'Nome <email@email.com>',
    subject: 'Assunto',
    text: 'Texto';
});
```

---

<h3>Utilizar template de e-mail</h3>

- Os templates que iremos utilizar são arquivos html que poderão receber variaveis do node.
- O template que iremos utilizar é o [https://handlebarsjs.com](handlebarsjs)

- Para começar instalamos o seguinte:

```bash
yarn add express-handlerbars nodemailer-express-handlerbars
```

- Criar a pasta `src/app/views/emails/layouts` e `src/app/views/emails/partials`

- Criar o arquivo `src/app/views/emails/partials/footer.hbs`:

```js
<br />
Equipe GoBaber
```

- Criar o arquivo `src/app/views/emails/layouts/default.hbs`:

```hbs
<div style="font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.6; color: #222; max-width: 600px;">
    {{{ body }}}
    {{> footer }}
</div>
```

- `{{{ body }}}` será o corpo da mensagem o qual será alimentada, é uma variavel do próprio handlebars, para determinar onde será inserida a mensagem.

- `{{> footer}}` estamos adicionando fragmento da pasta `src/app/views/emails/partials/footer.hbs`, o nome ali da variavel deve ser o mesmo nome do arquivo que queremos adicionar sem a extensão. A pasta do partials está configurada no arquivo `src/lib/Mail.js` na seguinte linha: `partialsDir: resolve(viewPath, 'partials'), `

- Criar o arquivo `src/app/views/emails/cancellation.hbs`

```hbs
<strong>Olá, {{ provider }}</strong>
<p>Houve um cancelamento de horário, confira os detalhes abaixo:</p>
<p>
    <strong>Cliente: </strong> {{ user }} <br />
    <strong>Data/Hora</strong> {{ date }} <br />

    <br />

    <small>
        O horário está novamente disponível para novos agendamentos.
    </small>
</p>
```

- `{{ provider }}`, `{{ user }}`, `{{ date }}` são variáveis que iremos alimentar no envio do e-mail

- No arquivo `src/lib/Mail.js` vamos ajustar:

```js
import nodemailer from 'nodemailer';
import { resolve } from 'path'; // resolver os caminhos para obter os templates.
import exphbs from 'express-handlebars'; // integracao do handlebars com o express
import nodemailerhbs from 'nodemailer-express-handlebars'; // integracao do handlebars com nodemailer

import mailConfig from '../config/mail';

class Mail {
    constructor() {
        const { host, port, secure, auth } = mailConfig;
        this.transporter = nodemailer.createTransport({
            host,
            port,
            secure,
            auth: auth.user ? auth : null,
        });

        // adicionamos algumas configurações ao transporter
        this.configureTemplates();
    }

    configureTemplates() {
        const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');
        // adicionando algumas configurações dos temaplates de e-mail ao transporter do nodemailer
        // para isso utilizamos o use(), para adicionar mais configurações ao trasnporter
        // o compile é como o nodemailer compila os templates de e-mail, como ele formata a msg
        this.transporter.use(
            'compile',
            // nas configurações do nodemailerhbs utilizamos o motor o engine que será o exphbs
            nodemailerhbs({
                viewEngine: exphbs.create({
                    layoutsDir: resolve(viewPath, 'layouts'), // pasta onde estão os layouts
                    partialsDir: resolve(viewPath, 'partials'), // pasta onde estão os fragmentos do layout
                    defaultLayout: 'default', // o nome do arquivo padrão nesse caso esta na pasta ... layouts/default.hbs
                    extname: '.hbs', // extensão dos arquivos
                }),
                viewPath,
                extName: '.hbs', // aqui também é necessario passar a mesma extensão que estamos passando ali acima.
            })
        );
    }

    sendMail(message) {
        return this.transporter.sendMail({
            ...mailConfig.default,
            ...message,
        });
    }
}

export default new Mail();

```

- Para chamar o envio de e-mail com template utilizamos o seguinte:

```js
    await Mail.sendMail({
        to: 'Nome <email@email.com>',
        subject: 'Assunto',
        template: 'cancellation', //nome do arquivo sem a extensão dentro da pasta conforme configurado em  `src/lib/Mail.js`, na linha `layoutsDir: resolve(viewPath, 'layouts'),`
        context: {
            provider: 'Irá alimentar a variavel {{ provider }}', // <- Leia o conteúdo da variavel para entender
            user: 'Irá alimentar a variavel {{ user }}', // <- Leia o conteúdo da variavel para entender
            date: 'Irá alimentar a variavel {{ date }}', // <- Leia o conteúdo da variavel para entender
        },
    });
```


---

<h2>Filas</h2>

- Para realizar processos mais demorados como no caso de envio de e-mails podemos utilizar o recurso de filas, no caso ele irá armazenar os processos a serem executados em uma tabela e executar seguindo a fila em segundo plano deixando a aplicação mais peformática.

- Mais detalhes: [Job com nodejs utilizando Bee Queue](https://github.com/mrcarromesa/bee-queue)

---

**Redis**

- O banco de dados que iremos utilizar é o `Redis`, podemos instalar via docker:

```bash
docker run --name NOME_DA_IMAGEM -p 6379:6379 -d -t redis:alpine
```

- No lugar de `NOME_DA_IMAGEM` eu utilizei `redisbarber`

- O `alpine` é para instalar uma imagem super leve.

- Vamos criar uma configuração para acessar o redis, crie o arquivo `src/config/redis.js`:

```js
export default {
    host: '127.0.0.1',
    port: 6379,
};
```

**Bee Queue**

- Vamos adicionar a dependencia do [bee-queue](https://github.com/bee-queue/bee-queue):

```bash
yarn add bee-queue
```

- Criar uma pasta `src/app/jobs`

- Criar o arquivo `src/app/jobs/CancellationMail.js`

```js
// ...

class CancellationMail {
    get key() {
        return 'CancellationMail';
    }

    async handle({ data }) {
        // ...
    }
    // ...
}
```

- Algo interessante é o metodo `get key(){}`

- Se desejarmos acessar a propriedade key podemos realziar da seguinte forma:

```js
CancellationMail.key;
```

- E a key será o nome da class, cada job precisa ter uma key, então é bom utilizar esse padrão.

- O metodo `handle` é o que será executado em segundo plano.

- Criar o arquivo `src/lib/Queue.js`

```js
import Bee from 'bee-queue';
import CancellationMail from '../app/jobs/CancellationMail';

import redisConfig from '../config/redis';

const jobs = [CancellationMail]; // um array com todos os jobs que queremos executar.

class Queue {
    constructor() {
        this.queues = {};

        // Quando Instanciamos a class Queue chamamos o init
        this.init();
    }

    init() {
        // Aqui será pecorrido todo o array jobs[] através do forEach
        // com a desestruturação vamos obter os metodos que deverão estar em todas as classe de jobs
        // nesse caso a propriedade key e o metodo handle
        jobs.forEach(({ key, handle }) => {
            // Adicionamos a variavel queues de class de forma unica controlado pela chave
            // A estrutura do servico utilizando o `Bee(...)`
            this.queues[key] = {
                // o `Bee()` nos permitirá adicionar os jobs, ele espera:
                //  1 - a chave unica
                //  2 - a configuração do redis
                bee: new Bee(key, {
                    redis: redisConfig,
                }),
                // irá processar o job
                handle,
            };
        });
    }

    // Adicionar os jobs a suas estruturas correspondentes chamando a partir das chaves
    // add(Qual estrutura de fila que foi criada quero adicionar o meu job? ,
    //        os dados que serão processados no handle)
    add(queue, job) {
        // retorna o já adcionado job salvo pelo bee queue no redis informando o que deve ser executado
        return this.queues[queue].bee.createJob(job).save();
    }

    // Processar a fila
    processQueue() {
        // Pecorre os jobs previamente armazenados no array job, assim como metodo `init()` foi utilizado para armazenar estrutura para o jobs,
        // o `processQueue()` será utilizado para obter as queues armazenadas nos jobs que foram adicionadas pelo metodo `add()`
        jobs.forEach(job => {
            // Obtem a estrutura que foi armazenada atraves do metodo `init()`
            const { bee, handle } = this.queues[job.key];
            // Executa esse job, com monitoramento de falhas, caso alguma function não exista
            // caso uma function não possa ser executada e assim por diante.
            // para utilizar no evento `on()` passamos dois parametros
            //      1 - qual evento queremos monitorar
            //      2 - A function que irá receber esse monitoramento
            bee.on('failed', this.handleFailure).process(handle);

            // o Bee Queue tem outros eventos que podem ser vistos na docs do bee queue

            //poderia ser assim, caso não seja necessário monitorar as falhas:
            // bee.process(handle);
        });
    }

    // function de monitoramento de falhas chamado por:
    // bee.on('failed', this.handleFailure).process(handle);
    handleFailure(job, err) {
        console.log(`Queue ${job.queue.name}: FAILED`, err);
    }
}

export default new Queue();

```

- No arquivo `src/app/controllers/AppointmentController.js` adicionamos a chamada da fila:


```js
import CancellationMail from '../jobs/CancellationMail'; // importa o job para obter a chave da prop `key()`
import Queue from '../../lib/Queue'; // importa a fila para adicionar o job


//...
// primeiro parametro a chave unica no caso uma string
// segundo parametro os dados que serão processados pelo `handle({data})` no CancellationMail
await Queue.add(CancellationMail.key, { appointement });

```

- Por fim vamos criar um arquivo que será utilizado para rodar as jobs em background, o arquivo `src/queue.js`

```js
import Queue from './lib/Queue';

Queue.processQueue();

```

- Ele será executado separado da aplicação principal, dessa forma a fila nunca influencia na peformance da aplicação.


- Par permitir utilizar a estrutura do ES6, com o surcrase que já está adicionado ao projeto atual adicionamos o seguinte no `package.json` dentro de `"scripts"`:

```js
"queue": "nodemon src/queue.js"
```

- Além de ter a aplicação rodando:

```bash
yarn dev
```

- executamos adicionalmente a fila para rodar em background:

```bash
yarn queue
```


---

<h2>Agenda disponível</h2>

- Nas rotas adicionar a seguinte rota:

```js
import AvailableController from './app/controllers/AvailableController';

// ...

routes.get('/providers/:providerId/available', AvailableController.index);
```

- Criar o arquivo `src/app/controllers/AvailableController.js`:

```js
// ...

const appointments = await Appointment.findAll({
    where: {
        provider_id: req.params.providerId,
        canceled_at: null,
        date: {
            [Op.between]: [
                startOfDay(searchDate),
                endOfDay(searchDate),
            ],
        },
    },
});

const schedule = [
            '08:00',
            '09:00',
            '10:00',
            '11:00',
            '12:00',
            '13:00',
            '14:00',
            '15:00',
            '16:00',
            '17:00',
            '18:00',
            '19:00',
            '20:00',
        ];

const available = schedule.map(time => {
    // temos a string 08:00
    // utilizando o split abaixo juntamente com a desestruturação obteremos o seguinte
    // hour será = 08
    // minute será = 00
    const [hour, minute] = time.split(':');
    // aqui abaixo definimos 0 para os segundos
    // defimos os minutos conforme variavel `minute`
    // defimos a hora conforme variavel `hour`
    // utilizando o `Number()` do timestamp que no caso é a variavel `searchDate`
    const value = setSeconds(
        setMinutes(setHours(searchDate, hour), minute),
        0
    );

    // console.log(value);


    return {
        time, // o time será 08:00; 09:00 ...
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"), // Essa é a representação de 2020-05-08T15:00:00-03:00 por exemplo
        available:
            // Verificamos se primeira data é superior a segunda data
            isAfter(value, new Date()) &&
            // verifica se o horário já `NÃO` está agendado
            !appointments.find(a =>
                // Obtem apenas o horário da data obitida na tabela do banco de dados
                // e verifica se ela é igual ao time
                format(a.date, 'HH:mm') === time),
    };
});
// ...

```


- No Insomnia criar uma pasta `Available` criar um request `List` metodo GET url `{{base_url}}/providers/ID_DO_PROVIDER_AQUI/available`, sem nenhum corpo da requisição e adicionar o token no Auth, no query params adicionar um campo chamado `date` e o valor precisamos enviar um timestamp: o resultado disso por exemplo:

```js
new Date().getTime();
```

- Dentro de `src/app/models/Appointment.js` vamos adicionar dois campos virtuais para verificar se os agendamentos já passou ou se ele pode ser cancelado ou não:

```js
past: {
    type: Sequelize.VIRTUAL,
    get() {
        return isBefore(this.date, new Date());
    },
},
cancelable: {
    type: Sequelize.VIRTUAL,
    get() {
        return isBefore(new Date(), subHours(this.date, 2));
    },
},
```

- Dentro de `src/app/controllers/AppointmentController.js` vamos adicionar os campos para serem listados:

```js
attributes: ['id', 'date', 'past', 'cancelable'],
```

---

<h2>Controlar a parte de exceções</h2>

- é bom utilizar uma ferramenta para exibir quando a aplicação cai em alguma exceção e salvar um tipo de log, uma ferramenta que podemos utilizar é o [Sentry](https://sentry.io/welcome/)

- Só criar uma conta ou se logar.

- Ir em Projetos Criar novo Projeto, selecionar `Express`
- De um nome para o projeto
- E ele dá as intruções para instalar o sentry no projeto

- Executar o comando que ele exibe, no meu caso foi esse:

```bash
yarn add @sentry/node@5.15.5
```

- Crie uma config do sentry `src/config/sentry.js` onde será armazenado o dsn.


- No arquivo `src/app.js` adicione o seguinte:

```js
import * as Sentry from '@sentry/node';
import sentryConfig from './config/sentry';


//...
Sentry.init(sentryConfig);

//...
// antes de qualquer rota adicionar:
this.server.use(Sentry.Handlers.requestHandler());

// ...

// após todas as rotas adicionar:

this.server.use(Sentry.Handlers.errorHandler());
//...
```

- Porém há um problema que precisa ser resolvido... no caso de functions async o express não consiguirá enviar os erros para o sentry para isso adicionamos uma depêndencia:


```bash
yarn add express-async-errors
```

- Importar essa lib depois do express e antes de qualquer rota no arquivo `src/app.js`:

```js
import 'express-async-errors';
```

- Vamos adicionar outra dependencia:

```bash
yarn add youch
```

- Ele faz uma tratativa das mensagens de erro para dar uma visualização melhor para o desenvolvedor

- Ok agora os erros estão sendo capturados, porém a requisição fica travada, para resolver isso após a rotas vamos chamar uma function:

```js
import Youch from 'youch';
// ...

this.exceptionHandler();

//...

exceptionHandler() {
    // middleware de ecxecao
    // Quando criamos um middleware de ecxecao o primeiro parametro que recebemos é o error
    this.server.use(async (err, req, res, next) => {

        const errors = await new Youch(err, req).toJSON();

        return res.status(500).json(errors);
    });
}

```


---

<h2>Variáveis de ambientes</h2>

- Na raiz da aplicação criamos um arquivo chamado `.env`

- E as instruções escrevemos no formato `CHAVE=VALOR`

- É importante adiciona-lo ao .gitignore, pois não é recomendável enviar para o repositório pois contem informações sensiveis

- Precisamos carregar essas variaveis para aplicação para isso instalamos a dependencia:

```bash
yarn add dotenv
```

- No arquivo `src/app.js` adicionamos logo no inicio o import:

```js
import 'dotenv/config';
```

- Adicionar também no arquivo `src/queue.js` pois executa em processo separado no servidor

```js
import 'dotenv/config';
```

- Também no `src/config/database.js` e como não é possível utilizar import ali utilizamos o seguinte logo no inicio do arquivo:

```js
require('dotenv/config');
```

- Os arquivos que foram adicionados as variaveis de ambiente:
    - `models/File.js`
    - `app.js`, pode conter informações bem sensiveis no erro reportado:

    ```js
        exceptionHandler() {
            // middleware de ecxecao
            this.server.use(async (err, req, res, next) => {
                if (process.env.NODE_ENV === 'development') {
                    const errors = await new Youch(err, req).toJSON();

                    return res.status(500).json(errors);
                }

                return res.status(500).json({ error: 'Internal server error' });
            });
        }
    ```

    - `config/auth.js`
    - `config/database.js`
    - `config/redis.js`
    - `config/mail.js`
    - `database/index.js`

- Uma boa prática é criar o arquivo no raiz chamado `.env.example` esse pode ir para o repositório, porém deve conter apenas as chaves e não os valores de arquivo `.env`

---
