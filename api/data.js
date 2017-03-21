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
  getComparisons: function ({ csrf, month, year }) {
    return callAPI(`/action/comparison/${year}/${month}`, { csrf }, 'GET');
  },
};

module.exports = DataAPI;

