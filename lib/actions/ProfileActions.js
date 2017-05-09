'use strict';

var types = require('../constants/ActionTypes');

var setChangePassword = function setChangePassword() {
  return {
    type: types.SETTINGS_SET_CHANGE_PASSWORD,
    enable: true
  };
};

var resetChangePassword = function resetChangePassword() {
  return {
    type: types.SETTINGS_SET_CHANGE_PASSWORD,
    enable: false
  };
};

module.exports = {
  setChangePassword: setChangePassword,
  resetChangePassword: resetChangePassword
};