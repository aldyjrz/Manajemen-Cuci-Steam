const express = require('express');
const { VehicleType } = require('../models');
const authJWT = require('../middleware/authJWT');
const { allowRoles } = require('../middleware/roles');
const { successRes, errorRes } = require('../utils/response');

const router = express.Router();
router.use(authJWT);

router.get('/', allowRoles('Admin','Kasir','Karyawan'), async (req, res) => {
  try {
    const list = await VehicleType.findAll({ order: [['id', 'ASC']] });
    return successRes(res, 'Vehicle types fetched', list);
  } catch (err) {
    console.error(err);
    return errorRes(res, 'Failed to fetch vehicle types');
  }
});

router.post('/', allowRoles('Admin'), async (req, res) => {
  try {
    const { nama } = req.body;
    const type = await VehicleType.create({ nama });
    return successRes(res, 'Vehicle type created', type);
  } catch (err) {
    console.error(err);
    return errorRes(res, 'Failed to create vehicle type');
  }
});

router.put('/:id', allowRoles('Admin'), async (req, res) => {
  try {
    const type = await VehicleType.findByPk(req.params.id);
    if (!type) return errorRes(res, 'Vehicle type not found', 404);
    await type.update(req.body);
    return successRes(res, 'Vehicle type updated', type);
  } catch (err) {
    console.error(err);
    return errorRes(res, 'Failed to update vehicle type');
  }
});

router.delete('/:id', allowRoles('Admin'), async (req, res) => {
  try {
    const type = await VehicleType.findByPk(req.params.id);
    if (!type) return errorRes(res, 'Vehicle type not found', 404);
    await type.destroy();
    return successRes(res, 'Vehicle type deleted', {});
  } catch (err) {
    console.error(err);
    return errorRes(res, 'Failed to delete vehicle type');
  }
});

module.exports = router;