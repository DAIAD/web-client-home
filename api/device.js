const callAPI = require('./base');

const DeviceAPI = {
  querySessions: function (data) {
    return callAPI('/action/device/index/session/query', data);
  },
  getSession: function (data) {
    return callAPI('/action/device/index/session', data);
  }
};

module.exports = DeviceAPI;

