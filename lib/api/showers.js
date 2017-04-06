'use strict';

var callAPI = require('./base');

var ShowersAPI = {
  assignToMember: function assignToMember(data) {
    return callAPI('/action/data/session/member', data);
  },
  ignoreShower: function ignoreShower(data) {
    return callAPI('/action/data/session/ignore', data);
  },
  setShowerReal: function setShowerReal(data) {
    return callAPI('/action/data/session/date', data);
  }
};

module.exports = ShowersAPI;