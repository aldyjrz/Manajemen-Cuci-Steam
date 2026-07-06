const { Setting } = require('../models');
const { successRes, errorRes } = require('../utils/response');

const getSettings = async (req, res) => {
  try {
    const setting = await Setting.findOne();
    return successRes(res, 'Settings fetched', setting || {});
  } catch (err) {
    console.error(err);
    return errorRes(res, 'Failed to fetch settings');
  }
};

const updateSettings = async (req, res) => {
  try {
    const { nama_steam, logo, alamat, no_hp, footer } = req.body;
    let setting = await Setting.findOne();
    if (!setting) {
      setting = await Setting.create({ nama_steam, logo, alamat, no_hp, footer });
    } else {
      await setting.update({ nama_steam, logo, alamat, no_hp, footer });
    }
    return successRes(res, 'Settings updated', setting);
  } catch (err) {
    console.error(err);
    return errorRes(res, 'Failed to update settings');
  }
};

module.exports = { getSettings, updateSettings };