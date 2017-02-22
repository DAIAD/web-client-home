const callAPI = require('./base');

const MeterAPI = {
  getStatus: function (data) {
    return callAPI('/action/meter/status', data);
  },
  getHistory: function (data) {
    return callAPI('/action/meter/history', data);
  },
  getForecast: function (data) {
    return callAPI('/action/data/meter/forecast', data);
  },
};

module.exports = MeterAPI;

