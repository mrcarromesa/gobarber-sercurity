module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('users', 'avatar_id', {
            type: Sequelize.INTEGER,
            references: { model: 'files', key: 'id' }, // foringkey
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            allowNull: true,
        });
    },

    down: queryInterface => queryInterface.removeColumn('users', 'avatar_Id'),
};
