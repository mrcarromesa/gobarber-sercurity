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
