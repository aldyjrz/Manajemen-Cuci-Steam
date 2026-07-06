const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { successRes, errorRes } = require('../utils/response');

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return errorRes(res, 'Username and password required', 400);

    const user = await User.findOne({ where: { username } });
    if (!user) return errorRes(res, 'Invalid credentials', 401);

    const match = await bcrypt.compare(password, user.password);
    if (!match) return errorRes(res, 'Invalid credentials', 401);

    const payload = { id: user.id, role: user.role };
    const secret = process.env.JWT_SECRET || 'change_this_secret';
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

    const token = jwt.sign(payload, secret, { expiresIn });

    const expired_at = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString();

    return successRes(res, 'Login success', {
      token,
      user: {
        id: user.id,
        nama: user.nama,
        username: user.username,
        role: user.role,
      },
      role: user.role,
      expired_at,
    });
  } catch (err) {
    console.error(err);
    return errorRes(res, 'Server error');
  }
};

module.exports = { login };
