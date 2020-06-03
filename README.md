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

---

## Lógica mais complexas dentro do controller movemos para services

- O controller `AppointmentController.js` contem código muito denso, o qual seria interessante transferirmos um pouco da lógica para um serviço.

- Vamos criar a pasta `src/app/services/` e vamos separar partes da lógica

- Vamos criar o arquivo `CreateAppointmentService`,

- O objeto service ele será um singleton, ele jamais poderá ter acesso ao objeto req do express e nem ao objeto res.

- No lugar do res utilizamos o `throw new Error('ERROR');`

- Por fim para chamar o serviço utilizamos:

```js
const appointement = await CreateAppointmentService.run({
    provider_id,
    userId: req.userId,
    date,
});
```


---

- Transferindo a lógica do cancelamento do agendamento para um service

- Sobre o cancelmento pode ser que ele seja replicado para um link ou pode ser feito de outra forma, dessa forma é ideal transferimos isso para um service.


---

- Também iremos ajustar o `AvailableController` criando o serviço para ele.

- Os demais controllers estão ainda bem legíveis, caso futuramente for implementado mais código que fique a leitura um tanto dificil podemos abstrair mais código, o importante é que o desenvolvedor possa ler e entender facilmente o código.
