const express = require('express');
const { listUsers, getUser, createUser, updateUser, deleteUser } = require('../controllers/userController');
const authJWT = require('../middleware/authJWT');
const { isAdmin } = require('../middleware/roles');

const router = express.Router();

router.use(authJWT, isAdmin);
router.get('/', listUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;