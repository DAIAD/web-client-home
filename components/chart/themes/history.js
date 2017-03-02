const defaultStyle = require('./default');

module.exports = {
  ...defaultStyle,

  bar: {
    barGap: 0,
    barCategoryGap: 30,
    itemStyle: {
      normal: {
        barBorderWidth: 0,
        barBorderRadius: 0,
        lineStyle: {
          width: 1
        },
        label: {
          position: 'right',
          formatter: '{b}',
          textStyle: {
            fontSize: 12,
            fontStyle: 'bold',
            color: '#2D3580',
          },
        },
        textStyle: {
          color: '#666',
        },
        areaStyle: {
          color: 'rgba(232, 232, 237, 0.7)',
          type: 'default',
        },
      },
      emphasis: {
      }
    }
  },

  line: {
    itemStyle: {
      normal: {
        lineStyle: {
          width: 18,
          type: 'solid',
        },
      },
      emphasis: {
      }
    },
    smooth: true,
    symbol: 'emptyCircle',
    symbolSize: 6,
    showAllSymbol: true,
  },
  grid: {
    x: 70,
    x2: 10,
    y: 0,
    y2: 30,
  },
  
  valueAxis: {
    show: true,
    axisLabel: {
      textStyle: {
        //fontFamily: "OpenSansCondensed",
        color: '#808285',
        fontSize: 13,
      },
      margin: 20
    },
    axisLine: {
      show: true,
    },
    axisTick: {
      show: false,
    },
    areaStyle: {
      color: [
      ]
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: ['#ccc'],
        width: 1,
        type: 'dotted solid double'
      }
    },
    splitArea: {
      show: true,
      areaStyle: {
        color: []
      },
    },
    boundaryGap: [0, 0.1],
  },
  
  categoryAxis: {
    axisLabel: {
      textStyle: {
        //fontFamily: "OpenSansCondensed",
        color: '#808285',
        fontSize: 13
      },
      margin: 12
    },
    splitLine: {
      show: false
    },
    axisLine: {
      show: true,
    },
    axisTick: {
      show: false,
      length: 0,
    },
    boundaryGap: [10, 10],
  }, 
};

