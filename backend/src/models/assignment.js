module.exports = (sequelize, DataTypes) => {
  const Assignment = sequelize.define('Assignment', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    transaksi_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    assigned_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    started_at: {
      type: DataTypes.DATE,
    },
    finished_at: {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'assignments',
    timestamps: true,
    underscored: true,
  });

  Assignment.associate = (models) => {
    Assignment.belongsTo(models.Transaction, { foreignKey: 'transaksi_id' });
    Assignment.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return Assignment;
};