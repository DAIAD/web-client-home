const callAPI = require('./base');

const MessagesAPI = {
  fetch: function (data) {
    return callAPI('/action/message', data);
  },
  acknowledge: function (data) {
    return callAPI('/action/message/acknowledge', data);
  }
};

module.exports = MessagesAPI;

