module.exports = (sequelize, DataTypes) => {
  const Setting = sequelize.define('Setting', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    nama_steam: {
      type: DataTypes.STRING,
    },
    logo: {
      type: DataTypes.STRING,
    },
    alamat: {
      type: DataTypes.TEXT,
    },
    no_hp: {
      type: DataTypes.STRING,
    },
    footer: {
      type: DataTypes.TEXT,
    },
  }, {
    tableName: 'settings',
    timestamps: false,
    underscored: true,
  });

  return Setting;
};