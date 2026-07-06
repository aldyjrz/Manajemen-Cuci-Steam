module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define('Attendance', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    tanggal: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    jam_masuk: {
      type: DataTypes.DATE,
    },
    jam_pulang: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.ENUM('Hadir','Izin','Sakit','Alpha'),
      defaultValue: 'Hadir',
    },
  }, {
    tableName: 'attendances',
    timestamps: true,
    underscored: true,
    indexes: [
      { unique: true, fields: ['user_id', 'tanggal'] },
    ],
  });

  Attendance.associate = (models) => {
    Attendance.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return Attendance;
};