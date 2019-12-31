import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CancellationMail {
    get key() {
        return 'CancellationMail';
    }

    async handle({ data }) {
        // console.log('fila executou');
        const { appointement } = data;
        await Mail.sendMail({
            to: `${appointement.provider.name} <${appointement.provider.email}>`,
            subject: 'Agendamento cancelado',
            template: 'cancellation',
            context: {
                provider: appointement.provider.name,
                user: appointement.user.name,
                date: format(
                    parseISO(appointement.date),
                    "'dia' dd 'de' MMMM', às' hh:mm'h'",
                    { locale: pt }
                ),
            },
        });
    }
}

export default new CancellationMail();
