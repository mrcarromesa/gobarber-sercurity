import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';

import Notification from '../schemas/Notifications';

import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';

class AppointmentController {
    async index(req, res) {
        const { page: p = 1 } = req.query;
        const limit = 20;

        const appointment = await Appointment.finddAll({
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
        const schema = Yup.object().shape({
            provider_id: Yup.number().required(),
            date: Yup.date().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validations fails' });
        }

        const { provider_id, date } = req.body;
        if (provider_id === req.userId) {
            return res
                .status(400)
                .json({ error: 'User dos not be equals  provider!' });
        }
        /**
         * Check if provider_id is a provider
         *
         */

        const checkIsProvider = await User.findOne({
            where: {
                id: provider_id,
                provider: true,
            },
        });

        if (!checkIsProvider) {
            return res.status(401).json({
                error: 'You can only create appointements with providers',
            });
        }

        /**
         * Check for past dates
         */
        const hourStart = startOfHour(parseISO(date));
        if (isBefore(hourStart, new Date())) {
            return res
                .status(400)
                .json({ error: 'Past date are not permitted' });
        }

        /**
         * Check for date availability
         */
        const checkAvailability = await Appointment.findOne({
            where: {
                provider_id,
                canceled_at: null,
                date: hourStart,
            },
        });

        if (checkAvailability) {
            return res
                .status(400)
                .json({ error: 'Appointament date is not available' });
        }

        const appointement = await Appointment.create({
            user_id: req.userId,
            provider_id,
            date: hourStart,
        });

        /**
         * Notify appontment provider
         */

        const user = await User.findByPk(req.userId);
        const formattedDate = format(
            hourStart,
            "'dia' dd 'de' MMMM', às' hh:mm'h'",
            { locale: pt }
        );

        await Notification.create({
            content: `Novo agendamento de ${user.name} para ${formattedDate}`,
            user: provider_id,
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
