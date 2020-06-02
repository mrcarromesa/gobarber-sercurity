import { isBefore, subHours } from 'date-fns';
import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';

import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';

import CreateAppointmentService from '../services/CreateAppointmentService';

class AppointmentController {
    async index(req, res) {
        const { page: p = 1 } = req.query;
        const limit = 20;

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
        const appointement = await Appointment.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    as: 'provider',
                    attributes: ['name', 'email'],
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['name'],
                },
            ],
        });

        if (appointement.user_id !== req.userId) {
            return res.status(401).json({
                error: "You don't permission to cancel this appointment.",
            });
        }

        // subrair x horas da data informada
        const dateWithSub = subHours(appointement.date, 2);

        if (isBefore(dateWithSub, new Date())) {
            return res.status(401).json({
                error: 'You can only cancel appointments 2 hours in advance',
            });
        }

        appointement.canceled_at = new Date();

        await appointement.save();

        await Queue.add(CancellationMail.key, { appointement });

        return res.json(appointement);
    }
}

export default new AppointmentController();
