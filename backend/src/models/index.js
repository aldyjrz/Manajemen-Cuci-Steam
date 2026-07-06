const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user')(sequelize, Sequelize.DataTypes);
db.Attendance = require('./attendance')(sequelize, Sequelize.DataTypes);
db.Product = require('./product')(sequelize, Sequelize.DataTypes);
db.VehicleType = require('./vehicleType')(sequelize, Sequelize.DataTypes);
db.Transaction = require('./transaction')(sequelize, Sequelize.DataTypes);
db.TransactionItem = require('./transactionItem')(sequelize, Sequelize.DataTypes);
db.Assignment = require('./assignment')(sequelize, Sequelize.DataTypes);
db.Setting = require('./setting')(sequelize, Sequelize.DataTypes);

Object.values(db).forEach((model) => {
  if (typeof model.associate === 'function') {
    model.associate(db);
  }
});

module.exports = db;
