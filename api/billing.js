const callAPI = require('./base');

const BillingAPI = {
  getPriceBrackets: function ({ csrf }) {
    return callAPI('/action/billing/price-bracket', { csrf }, 'GET');
  },
};

module.exports = BillingAPI;

