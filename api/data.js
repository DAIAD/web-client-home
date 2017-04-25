const callAPI = require('./base');

const DataAPI = {
  query: function (data) {
    return callAPI('/action/query', data);
  },
  getForecast: function (data) {
    return callAPI('/action/data/meter/forecast', data);
  },
  getComparisons: function ({ csrf, month, year }) {
    return callAPI(`/action/comparison/${year}/${month}`, { csrf }, 'GET');
  }, 
  getWaterBreakdown: function ({ csrf }) {
    return callAPI('/action/water-calculator/water-breakdown', { csrf }, 'GET');
  },
  getPriceBrackets: function ({ csrf }) {
    return callAPI('/action/billing/price-bracket', { csrf }, 'GET');
  },
};

module.exports = DataAPI;

