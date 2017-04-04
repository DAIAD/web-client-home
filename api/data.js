const callAPI = require('./base');

const DataAPI = {
  query: function (data) {
    return callAPI('/action/query', data);
  },
  getComparisons: function ({ csrf, month, year }) {
    return callAPI(`/action/comparison/${year}/${month}`, { csrf }, 'GET');
  }, 
};

module.exports = DataAPI;

