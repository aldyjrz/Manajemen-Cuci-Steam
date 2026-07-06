const bcrypt = require('bcrypt');
const { User } = require('../models');
const { successRes, errorRes } = require('../utils/response');

const listUsers = async (req, res) => {
  try {
    const users = await User.findAll({ order: [['id', 'ASC']] });
    return successRes(res, 'Users fetched', users);
  } catch (err) {
    console.error(err);
    return errorRes(res, 'Failed to fetch users');
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return errorRes(res, 'User not found', 404);
    return successRes(res, 'User fetched', user);
  } catch (err) {
    console.error(err);
    return errorRes(res, 'Failed to fetch user');
  }
};

const createUser = async (req, res) => {
  try {
    const { nama, username, password, role, no_hp, alamat, aktif } = req.body;
    if (!nama || !username || !password || !role) return errorRes(res, 'Missing required fields', 400);

    const exists = await User.findOne({ where: { username } });
    if (exists) return errorRes(res, 'Username already exists', 400);

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ nama, username, password: hashedPassword, role, no_hp, alamat, aktif: aktif ?? true });

    return successRes(res, 'User created', user);
  } catch (err) {
    console.error(err);
    return errorRes(res, 'Failed to create user');
  }
};

const updateUser = async (req, res) => {
  try {
    const { nama, username, password, role, no_hp, alamat, aktif } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return errorRes(res, 'User not found', 404);

    if (username && username !== user.username) {
      const exists = await User.findOne({ where: { username } });
      if (exists) return errorRes(res, 'Username already exists', 400);
    }

    const updates = { nama, username, role, no_hp, alamat, aktif };
    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    await user.update(Object.fromEntries(Object.entries(updates).filter(([_, val]) => val !== undefined)));
    return successRes(res, 'User updated', user);
  } catch (err) {
    console.error(err);
    return errorRes(res, 'Failed to update user');
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return errorRes(res, 'User not found', 404);
    await user.destroy();
    return successRes(res, 'User deleted', {});
  } catch (err) {
    console.error(err);
    return errorRes(res, 'Failed to delete user');
  }
};

module.exports = { listUsers, getUser, createUser, updateUser, deleteUser };