const express = require('express');
const { getSettings, updateSettings } = require('../controllers/settingController');
const authJWT = require('../middleware/authJWT');
const { allowRoles } = require('../middleware/roles');

const router = express.Router();
router.use(authJWT);
router.get('/', allowRoles('Admin','Kasir','Karyawan'), getSettings);
router.put('/', allowRoles('Admin'), updateSettings);

module.exports = router;