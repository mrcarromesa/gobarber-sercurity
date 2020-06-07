import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';

import CreateAppointmentService from '../services/CreateAppointmentService';
import CancelAppointmentService from '../services/CancelAppointmentService';

import Cache from '../../lib/Cache';

class AppointmentController {
    async index(req, res) {
        const { page: p = 1 } = req.query;
        const limit = 20;

        const cacheKey = `user:${req.userId}:appointments:${p}`;

        const cached = await Cache.get(cacheKey);

        if (cached) {
            return res.json(cached);
        }

        const appointment = await Appointment.findAll({
            where: { user_id: req.userId, canceled_at: null },
            attributes: ['id', 'date', 'past', 'cancelable'],
            order: [['date', 'ASC']],
            limit,
            offset: (p - 1) * limit,
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

        await Cache.set(cacheKey, appointment);

        return res.json(appointment);
    }

    async store(req, res) {
        const { provider_id, date } = req.body;

        const appointement = await CreateAppointmentService.run({
            provider_id,
            userId: req.userId,
            date,
        });

        // const { provider_id, date } = await Appointment.create(req.body);
        return res.json(appointement);
    }

    async delete(req, res) {
        const appointement = await CancelAppointmentService.run({
            provider_id: req.params.id,
            userId: req.userId,
        });
        return res.json(appointement);
    }
}

export default new AppointmentController();
