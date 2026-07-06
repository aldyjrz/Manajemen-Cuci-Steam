const express = require('express');
const { listTransactions, createTransaction, updateTransaction, deleteTransaction, assignUser, updateAssignment } = require('../controllers/transactionController');
const authJWT = require('../middleware/authJWT');
const { allowRoles } = require('../middleware/roles');

const router = express.Router();
router.use(authJWT);
router.get('/', allowRoles('Admin','Kasir'), listTransactions);
router.post('/', allowRoles('Admin','Kasir'), createTransaction);
router.put('/:id', allowRoles('Admin','Kasir'), updateTransaction);
router.delete('/:id', allowRoles('Admin','Kasir'), deleteTransaction);
router.post('/assign', allowRoles('Admin','Kasir'), assignUser);
router.put('/assign/:id', allowRoles('Admin','Kasir','Karyawan'), updateAssignment);

module.exports = router;