const defaultStyle = require('./default');

module.exports = {
  ...defaultStyle,

  bar: {
    barGap: 0,
    barCategoryGap: 0,
    itemStyle: {
      normal: {
        barBorderWidth: 0,
        barBorderRadius: 0,
        lineStyle: {
          width: 1
        },
        label: {
          position: 'top',
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
  
  legend: {
    show: false,
  },


  grid: {
    x: 80,
    x2: 40,
    y: -30,
    y2: 10,
  },

  tooltip: {
    show: false,
  },

  valueAxis: {
    show: false,
    axisLabel: {
      textStyle: {
        //fontFamily: "OpenSansCondensed",
        color: '#808285',
        fontSize: 13,
      },
      margin: 20
    },
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    areaStyle: {
      color: [
      ]
    },
    splitLine: {
      show: false,
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
      margin: 14
    },
    splitLine: {
      show: false,
    },
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
      length: 0,
    },
  },

};

