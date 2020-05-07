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
---

<h2>Criação de controllers</h2>

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

<h2>JWT</h2>

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

**Extra Exemplo de validação de cpf e cpfOuEmail no mesmo campo**

```js
import * as Yup from 'yup';
// add de yarn add cpf-cnpj-validator
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


