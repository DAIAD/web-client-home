const callAPI = require('./base');

const ShowersAPI = {
  assignToMember: function (data) {
    return callAPI('/action/data/session/member', data);
  },
  ignoreShower: function (data) {
    return callAPI('/action/data/session/ignore', data);
  },
  setShowerReal: function (data) {
    return callAPI('/action/data/session/date', data);
  },
};

module.exports = ShowersAPI;
