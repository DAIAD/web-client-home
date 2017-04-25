'use strict';

var callAPI = require('./base');

var MessagesAPI = {
  fetch: function fetch(data) {
    return callAPI('/action/message', data);
  },
  acknowledge: function acknowledge(data) {
    return callAPI('/action/message/acknowledge', data);
  }
};

module.exports = MessagesAPI;