import Notifications from '../schemas/Notifications';
import User from '../models/User';

class NotificationsController {
    async index(req, res) {
        const checkIsProvider = await User.findOne({
            where: {
                id: req.userId,
                provider: true,
            },
        });

        if (!checkIsProvider) {
            return res.status(401).json({
                error: 'Only providers can load notifications',
            });
        }

        const noitfications = await Notifications.find({
            user: req.userId,
        })
            .sort({ createdAt: 'desc' })
            .limit(20);

        return res.json(noitfications);
    }

    async update(req, res) {
        const { id } = req.params;

        const notification = await Notifications.findByIdAndUpdate(
            id,
            { read: true },
            { new: true }
        );

        return res.json(notification);
    }
}

export default new NotificationsController();
