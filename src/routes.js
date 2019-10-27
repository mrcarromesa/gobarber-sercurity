import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
// import User from './app/models/User';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import ProviderController from './app/controllers/ProviderController';
import FileController from './app/controllers/FileController';
import AppointmentController from './app/controllers/AppointmentController';
import SchenduleController from './app/controllers/SchenduleController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

/*
routes.get('/', async (req, res) => {
const user = await User.create({
        name: 'Rodolfo',
        email: 'carromesa@outlook.com',
        password_hash: '23412341234',
    });
    return res.json(user);
});
*/

routes.post('/sessions', SessionController.store);
routes.post('/users', UserController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.get('/providers', ProviderController.index);

routes.post('/appointments', AppointmentController.store);
routes.get('/appointments', AppointmentController.index);
routes.get('/schendule', SchenduleController.index);

// Criar arquivos para usuarios
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
