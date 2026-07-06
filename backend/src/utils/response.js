const successRes = (res, message = 'Success', data = {}) => {
  return res.json({ success: true, message, data });
};

const errorRes = (res, message = 'Error', status = 500, errors = []) => {
  return res.status(status).json({ success: false, message, errors });
};

module.exports = { successRes, errorRes };
