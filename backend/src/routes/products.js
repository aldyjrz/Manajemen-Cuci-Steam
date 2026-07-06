const express = require('express');
const { Product } = require('../models');
const authJWT = require('../middleware/authJWT');
const { allowRoles } = require('../middleware/roles');
const { successRes, errorRes } = require('../utils/response');

const router = express.Router();
router.use(authJWT);

router.get('/', allowRoles('Admin','Kasir','Karyawan'), async (req, res) => {
  try {
    const products = await Product.findAll({ order: [['id', 'ASC']] });
    return successRes(res, 'Products fetched', products);
  } catch (err) {
    console.error(err);
    return errorRes(res, 'Failed to fetch products');
  }
});

router.post('/', allowRoles('Admin'), async (req, res) => {
  try {
    const { nama_produk, harga, komisi, estimasi_waktu, aktif } = req.body;
    const product = await Product.create({ nama_produk, harga, komisi, estimasi_waktu, aktif: aktif ?? true });
    return successRes(res, 'Product created', product);
  } catch (err) {
    console.error(err);
    return errorRes(res, 'Failed to create product');
  }
});

router.put('/:id', allowRoles('Admin'), async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return errorRes(res, 'Product not found', 404);
    await product.update(req.body);
    return successRes(res, 'Product updated', product);
  } catch (err) {
    console.error(err);
    return errorRes(res, 'Failed to update product');
  }
});

router.delete('/:id', allowRoles('Admin'), async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return errorRes(res, 'Product not found', 404);
    await product.destroy();
    return successRes(res, 'Product deleted', {});
  } catch (err) {
    console.error(err);
    return errorRes(res, 'Failed to delete product');
  }
});

module.exports = router;