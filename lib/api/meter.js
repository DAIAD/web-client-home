'use strict';

var callAPI = require('./base');

var MeterAPI = {
  getStatus: function getStatus(data) {
    return callAPI('/action/meter/status', data);
  },
  getHistory: function getHistory(data) {
    return callAPI('/action/meter/history', data);
  }
};

module.exports = MeterAPI;