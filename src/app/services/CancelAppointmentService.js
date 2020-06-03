import { isBefore, subHours } from 'date-fns';
import Appointment from '../models/Appointment';
import User from '../models/User';

import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';

class CancelAppointmentService {
    async run({ provider_id, userId }) {
        const appointement = await Appointment.findByPk(provider_id, {
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

        if (appointement.user_id !== userId) {
            throw new Error("You don't permission to cancel this appointment.");
        }

        // subrair x horas da data informada
        const dateWithSub = subHours(appointement.date, 2);

        if (isBefore(dateWithSub, new Date())) {
            throw new Error(
                'You can only cancel appointments 2 hours in advance'
            );
        }

        appointement.canceled_at = new Date();

        await appointement.save();

        await Queue.add(CancellationMail.key, { appointement });

        return appointement;
    }
}

export default new CancelAppointmentService();
