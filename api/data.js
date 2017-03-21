const callAPI = require('./base');

const DataAPI = {
  query: function (data) {
    return callAPI('/action/query', data);
  },
  getComparisons: function ({ csrf, month, year }) {
    return callAPI(`/action/comparison/${year}/${month}`, { csrf }, 'GET');
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

