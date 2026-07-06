const { Op } = require('sequelize');
const { Transaction, Attendance, User, VehicleType } = require('../models');
const { successRes, errorRes } = require('../utils/response');

const getDashboard = async (req, res) => {
  try {
    const today = new Date();
    const todayString = today.toISOString().slice(0, 10);

    const totalTransactions = await Transaction.count();
    const totalRevenueRow = await Transaction.findOne({
      attributes: [[Transaction.sequelize.fn('SUM', Transaction.sequelize.col('total')), 'totalRevenue']],
    });
    const totalRevenue = totalRevenueRow.get('totalRevenue') || 0;

    const statusCounts = await Transaction.findAll({
      attributes: ['status', [Transaction.sequelize.fn('COUNT', Transaction.sequelize.col('id')), 'count']],
      group: ['status'],
    });

    const attendanceToday = await Attendance.findAll({
      where: { tanggal: todayString },
    });
    const userAbsen = attendanceToday.length;
    const userActive = await User.count({ where: { aktif: true } });

    const vehicleCounts = await Transaction.findAll({
      attributes: ['jenis_kendaraan_id', [Transaction.sequelize.fn('COUNT', Transaction.sequelize.col('id')), 'count']],
      group: ['jenis_kendaraan_id'],
      include: [{ model: VehicleType, attributes: ['nama'] }],
    });

    const response = {
      totalTransactions,
      totalRevenue: Number(totalRevenue),
      userActive,
      userAbsen,
      vehicleCounts: vehicleCounts.map((row) => ({
        vehicleType: row.VehicleType?.nama || 'Unknown',
        count: Number(row.get('count')),
      })),
      statusCounts: statusCounts.map((row) => ({ status: row.status, count: Number(row.get('count')) })),
    };

    return successRes(res, 'Dashboard data fetched', response);
  } catch (err) {
    console.error(err);
    return errorRes(res, 'Failed to fetch dashboard data');
  }
};

module.exports = { getDashboard };