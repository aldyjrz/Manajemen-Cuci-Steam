const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'Admin') {
    return res.status(403).json({ success: false, message: 'Forbidden, admin only' });
  }
  next();
};

const isKasir = (req, res, next) => {
  if (req.user?.role !== 'Kasir') {
    return res.status(403).json({ success: false, message: 'Forbidden, kasir only' });
  }
  next();
};

const isKaryawan = (req, res, next) => {
  if (req.user?.role !== 'Karyawan') {
    return res.status(403).json({ success: false, message: 'Forbidden, karyawan only' });
  }
  next();
};

const allowRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  next();
};

module.exports = { isAdmin, isKasir, isKaryawan, allowRoles };
