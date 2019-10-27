import { startOfDay, endOfDay, parseISO, format } from 'date-fns';
import { Op } from 'sequelize';
import User from '../models/User';
import Appointment from '../models/Appointment';

class SchenduleController {
    async index(req, res) {
        const checkIsProvider = await User.findOne({
            where: { id: req.userId, provider: true },
        });

        if (!checkIsProvider) {
            return res.status(401).json({ error: 'User is not a provider' });
        }

        const limit = 20;
        const {
            page: p = 1,
            date: dateSchendule = `${format(
                new Date(),
                'yyyy-MM-dd'
            )}T00:00:00-03:00`,
        } = req.query;

        // return res.json(dateSchendule);

        const parseDay = parseISO(dateSchendule);

        const schendule = await Appointment.findAll({
            where: {
                provider_id: req.userId,
                canceled_at: null,
                date: {
                    [Op.between]: [startOfDay(parseDay), endOfDay(parseDay)],
                },
            },
            order: [['date', 'DESC']],
            limit,
            offset: (p - 1) * limit,
            include: [
                {
                    model: User,
                    as: 'user',
                },
            ],
        });
        res.json(schendule);
    }
}

export default new SchenduleController();
