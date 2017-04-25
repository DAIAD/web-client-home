const callAPI = require('./base');

const ReportsAPI = {
  status: function ({ year, csrf }) {
    return callAPI(`/action/report/status/${year}`, { csrf }, 'GET');
  },
};

module.exports = ReportsAPI;

