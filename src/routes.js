import { Router } from 'express';

import Brute from 'express-brute';
import BruteRedis from 'express-brute-redis';

import multer from 'multer';
import multerConfig from './config/multer';
// import User from './app/models/User';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import ProviderController from './app/controllers/ProviderController';
import AvailableController from './app/controllers/AvailableController';
import FileController from './app/controllers/FileController';
import AppointmentController from './app/controllers/AppointmentController';
import SchenduleController from './app/controllers/SchenduleController';
import NotificationsController from './app/controllers/NotificationsController';

import authMiddleware from './app/middlewares/auth';

import validateUserStore from './app/validators/UserStore';
import validateUserUpdate from './app/validators/UserUpdate';
import validateSessionStore from './app/validators/SessionStore';
import validateAppointmentStore from './app/validators/AppointmentStore';

const routes = new Router();
const upload = multer(multerConfig);

const bruteStore = new BruteRedis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
});

const bruteForce = new Brute(bruteStore);

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

routes.post(
    '/sessions',
    bruteForce.prevent,
    validateSessionStore,
    SessionController.store
);
routes.post('/users', validateUserStore, UserController.store);

routes.use(authMiddleware);

routes.put('/users', validateUserUpdate, UserController.update);

routes.get('/providers', ProviderController.index);
routes.get('/providers/:providerId/available', AvailableController.index);

routes.post(
    '/appointments',
    validateAppointmentStore,
    AppointmentController.store
);
routes.get('/appointments', AppointmentController.index);
routes.delete('/appointments/:id', AppointmentController.delete);
routes.get('/schendule', SchenduleController.index);

routes.get('/notifications', NotificationsController.index);
routes.put('/notifications/:id', NotificationsController.update);
// Criar arquivos para usuarios
routes.post('/files', upload.single('file'), FileController.store);

export default routes;
