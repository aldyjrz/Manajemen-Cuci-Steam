const { Transaction, TransactionItem, VehicleType, Assignment, User, Product } = require('../models');
const { Op } = require('sequelize');
const { successRes, errorRes } = require('../utils/response');

const listTransactions = async (req, res) => {
  try {
    const { status, tanggal, product_id, user_id } = req.query;
    const where = {};

    if (status) where.status = status;
    if (tanggal) {
      where.created_at = { [Op.gte]: `${tanggal} 00:00:00`, [Op.lte]: `${tanggal} 23:59:59` };
    }

    const transactions = await Transaction.findAll({
      where,
      include: [
        { model: VehicleType, attributes: ['id', 'nama'] },
        { model: TransactionItem, include: [{ model: Product, attributes: ['id', 'nama_produk'] }] },
        { model: Assignment, include: [{ model: User, attributes: ['id', 'nama'] }] },
      ],
      order: [['created_at', 'DESC']],
    });

    return successRes(res, 'Transactions fetched', transactions);
  } catch (err) {
    console.error(err);
    return errorRes(res, 'Failed to fetch transactions');
  }
};

const createTransaction = async (req, res) => {
  try {
    const { nomor_plat, nama_pelanggan, no_hp, jenis_kendaraan_id, total, diskon, metode_bayar, catatan, items } = req.body;
    if (!nomor_plat || !jenis_kendaraan_id || total == null) return errorRes(res, 'Missing required fields', 400);

    const transaction = await Transaction.create({ nomor_plat, nama_pelanggan, no_hp, jenis_kendaraan_id, total, diskon: diskon || 0, metode_bayar, catatan, status: 'Waiting' });
    if (Array.isArray(items) && items.length) {
      const transactionItems = items.map((item) => ({
        transaksi_id: transaction.id,
        product_id: item.product_id,
        harga: item.harga,
        quantity: item.quantity || 1,
      }));
      await TransactionItem.bulkCreate(transactionItems);
    }

    return successRes(res, 'Transaction created', transaction);
  } catch (err) {
    console.error(err);
    return errorRes(res, 'Failed to create transaction');
  }
};

const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) return errorRes(res, 'Transaction not found', 404);

    const { nomor_plat, nama_pelanggan, no_hp, jenis_kendaraan_id, total, diskon, metode_bayar, catatan, status } = req.body;
    await transaction.update({ nomor_plat, nama_pelanggan, no_hp, jenis_kendaraan_id, total, diskon, metode_bayar, catatan, status });
    return successRes(res, 'Transaction updated', transaction);
  } catch (err) {
    console.error(err);
    return errorRes(res, 'Failed to update transaction');
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) return errorRes(res, 'Transaction not found', 404);
    await transaction.destroy();
    return successRes(res, 'Transaction deleted', {});
  } catch (err) {
    console.error(err);
    return errorRes(res, 'Failed to delete transaction');
  }
};

const assignUser = async (req, res) => {
  try {
    const { transaksi_id, user_id } = req.body;
    if (!transaksi_id || !user_id) return errorRes(res, 'transaksi_id and user_id are required', 400);

    const existing = await Assignment.findOne({ where: { transaksi_id, user_id } });
    if (existing) return errorRes(res, 'Assignment already exists', 400);

    const assignment = await Assignment.create({ transaksi_id, user_id, assigned_at: new Date() });
    await Transaction.update({ status: 'Assigned' }, { where: { id: transaksi_id } });
    return successRes(res, 'User assigned', assignment);
  } catch (err) {
    console.error(err);
    return errorRes(res, 'Failed to assign user');
  }
};

const updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id);
    if (!assignment) return errorRes(res, 'Assignment not found', 404);

    const { started_at, finished_at, status } = req.body;
    if (started_at) assignment.started_at = started_at;
    if (finished_at) assignment.finished_at = finished_at;
    await assignment.save();
    if (status) {
      const statusMap = { started: 'Washing', finished: 'Finished', cancel: 'Cancel' };
      if (statusMap[status]) {
        await Transaction.update({ status: statusMap[status] }, { where: { id: assignment.transaksi_id } });
      }
    }

    return successRes(res, 'Assignment updated', assignment);
  } catch (err) {
    console.error(err);
    return errorRes(res, 'Failed to update assignment');
  }
};

module.exports = { listTransactions, createTransaction, updateTransaction, deleteTransaction, assignUser, updateAssignment };