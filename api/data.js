const callAPI = require('./base');

const DataAPI = {
  query: function (data) {
    return callAPI('/action/query', data);
  },
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

module.exports = DataAPI;

