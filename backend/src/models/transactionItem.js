module.exports = (sequelize, DataTypes) => {
  const TransactionItem = sequelize.define('TransactionItem', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    transaksi_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    harga: {
      type: DataTypes.DECIMAL(12,2),
      allowNull: false,
      defaultValue: 0,
    },
    quantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 1,
    },
  }, {
    tableName: 'transaction_items',
    timestamps: true,
    underscored: true,
  });

  TransactionItem.associate = (models) => {
    TransactionItem.belongsTo(models.Transaction, { foreignKey: 'transaksi_id' });
    TransactionItem.belongsTo(models.Product, { foreignKey: 'product_id' });
  };

  return TransactionItem;
};