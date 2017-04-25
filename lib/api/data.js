'use strict';

var callAPI = require('./base');

var DataAPI = {
  query: function query(data) {
    return callAPI('/action/query', data);
  },
  getForecast: function getForecast(data) {
    return callAPI('/action/data/meter/forecast', data);
  },
  getComparisons: function getComparisons(_ref) {
    var csrf = _ref.csrf,
        month = _ref.month,
        year = _ref.year;

    return callAPI('/action/comparison/' + year + '/' + month, { csrf: csrf }, 'GET');
  },
  getWaterBreakdown: function getWaterBreakdown(_ref2) {
    var csrf = _ref2.csrf;

    return callAPI('/action/water-calculator/water-breakdown', { csrf: csrf }, 'GET');
  },
  getPriceBrackets: function getPriceBrackets(_ref3) {
    var csrf = _ref3.csrf;

    return callAPI('/action/billing/price-bracket', { csrf: csrf }, 'GET');
  }
};

module.exports = DataAPI;