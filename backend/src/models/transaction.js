module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    nomor_plat: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nama_pelanggan: {
      type: DataTypes.STRING,
    },
    no_hp: {
      type: DataTypes.STRING,
    },
    jenis_kendaraan_id: {
      type: DataTypes.INTEGER.UNSIGNED,
    },
    total: {
      type: DataTypes.DECIMAL(12,2),
      allowNull: false,
      defaultValue: 0,
    },
    diskon: {
      type: DataTypes.DECIMAL(12,2),
      allowNull: false,
      defaultValue: 0,
    },
    metode_bayar: {
      type: DataTypes.STRING,
    },
    catatan: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.ENUM('Waiting','Assigned','Washing','Finished','Cancel'),
      allowNull: false,
      defaultValue: 'Waiting',
    },
  }, {
    tableName: 'transactions',
    timestamps: true,
    underscored: true,
  });

  Transaction.associate = (models) => {
    Transaction.belongsTo(models.VehicleType, { foreignKey: 'jenis_kendaraan_id' });
    Transaction.hasMany(models.TransactionItem, { foreignKey: 'transaksi_id' });
    Transaction.hasMany(models.Assignment, { foreignKey: 'transaksi_id' });
  };

  return Transaction;
};