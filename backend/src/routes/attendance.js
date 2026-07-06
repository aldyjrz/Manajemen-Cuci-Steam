const express = require('express');
const { listAttendance, createAttendance, updateAttendance, deleteAttendance, reportAttendance } = require('../controllers/attendanceController');
const authJWT = require('../middleware/authJWT');
const { allowRoles } = require('../middleware/roles');

const router = express.Router();

router.use(authJWT);
router.get('/', allowRoles('Admin','Kasir','Karyawan'), listAttendance);
router.post('/', allowRoles('Admin','Kasir','Karyawan'), createAttendance);
router.put('/:id', allowRoles('Admin','Kasir','Karyawan'), updateAttendance);
router.delete('/:id', allowRoles('Admin','Kasir'), deleteAttendance);
router.get('/report', allowRoles('Admin','Kasir'), reportAttendance);

module.exports = router;