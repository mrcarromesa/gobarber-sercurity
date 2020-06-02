import { startOfHour, parseISO, isBefore, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Notification from '../schemas/Notifications';
import User from '../models/User';
import Appointment from '../models/Appointment';

class CreateAppointmentService {
    async run({ provider_id, userId, date }) {
        if (provider_id === userId) {
            throw new Error('User dos not be equals  provider!');
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
            throw new Error('You can only create appointements with providers');
        }

        /**
         * Check for past dates
         */
        const hourStart = startOfHour(parseISO(date));
        if (isBefore(hourStart, new Date())) {
            throw new Error('Past date are not permitted');
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
            throw new Error('Appointament date is not available');
        }

        const appointement = await Appointment.create({
            user_id: userId,
            provider_id,
            date: hourStart,
        });

        /**
         * Notify appontment provider
         */

        const user = await User.findByPk(userId);
        const formattedDate = format(
            hourStart,
            "'dia' dd 'de' MMMM', às' hh:mm'h'",
            { locale: pt }
        );

        await Notification.create({
            content: `Novo agendamento de ${user.name} para ${formattedDate}`,
            user: provider_id,
        });

        return appointement;
    }
}

export default new CreateAppointmentService();
