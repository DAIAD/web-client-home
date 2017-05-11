module.exports = {
  color: [
    '#2D3580', '#a3d4f4', '#7AD3AB', '#CD4D3E', '#EBB7B1', '#ab77cf', '#ed7c30', '#ABAECC',
  ],
  symbol: ['emptyCircle', 'emptyRectangle', 'emptyTriangle', 'emptyDiamond', 'circle', 'rectangle', 'triangle', 'diamond'], 
  
  backgroundColor: '#fff',

  title: {
    textStyle: {
      fontSize: 15,
      fontWeight: 'normal',
      color: '#808285'
    }
  },

  dataRange: {
    color: ['#1178ad', '#72bbd0']
  },

  toolbox: {
    color: ['#1790cf', '#1790cf', '#1790cf', '#1790cf']
  },
  
  legend: {
    show: true,
    padding: 12,
    itemHeight: 10,
    itemGap: 6,
    itemWidth: 35,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 0,
    textStyle: {
      fontSize: 11,
      //fontFamily: 
        //'sans-serif',
        //'monospace', // needed only for vertical alignment
    },
    x: 'center',
    y: 0,
  },
 
  tooltip: {
    trigger: 'item',
    backgroundColor: '#2D3580',
    borderColor: '#2D3580',
    padding: 7,
    textStyle: {
      color: '#fff',
    },
    axisPointer: {
      type: 'line',
      lineStyle: {
        color: '#1790cf',
        type: 'dashed'
      },
      crossStyle: {
        color: '#1790cf'
      },
      shadowStyle: {
        color: 'rgba(200,200,200,0.3)'
      }
    }
  },

  dataZoom: {
    realtime: true,
    start: 0,
    end: 100,
    dataBackgroundColor: '#2D3580',
    fillerColor: 'rgba(0, 0, 0, 0.1)',
    handleColor: '#2D3580',
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
      show: true
    },
  },

  valueAxis: {
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
      show: false
    },
    areaStyle: {
      color: [
      ]
    },
    splitLine: {
      lineStyle: {
        color: ['#ccc'],
        width: 1,
        type: 'dotted solid double'
      }
    },
    splitArea: {
      show: true,
      areaStyle: {
        color: ['#fff']
      },
    },
    boundaryGap: [0, 0.1],
  },

  grid: {
    x: 75, 
    y: 0, 
    x2: 20, 
    y2: 30,
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
  },

  timeline: {
    lineStyle: {
      color: '#1790cf'
    },
    controlStyle: {
      normal: {
        color: '#1790cf'
      },
      emphasis: {
        color: '#1790cf'
      }
    }
  },

  k: {
    itemStyle: {
      normal: {
        color: '#1bb2d8',
        color0: '#99d2dd',
        lineStyle: {
          width: 1,
          color: '#1c7099',
          color0: '#88b0bb'
        }
      }
    }
  },

  map: {
    itemStyle: {
      normal: {
        areaStyle: {
          color: '#ddd'
        },
        label: {
          textStyle: {
            color: '#c12e34'
          }
        }
      },
      emphasis: {
        areaStyle: {
          color: '#99d2dd'
        },
        label: {
          textStyle: {
            color: '#c12e34'
          }
        }
      }
    }
  },
  
  bar: {
    barGap: '20%',
    barCategoryGap: '25%',
    itemStyle: {
      normal: {
        barBorderWidth: 0,
        barBorderRadius: 0,
        label: {
          position: 'right',
          textStyle: {
            fontSize: 11,
          },
        },
      },
      emphasis: {
      }
    }
  },

  force: {
    itemStyle: {
      normal: {
        linkStyle: {
          color: '#1790cf'
        }
      }
    }
  },

  chord: {
    padding: 4,
    itemStyle: {
      normal: {
        borderWidth: 1,
        borderColor: 'rgba(128, 128, 128, 0.5)',
        chordStyle: {
          lineStyle: {
            color: 'rgba(128, 128, 128, 0.5)'
          }
        }
      },
      emphasis: {
        borderWidth: 1,
        borderColor: 'rgba(128, 128, 128, 0.5)',
        chordStyle: {
          lineStyle: {
            color: 'rgba(128, 128, 128, 0.5)'
          }
        }
      }
    }
  },

  gauge: {
    axisLine: {
      show: true,
      lineStyle: {
        color: [
          [0.2, '#1bb2d8'],
          [0.8, '#1790cf'],
          [1, '#1c7099']
        ], 
        width: 8
      }
    },
    axisTick: {
      splitNumber: 10,
      length: 12,
      lineStyle: {
        color: 'auto'
      }
    },
    axisLabel: {
      textStyle: {
        color: 'auto'
      }
    },
    splitLine: {
      length: 18,
      lineStyle: {
        color: 'auto'
      }
    },
    pointer: {
      length: '90%',
      color: 'auto'
    },
    title: {
      textStyle: {
        color: '#333'
      }
    },
    detail: {
      textStyle: {
        color: 'auto'
      }
    }
  },

  textStyle: {
    fontFamily: 'Arial, Verdana, sans-serif'
  }
};

