'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var defaultStyle = require('./default');

module.exports = _extends({}, defaultStyle, {

  legend: {
    show: false
  },

  line: {
    itemStyle: {
      normal: {
        borderWidth: 2,
        lineStyle: {
          width: 1,
          type: 'solid'
        },
        label: {
          show: false
        },
        textStyle: {
          color: '#666'
        }
      },
      emphasis: {
        borderWidth: 1
      }
    },
    smooth: true,
    symbol: 'emptyCircle',
    showAllSymbol: true,
    symbolSize: 7
  },

  grid: {
    x: 85,
    x2: 20,
    y: -40,
    y2: 30
  }
});