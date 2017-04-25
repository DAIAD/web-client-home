'use strict';

var callAPI = require('./base');

var ReportsAPI = {
  status: function status(_ref) {
    var year = _ref.year,
        csrf = _ref.csrf;

    return callAPI('/action/report/status/' + year, { csrf: csrf }, 'GET');
  }
};

module.exports = ReportsAPI;