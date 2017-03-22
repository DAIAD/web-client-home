const callAPI = require('./base');

const WaterCalculatorAPI = {
  getWaterBreakdown: function ({ csrf }) {
    return callAPI('/action/water-calculator/water-breakdown', { csrf }, 'GET');
  },
};

module.exports = WaterCalculatorAPI;

