const callAPI = require('./base');

const DataAPI = {
  query: function (data) {
    return callAPI('/action/query', data);
  },
  assignToMember: function (data) {
    // TODO: not yet implemented
    //return callAPI('/action/data/session/member', data);
    return Promise.reject('Not yet implemented');
  },
  ignoreShower: function (data) {
    // TODO: not yet implemented
    //return callAPI('/action/data/session/ignore');
    return Promise.reject('Not yet implemented');
  },
  getComparisons: function ({ csrf, month, year }) {
    return callAPI(`/action/comparison/${year}/${month}`, { csrf }, 'GET');
  },
};

module.exports = DataAPI;

