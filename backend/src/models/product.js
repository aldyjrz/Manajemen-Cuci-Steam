module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    nama_produk: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    harga: {
      type: DataTypes.DECIMAL(12,2),
      allowNull: false,
      defaultValue: 0,
    },
    komisi: {
      type: DataTypes.DECIMAL(12,2),
      allowNull: false,
      defaultValue: 0,
    },
    estimasi_waktu: {
      type: DataTypes.INTEGER.UNSIGNED,
    },
    aktif: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    tableName: 'products',
    timestamps: true,
    underscored: true,
  });

  return Product;
};