const express = require('express');
const { getDashboard } = require('../controllers/dashboardController');
const authJWT = require('../middleware/authJWT');
const { allowRoles } = require('../middleware/roles');
const router = express.Router();

router.use(authJWT);
router.get('/', allowRoles('Admin','Kasir'), getDashboard);

module.exports = router;