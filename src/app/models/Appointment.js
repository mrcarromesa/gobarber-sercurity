import Sequelize, { Model } from 'sequelize';

class Appointment extends Model {
    static init(sequelize) {
        super.init(
            {
                date: Sequelize.DATE,
                canceled_at: Sequelize.DATE,
            },
            { sequelize }
        );

        return this;
    }

    static associate(models) {
        // quando tenho dois relacionamentos para mesma tabela, sou obrigado
        // a informar o "as", pois se nao o sequelize ira se perder sobre
        // qual relacionamento ele ira utilizar
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
        this.belongsTo(models.User, {
            foreignKey: 'provider_id',
            as: 'provider',
        });
    }
}

export default Appointment;
