'use strict';

var callAPI = require('./base');

var DeviceAPI = {
  querySessions: function querySessions(data) {
    return callAPI('/action/device/index/session/query', data);
  },
  getSession: function getSession(data) {
    return callAPI('/action/device/index/session', data);
  },
  updateDevice: function updateDevice(data) {
    return callAPI('/action/device/update', data);
  }
};

module.exports = DeviceAPI;