const dayjs = require('dayjs');
const { Op } = require('sequelize');
const { Attendance, User } = require('../models');
const { successRes, errorRes } = require('../utils/response');

const listAttendance = async (req, res) => {
  try {
    const { tanggal, user_id, bulan } = req.query;
    const where = {};

    if (tanggal) where.tanggal = tanggal;
    if (user_id) where.user_id = user_id;
    if (bulan) {
      const monthStart = dayjs(bulan).startOf('month').format('YYYY-MM-DD');
      const monthEnd = dayjs(bulan).endOf('month').format('YYYY-MM-DD');
      where.tanggal = { [Op.between]: [monthStart, monthEnd] };
    }

    const attendances = await Attendance.findAll({
      where,
      include: [{ model: User, attributes: ['id', 'nama', 'username'] }],
      order: [['tanggal', 'DESC']],
    });

    return successRes(res, 'Attendance fetched', attendances);
  } catch (err) {
    console.error(err);
    return errorRes(res, 'Failed to fetch attendance');
  }
};

const createAttendance = async (req, res) => {
  try {
    const { user_id, tanggal, jam_masuk, jam_pulang, status } = req.body;
    if (!user_id || !tanggal) return errorRes(res, 'user_id and tanggal are required', 400);

    const existing = await Attendance.findOne({ where: { user_id, tanggal } });
    if (existing) return errorRes(res, 'Attendance already exists for this user and date', 400);

    const attendance = await Attendance.create({ user_id, tanggal, jam_masuk, jam_pulang, status });
    return successRes(res, 'Attendance created', attendance);
  } catch (err) {
    console.error(err);
    return errorRes(res, 'Failed to create attendance');
  }
};

const updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByPk(req.params.id);
    if (!attendance) return errorRes(res, 'Attendance not found', 404);

    const { jam_masuk, jam_pulang, status } = req.body;
    await attendance.update({ jam_masuk, jam_pulang, status });
    return successRes(res, 'Attendance updated', attendance);
  } catch (err) {
    console.error(err);
    return errorRes(res, 'Failed to update attendance');
  }
};

const deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByPk(req.params.id);
    if (!attendance) return errorRes(res, 'Attendance not found', 404);
    await attendance.destroy();
    return successRes(res, 'Attendance deleted', {});
  } catch (err) {
    console.error(err);
    return errorRes(res, 'Failed to delete attendance');
  }
};

const reportAttendance = async (req, res) => {
  try {
    const { tanggal_mulai, tanggal_selesai, user_id } = req.query;
    const where = {};

    if (tanggal_mulai && tanggal_selesai) {
      where.tanggal = { [Op.between]: [tanggal_mulai, tanggal_selesai] };
    } else if (tanggal_mulai) {
      where.tanggal = { [Op.gte]: tanggal_mulai };
    } else if (tanggal_selesai) {
      where.tanggal = { [Op.lte]: tanggal_selesai };
    }
    if (user_id) where.user_id = user_id;

    const attendances = await Attendance.findAll({
      where,
      include: [{ model: User, attributes: ['id', 'nama'] }],
    });

    const total = attendances.length;
    const counts = attendances.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});

    return successRes(res, 'Attendance report', { total, counts, attendances });
  } catch (err) {
    console.error(err);
    return errorRes(res, 'Failed to generate attendance report');
  }
};

module.exports = { listAttendance, createAttendance, updateAttendance, deleteAttendance, reportAttendance };