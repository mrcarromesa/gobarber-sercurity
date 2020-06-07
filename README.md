# Segurança

## Express Brute:

- Tentativa de dos atacantes para tentar utilizar usuários e senhas aleatorios para tentar acessar a aplicação, para previnir isso podemos utilizar o express brute que monitora se o usuário tentou x vezes realizar o login e se errou e daí então podemos bloquear o ip dele por um periodo de tempo

- Inicialmente instalamos isso:

```bash
yarn add express-brute express-brute-redis
```

- Importamos isso no arquivo de rotas

```js
import Brute from 'express-brute';
import BruteRedis from 'express-brute-redis';

// ...

const bruteStore = new BruteRedis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
});

const bruteForce = new Brute(bruteStore);

// ...

routes.post(
    '/sessions',
    bruteForce.prevent, // Adicionamos como primeiro middleware em todas as rotas que desejamos
    validateSessionStore,
    SessionController.store
);
```


## Utilizar o Helmet

- Instale:

```bash
yarn add helmet
```

- Utilizamos ele para criar alguns headers que adiciona algumas propriedades de segurança, como não permitir executar dentro de um iframe entre outras coisas

- Daí então só adicionar ao express no arquivo `src/app.js`, junto com os demais middlewares:

```js
this.server.use(helmet()); // <- seguranca extra
```

---

## Rate Limit

- Caso alguém fique relaizando alguma chamada direto em uma determinada rota isso pode quebrar a aplicação


- Para contornar isso podemos utilizar a dependencia:

```bash
yarn add express-rate-limit redis
```

- E também esse:

```bash
yarn add rate-limit-redis
```


- No arquivo `src/app.js` adicionar:

```js

//...
import redis from 'redis';
import RateLimit from 'express-rate-limit';
import RateLimitRedis from 'rate-limit-redis';

// ...
if (process.env.NODE_ENV !== 'development') {
    this.server.use(
        new RateLimit({
            store: new RateLimitRedis({
                client: redis.createClient({
                    host: process.env.REDIS_HOST,
                    port: process.env.REDIS_PORT,
                }),
            }),
            windowMs: 1000 * 60 * 15, // <- milisegundos * segundos * minutos
            max: 100, // maximo de requisições que podem ocorrer dentro do intervalo de minutos
        })
    );
}
// ...

```

- Utilizamos sempre no ambiente de produção, pode ser cerca de 100 request a cada 15 minutos
 por usuário
