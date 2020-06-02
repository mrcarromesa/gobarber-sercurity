# Design Patterns

## Patterns Comuns:

- Singleton (Instanciado uma vez)
    - O node transforma toda exportação de objetos em um singleton
- Repository (abstração da conexão com o banco)
- Service Pattern (abstração de lógica)
    - Abstrair lógica do controller
    - Quando? (code smell)
        - Código muito denso
        - Condicionais dentro do controller
        - Regra de negócio redundante
- Observer (dirigida a eventos)

- Patterns são uteis em projetos conforme eles crescem

- Quando uma aplicação node cresce muito podemos utilizar outras alternativas:
    - Micro-serviços
    - Serverless

## Separar as validações

- Criar a pasta `src/app/validators/`

- Vamos Criar o validator para o `UserController` então dentro da pasta `src/app/validators/` podemos criar um arquivo com o nome `NOME_DO_CONTROLLER_NOME_DO_METODO`, Nesse caso o arquivo será `UserStore.js` e adicionamos isso no arquivo:

```js
import * as Yup from 'yup';

export default async (req, res, next) => {
    try {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string()
                .email()
                .required(),
            password: Yup.string()
                .required()
                .min(6),
        });

        await schema.validate(req.body, { abortEarly: false });
        return next();
    } catch (error) {

        // Caso de algum erro no yup ele cai aqui
        // podemos capturar a msg através do error.inner

        return res
            .status(400)
            .json({ error: 'Validations fails', messages: error.inner });
    }
};

```

- E removemos essa parte do metodo `store` do arquivo `src/app/controllers/UserController.js`

- Porfim no arquivo de rotas `src/routes.js` podemos adicionar esse middleware:

```js
// podemos chamar de qualquer nome pois exportamos com default
//...
import validateUserStore from './app/validators/UserStore';
//...
routes.post('/users', validateUserStore, UserController.store);
//...
```

- Realizamos o mesmo com o de session e appointment
