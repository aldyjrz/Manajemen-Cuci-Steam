module.exports = (sequelize, DataTypes) => {
  const VehicleType = sequelize.define('VehicleType', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'vehicle_types',
    timestamps: true,
    underscored: true,
  });

  return VehicleType;
};