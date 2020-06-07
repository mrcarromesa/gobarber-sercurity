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
