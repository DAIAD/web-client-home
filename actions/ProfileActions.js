const types = require('../constants/ActionTypes');

const setChangePassword = function () {
  return {
    type: types.SETTINGS_SET_CHANGE_PASSWORD,
    enable: true,
  };
};

const resetChangePassword = function () {
  return {
    type: types.SETTINGS_SET_CHANGE_PASSWORD,
    enable: false,
  };
};

module.exports = {
  setChangePassword,
  resetChangePassword,
};
