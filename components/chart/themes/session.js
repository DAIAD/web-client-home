const defaultStyle = require('./default');

module.exports = {
  ...defaultStyle,

  legend: {
    show: false,
  },

  line: {
    itemStyle: {
      normal: {
        borderWidth: 2,
        lineStyle: {
          width: 1,
          type: 'solid',
        },
        label: {
          show: false
        },
        textStyle: {
          color: '#666',
        },
      },
      emphasis: {
        borderWidth: 1,
      }
    },
    smooth: true,
    symbol: 'emptyCircle',
    showAllSymbol: true,
    symbolSize: 7,
  },

  grid: {
    x: 85,
    x2: 20, 
    y: -40,
    y2: 30,
  },
};

