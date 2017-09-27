'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var moment = require('moment');

var _require = require('../constants/HomeConstants'),
    STATIC_RECOMMENDATIONS = _require.STATIC_RECOMMENDATIONS,
    STATBOX_DISPLAYS = _require.STATBOX_DISPLAYS,
    PERIODS = _require.PERIODS,
    BASE64 = _require.BASE64,
    IMAGES = _require.IMAGES;

var _require2 = require('./general'),
    getFriendlyDuration = _require2.getFriendlyDuration,
    getEnergyClass = _require2.getEnergyClass,
    waterIQToNumeral = _require2.waterIQToNumeral,
    numeralToWaterIQ = _require2.numeralToWaterIQ,
    displayMetric = _require2.displayMetric,
    formatMetric = _require2.formatMetric,
    showerFilterToLength = _require2.showerFilterToLength;

var _require3 = require('./chart'),
    getChartMeterData = _require3.getChartMeterData,
    getChartAmphiroData = _require3.getChartAmphiroData,
    getChartMeterCategories = _require3.getChartMeterCategories,
    getChartMeterCategoryLabels = _require3.getChartMeterCategoryLabels,
    getChartAmphiroCategories = _require3.getChartAmphiroCategories,
    getChartPriceBrackets = _require3.getChartPriceBrackets,
    colorFormatterSingle = _require3.colorFormatterSingle;

var _require4 = require('./time'),
    getTimeByPeriod = _require4.getTimeByPeriod;

var _require5 = require('./device'),
    getDeviceTypeByKey = _require5.getDeviceTypeByKey,
    getDeviceNameByKey = _require5.getDeviceNameByKey,
    getDeviceKeysByType = _require5.getDeviceKeysByType;

var _require6 = require('./sessions'),
    reduceMetric = _require6.reduceMetric,
    getShowerById = _require6.getShowerById,
    getSessionsCount = _require6.getSessionsCount,
    prepareBreakdownSessions = _require6.prepareBreakdownSessions,
    preparePricingSessions = _require6.preparePricingSessions;

var _require7 = require('./messages'),
    stripTags = _require7.stripTags;

var tip = function tip(widget, intl) {
  var currTip = widget.tip;

  if (!currTip) {
    return _extends({}, widget, {
      highlight: {},
      info: [{
        text: intl.formatMessage({ id: 'widget.no-tips' })
      }],
      notificationType: 'RECOMMENDATION_STATIC',
      linkTo: 'notifications'
    });
  }
  var description = String(stripTags(currTip).description);
  var text = description;
  return _extends({}, widget, {
    highlight: {
      image: currTip.imageEncoded ? '' + BASE64 + currTip.imageEncoded : null
    },
    info: [{
      text: text
    }],
    notificationType: 'RECOMMENDATION_STATIC',
    notificationId: currTip.id,
    linkTo: 'notifications'
  });
};

var amphiroLastShower = function amphiroLastShower(widget, intl) {
  var _widget$data = widget.data,
      data = _widget$data === undefined ? [] : _widget$data,
      devices = widget.devices,
      device = widget.device,
      showerId = widget.showerId,
      _widget$metric = widget.metric,
      metric = _widget$metric === undefined ? 'volume' : _widget$metric,
      timestamp = widget.timestamp,
      unit = widget.unit;


  var lastSession = getShowerById(data.find(function (d) {
    return d.deviceKey === device;
  }), showerId);
  var measurements = lastSession ? lastSession.measurements : [];
  var chartCategories = Array.isArray(measurements) ? measurements.map(function (m) {
    return moment(m.timestamp).format('hh:mm:ss');
  }) : [];
  var chartData = [{
    name: getDeviceNameByKey(devices, device) || '',
    data: Array.isArray(measurements) ? measurements.map(function (m) {
      return m ? m[metric] : null;
    }) : []
  }];
  var chartFormatter = function chartFormatter(y) {
    return displayMetric(formatMetric(y, metric, unit));
  };
  return _extends({}, widget, {
    icon: IMAGES + '/shower.svg',
    more: intl.formatMessage({ id: 'widget.explore-last-shower' }),
    chartCategories: chartCategories,
    timeDisplay: intl.formatRelative(timestamp),
    chartData: chartData,
    chartFormatter: chartFormatter,
    highlight: {
      image: IMAGES + '/volume.svg',
      text: lastSession ? formatMetric(lastSession[metric], metric, unit) : null
    },
    info: lastSession ? [{
      image: IMAGES + '/energy.svg',
      text: displayMetric(formatMetric(lastSession.energy, 'energy', unit))
    }, {
      image: IMAGES + '/timer-on.svg',
      text: getFriendlyDuration(lastSession.duration)
    }, {
      image: IMAGES + '/temperature.svg',
      text: displayMetric(formatMetric(lastSession.temperature, 'temperature', unit))
    }] : [],
    mode: 'stats',
    clearComparisons: true
  });
};

var amphiroMembersRanking = function amphiroMembersRanking(widget, intl) {
  var devices = widget.devices,
      device = widget.device,
      _widget$metric2 = widget.metric,
      metric = _widget$metric2 === undefined ? 'volume' : _widget$metric2,
      _widget$data2 = widget.data,
      data = _widget$data2 === undefined ? [] : _widget$data2,
      unit = widget.unit;


  var periods = PERIODS.AMPHIRO;
  var membersData = data.map(function (m) {
    return _extends({}, m, {
      average: reduceMetric(m.sessions, metric, true),
      showers: m.sessions.reduce(function (p, c) {
        return p + c.sessions.length;
      }, 0)
    });
  }).filter(function (x) {
    return x.showers > 0;
  }).sort(function (a, b) {
    return a.average - b.average;
  }).filter(function (x, i) {
    return i < 5;
  });

  var chartCategories = membersData.map(function (m) {
    return m.name;
  });
  var chartData = [{
    name: intl.formatMessage({ id: 'widget.shower-average' }),
    data: membersData.map(function (x) {
      return x.average;
    })
  }];
  var chartColors = ['#7AD3AB', '#abaecc', '#2d3480', '#808285', '#CD4D3E'];

  var chartColorFormatter = colorFormatterSingle(chartColors);
  var chartFormatter = function chartFormatter(y) {
    return displayMetric(formatMetric(y, metric, unit));
  };

  return _extends({}, widget, {
    icon: IMAGES + '/goals.svg',
    more: intl.formatMessage({ id: 'widget.explore-comparisons' }),
    periods: periods,
    chartCategories: chartCategories,
    chartFormatter: chartFormatter,
    chartData: chartData,
    legend: false,
    chartColorFormatter: chartColorFormatter,
    chartType: 'bar',
    mode: 'stats',
    info: membersData.map(function (m, i) {
      return {
        image: IMAGES + '/rank-' + (i + 1) + '.svg'
      };
    }),
    data: null,
    memberFilter: membersData.length > 0 ? membersData[0].index : null,
    comparisons: membersData.filter(function (x, i) {
      return i > 0;
    }).map(function (x) {
      return String(x.index);
    })
  });
};

// TODO: split into two functions for amphiro / swm
var amphiroOrMeterTotal = function amphiroOrMeterTotal(widget, intl) {
  var _widget$data3 = widget.data,
      data = _widget$data3 === undefined ? [] : _widget$data3,
      period = widget.period,
      devices = widget.devices,
      deviceType = widget.deviceType,
      _widget$metric3 = widget.metric,
      metric = _widget$metric3 === undefined ? 'volume' : _widget$metric3,
      previous = widget.previous,
      unit = widget.unit;


  var time = widget.time ? widget.time : getTimeByPeriod(period);
  var device = getDeviceKeysByType(devices, deviceType);
  var periods = deviceType === 'AMPHIRO' ? PERIODS.AMPHIRO.filter(function (p) {
    return p.id !== 'all';
  }) : PERIODS.METER.filter(function (p) {
    return p.id !== 'custom' && p.id !== 'trimester';
  });

  var average = deviceType === 'AMPHIRO' && (metric === 'temperature' || metric === 'duration');
  var reduced = reduceMetric(data, metric, average);
  var previousReduced = reduceMetric(previous, metric, average);

  var better = reduced < previousReduced;
  var comparePercentage = previousReduced === 0 ? null : Math.round(Math.abs(reduced - previousReduced) / previousReduced * 100);

  var chartCategories = deviceType === 'AMPHIRO' ? getChartAmphiroCategories(period) : getChartMeterCategoryLabels(getChartMeterCategories(time), time.granularity, period, intl);

  var chartFormatter = function chartFormatter(y) {
    return displayMetric(formatMetric(y, metric, unit));
  };
  var chartData = Array.isArray(data) ? data.map(function (devData) {
    var sessions = devData.sessions.map(function (session) {
      return _extends({}, session, {
        duration: Math.round(100 * (session.duration / 60)) / 100,
        energy: Math.round(session.energy / 10) / 100
      });
    });

    return {
      name: deviceType === 'METER' ? intl.formatMessage({ id: 'devices.meter' }) : getDeviceNameByKey(devices, devData.deviceKey),
      data: deviceType === 'METER' ? getChartMeterData(sessions, getChartMeterCategories(time), time, metric) : getChartAmphiroData(sessions, getChartAmphiroCategories(period), metric)
    };
  }) : [];
  var hasComparison = better != null && comparePercentage != null;
  var str = better ? 'better' : 'worse';
  return _extends({}, widget, {
    icon: IMAGES + '/' + metric + '.svg',
    more: deviceType === 'AMPHIRO' ? intl.formatMessage({ id: 'widget.explore-showers' }) : intl.formatMessage({ id: 'widget.explore-swm' }),
    time: time,
    periods: periods,
    highlight: {
      text: formatMetric(reduced, metric, unit, reduced)
    },
    info: [{
      image: better ? IMAGES + '/better.svg' : IMAGES + '/worse.svg',
      text: intl.formatMessage({
        id: 'comparisons.' + str + '-' + deviceType
      }, {
        percent: comparePercentage,
        period: deviceType === 'AMPHIRO' ? showerFilterToLength(period) : intl.formatMessage({ id: 'comparisons.' + period })
      }),
      display: hasComparison
    }, {
      text: intl.formatMessage({ id: 'comparisons.no-data' }),
      display: !hasComparison
    }].filter(function (i) {
      return i.display;
    }),
    chartCategories: chartCategories,
    chartFormatter: chartFormatter,
    chartData: chartData,
    mode: 'stats',
    clearComparisons: true
  });
};

var amphiroEnergyEfficiency = function amphiroEnergyEfficiency(widget, intl) {
  var _widget$data4 = widget.data,
      data = _widget$data4 === undefined ? [] : _widget$data4,
      period = widget.period,
      devices = widget.devices,
      deviceType = widget.deviceType,
      previous = widget.previous;


  if (deviceType !== 'AMPHIRO') {
    console.error('only amphiro energy efficiency supported');
  }
  var metric = 'energy';

  var device = getDeviceKeysByType(devices, deviceType);
  var periods = PERIODS.AMPHIRO.filter(function (p) {
    return p.id !== 'all';
  });

  var reduced = reduceMetric(data, metric, true);
  var previousReduced = reduceMetric(previous, metric, true);

  var better = reduced < previousReduced;

  var comparePercentage = previousReduced === 0 ? null : Math.round(Math.abs(reduced - previousReduced) / previousReduced * 100);

  var showers = getSessionsCount(data);
  var highlight = showers === 0 || reduced === 0 ? null : getEnergyClass(reduced / showers);
  var hasComparison = better != null && comparePercentage != null;
  var str = better ? 'better' : 'worse';
  return _extends({}, widget, {
    icon: IMAGES + '/energy.svg',
    periods: periods,
    highlight: {
      text: highlight
    },
    info: [{
      image: better ? IMAGES + '/better.svg' : IMAGES + '/worse.svg',
      text: intl.formatMessage({
        id: 'comparisons.' + str + '-' + deviceType
      }, {
        percent: comparePercentage,
        period: showerFilterToLength(period)
      }),
      display: hasComparison
    }, {
      text: intl.formatMessage({ id: 'comparisons.no-data' }),
      display: !hasComparison
    }].filter(function (i) {
      return i.display;
    }),
    mode: 'stats',
    clearComparisons: true
  });
};

var meterForecast = function meterForecast(widget, intl) {
  var _widget$data5 = widget.data,
      data = _widget$data5 === undefined ? [] : _widget$data5,
      forecastData = widget.forecastData,
      period = widget.period,
      periodIndex = widget.periodIndex,
      deviceType = widget.deviceType,
      _widget$metric4 = widget.metric,
      metric = _widget$metric4 === undefined ? 'volume' : _widget$metric4,
      previous = widget.previous,
      unit = widget.unit;


  if (deviceType !== 'METER') {
    console.error('only meter forecast supported');
  }
  var time = widget.time || getTimeByPeriod(period, periodIndex);
  var forecastTime = widget.forecastTime || time;

  var periods = [];

  var chartColors = ['#2d3480', '#abaecc', '#7AD3AB', '#CD4D3E'];

  var xCategories = getChartMeterCategories(forecastTime);
  var xCategoryLabels = getChartMeterCategoryLabels(xCategories, forecastTime.granularity, period, intl);

  var chartFormatter = function chartFormatter(y) {
    return displayMetric(formatMetric(y, metric, unit));
  };
  var chartData = data.map(function (devData) {
    return {
      name: intl.formatMessage({ id: 'widget.consumption' }),
      data: getChartMeterData(devData.sessions, xCategories, forecastTime, metric)
    };
  });

  var forecastChartData = Array.isArray(forecastData) ? [{
    name: intl.formatMessage({ id: 'history.forecast' }),
    data: getChartMeterData(forecastData, xCategories, forecastTime, metric),
    lineType: 'dashed',
    color: '#2d3480',
    fill: 0,
    symbol: 'emptyRectangle'
  }] : [];

  return _extends({}, widget, {
    chartType: 'line',
    timeDisplay: moment(time.startDate).year(),
    time: time,
    periods: periods,
    chartCategories: xCategoryLabels,
    chartFormatter: chartFormatter,
    chartData: [].concat(_toConsumableArray(chartData), forecastChartData),
    mode: 'forecasting',
    clearComparisons: true
  });
};

var meterPricing = function meterPricing(widget, intl) {
  var _widget$data6 = widget.data,
      data = _widget$data6 === undefined ? [] : _widget$data6,
      period = widget.period,
      deviceType = widget.deviceType,
      brackets = widget.brackets,
      unit = widget.unit;


  if (deviceType !== 'METER') {
    console.error('only meter pricing supported');
  }
  var metric = 'total';
  var time = widget.time ? widget.time : getTimeByPeriod(period);
  var periods = [];

  var meterSessions = Array.isArray(data) && data.length === 1 ? data[0].sessions : [];
  var sessions = preparePricingSessions(meterSessions, brackets, time.granularity, null, intl);

  var xCategories = getChartMeterCategories(time);
  var xCategoryLabels = getChartMeterCategoryLabels(xCategories, time.granularity, period, intl);

  var priceBrackets = getChartPriceBrackets(xCategories, brackets, unit, intl);

  var chartFormatter = function chartFormatter(y) {
    return displayMetric(formatMetric(y, metric, unit, Math.max.apply(Math, _toConsumableArray(brackets.map(function (x) {
      return x.minVolume;
    })))));
  };

  var chartData = data.map(function (devData) {
    return {
      name: intl.formatMessage({ id: 'history.' + metric }),
      data: getChartMeterData(sessions, xCategories, time, metric)
    };
  });

  return _extends({}, widget, {
    icon: IMAGES + '/money-navy.svg',
    chartType: 'line',
    timeDisplay: intl.formatDate(time.startDate, { month: 'long' }) + ' - ' + intl.formatDate(time.endDate, { month: 'long' }),
    time: time,
    periods: periods,
    chartCategories: xCategoryLabels,
    chartFormatter: chartFormatter,
    chartData: [].concat(_toConsumableArray(chartData), _toConsumableArray(priceBrackets)),
    mode: 'pricing',
    clearComparisons: true
  });
};

var meterBreakdown = function meterBreakdown(widget, intl) {
  var _widget$data7 = widget.data,
      data = _widget$data7 === undefined ? [] : _widget$data7,
      period = widget.period,
      devices = widget.devices,
      deviceType = widget.deviceType,
      _widget$metric5 = widget.metric,
      metric = _widget$metric5 === undefined ? 'volume' : _widget$metric5,
      _widget$breakdown = widget.breakdown,
      breakdown = _widget$breakdown === undefined ? [] : _widget$breakdown,
      unit = widget.unit;


  if (deviceType !== 'METER') {
    console.error('only meter breakdown makes sense');
  }

  var periods = PERIODS.METER.filter(function (p) {
    return p.id === 'month' || p.id === 'year';
  });

  var reduced = reduceMetric(data, metric);

  var time = widget.time ? widget.time : getTimeByPeriod(period);

  var sessions = prepareBreakdownSessions(data, metric, breakdown, null, time.startDate, time.granularity, intl);

  var chartData = [{
    name: intl.formatMessage({ id: 'history.' + metric }),
    data: sessions.map(function (x) {
      return x[metric];
    })
  }];

  var chartColors = ['#abaecc', '#8185b2', '#575d99', '#2d3480'];
  var chartColorFormatter = colorFormatterSingle(chartColors);

  var chartFormatter = function chartFormatter(y) {
    return displayMetric(formatMetric(y, metric, unit, Math.max.apply(Math, _toConsumableArray(chartData.length > 0 && chartData[0].data || []))));
  };

  var chartCategories = sessions.map(function (x) {
    return intl.formatMessage({ id: 'breakdown.' + x.id }).split(' ').join('\n');
  });

  return _extends({}, widget, {
    icon: IMAGES + '/stats-side.svg',
    time: time,
    periods: periods,
    chartType: 'horizontal-bar',
    chartCategories: chartCategories,
    chartColorFormatter: chartColorFormatter,
    chartFormatter: chartFormatter,
    chartData: chartData,
    clearComparisons: true,
    mode: 'stats'
  });
};

var meterComparison = function meterComparison(widget, intl) {
  var data = widget.data,
      period = widget.period,
      periodIndex = widget.periodIndex,
      deviceType = widget.deviceType,
      _widget$metric6 = widget.metric,
      metric = _widget$metric6 === undefined ? 'volume' : _widget$metric6,
      comparisons = widget.comparisons,
      unit = widget.unit;


  if (deviceType !== 'METER') {
    console.error('only meter comparison supported');
    return {};
  }

  var time = widget.time ? widget.time : getTimeByPeriod(period, periodIndex);
  var periods = [];
  var chartColors = ['#f5dbd8', '#ebb7b1', '#a3d4f4', '#2d3480'];
  var chartColorFormatter = colorFormatterSingle(chartColors);

  var chartCategories = Array.isArray(comparisons) ? comparisons.map(function (comparison) {
    return intl.formatMessage({ id: 'comparisons.' + comparison.id });
  }) : [];

  var chartData = [{
    name: 'Comparison',
    data: Array.isArray(comparisons) ? comparisons.map(function (comparison) {
      return comparison.sessions.reduce(function (p, c) {
        return c ? p + c[metric] : p;
      }, 0);
    }) : []
  }];

  var chartFormatter = function chartFormatter(y) {
    return displayMetric(formatMetric(y, metric, unit, Math.max.apply(Math, _toConsumableArray(chartData.length > 0 && chartData[0].data || []))));
  };

  return _extends({}, widget, {
    icon: IMAGES + '/stats-side.svg',
    timeDisplay: intl.formatDate(time.startDate, { month: 'long' }),
    time: time,
    periods: periods,
    chartType: 'horizontal-bar',
    chartCategories: chartCategories,
    chartColorFormatter: chartColorFormatter,
    chartFormatter: chartFormatter,
    chartData: chartData,
    mode: 'stats',
    comparisonData: Array.isArray(comparisons) ? comparisons.filter(function (c) {
      return c.id !== 'user';
    }) : []
  });
};

var waterIQ = function waterIQ(widget, intl) {
  var data = widget.data,
      period = widget.period,
      periodIndex = widget.periodIndex,
      deviceType = widget.deviceType,
      _widget$metric7 = widget.metric,
      metric = _widget$metric7 === undefined ? 'volume' : _widget$metric7;


  if (deviceType !== 'METER') {
    console.error('only meter supported for water iq');
    return {};
  }

  var time = widget.time ? widget.time : getTimeByPeriod(period, periodIndex);
  var periods = [];

  var current = Array.isArray(data) && data.length > 0 && data.find(function (s) {
    return s.timestamp === time.startDate;
  });

  var hasWaterIQ = current !== false && current != null;

  var best = hasWaterIQ ? data.reduce(function (p, c) {
    return c.user < p.user ? c : p;
  }, data[0]) : {};
  var worst = hasWaterIQ ? data.reduce(function (p, c) {
    return c.user > p.user ? c : p;
  }, data[0]) : {};

  var highlight = hasWaterIQ ? null : '-';
  var highlightImg = hasWaterIQ ? IMAGES + '/energy-' + current.user + '.svg' : null;

  var chartColors = ['#f5dbd8', '#ebb7b1', '#a3d4f4', '#2d3480'];
  var chartColorFormatter = colorFormatterSingle(chartColors);
  var comparisons = ['similar', 'nearest', 'all', 'user'];
  var chartCategories = Array.isArray(comparisons) ? comparisons.map(function (comparison) {
    return intl.formatMessage({ id: 'comparisons.' + comparison });
  }) : [];

  var chartData = [{
    name: intl.formatMessage({ id: 'history.wateriq' }),
    data: Array.isArray(comparisons) ? comparisons.map(function (comparison) {
      return current ? waterIQToNumeral(current[comparison]) : null;
    }) : []
  }];
  return _extends({}, widget, {
    icon: IMAGES + '/default-ranking.svg',
    timeDisplay: intl.formatDate(time.startDate, { month: 'long' }),
    display: hasWaterIQ ? widget.display : 'stat',
    //time,
    periods: periods,
    info: [{
      image: IMAGES + '/better.svg',
      text: intl.formatMessage({
        id: 'comparisons.wateriq-best'
      }, {
        value: best.user,
        month: intl.formatDate(best.timestamp, { month: 'long' })
      }),
      display: hasWaterIQ
    }, {
      image: IMAGES + '/worse.svg',
      text: intl.formatMessage({
        id: 'comparisons.wateriq-worst'
      }, {
        value: worst.user,
        month: intl.formatDate(worst.timestamp, { month: 'long' })
      }),
      display: hasWaterIQ && worst.user !== best.user
    }, {
      text: intl.formatMessage({ id: 'comparisons.wateriq-no-data' }),
      display: !hasWaterIQ
    }].filter(function (i) {
      return i.display;
    }),
    chartType: 'horizontal-bar',
    chartColorFormatter: chartColorFormatter,
    chartCategories: chartCategories,
    chartData: chartData,
    chartFormatter: function chartFormatter(y) {
      return numeralToWaterIQ(y);
    },
    highlight: {
      text: highlight,
      image: highlightImg
    },
    mode: 'wateriq',
    period: 'year',
    comparisonData: widget.display === 'chart' ? comparisons.map(function (c) {
      return { id: c, sessions: [] };
    }) : [],
    time: getTimeByPeriod('year')
  });
};

var budget = function budget(widget, intl) {
  var data = widget.data,
      period = widget.period,
      devices = widget.devices,
      deviceType = widget.deviceType,
      metric = widget.metric,
      previous = widget.previous;


  if (deviceType !== 'METER') {
    console.error('only meter comparison supported');
  }

  var periods = PERIODS.METER.filter(function (p) {
    return p.id !== 'custom';
  });
  var reduced = reduceMetric(data, metric);

  // dummy data based on real user data
  // TODO: static
  var consumed = reduced;

  var remaining = Math.round(reduced * 0.35);
  var percent = Math.round(consumed / (consumed + remaining) * 100) + '%';
  //percent = isNaN(percent) ? '' : `${percent}%`;

  var chartData = [{
    name: percent,
    data: [{
      value: consumed,
      name: 'consumed',
      color: '#2D3580'
    }, {
      value: remaining,
      name: 'remaining',
      color: '#D0EAFA'
    }]
  }];

  var chartColors = ['#2d3480', '#abaecc'];
  return _extends({}, widget, {
    highlight: {
      text: reduced
    },
    chartData: chartData,
    chartColors: chartColors
  });
};

var meterCommon = function meterCommon(widget, intl) {
  var _widget$data8 = widget.data,
      data = _widget$data8 === undefined ? [] : _widget$data8,
      period = widget.period,
      devices = widget.devices,
      deviceType = widget.deviceType,
      _widget$metric8 = widget.metric,
      metric = _widget$metric8 === undefined ? 'volume' : _widget$metric8,
      common = widget.common,
      commonData = widget.commonData,
      unit = widget.unit;


  if (!common) {
    return _extends({}, widget, {
      error: intl.formatMessage({ id: 'widget.empty-or-no-fav-common' })
    });
  }
  var time = widget.time ? widget.time : getTimeByPeriod(period);
  var periods = PERIODS.METER.filter(function (p) {
    return p.id !== 'custom' && p.id !== 'day';
  });

  var reduced = reduceMetric(data, metric);

  var xCategories = getChartMeterCategories(time);
  var chartCategories = getChartMeterCategoryLabels(xCategories, time.granularity, period, intl);
  var chartFormatter = function chartFormatter(y) {
    return displayMetric(formatMetric(y, metric, unit));
  };

  var chartData = data.map(function (devData) {
    return {
      name: intl.formatMessage({ id: 'common.me' }),
      data: getChartMeterData(devData.sessions, xCategories, time, metric)
    };
  });

  var commonChartData = Array.isArray(commonData) ? [{
    name: common.name,
    data: getChartMeterData(commonData, xCategories, time, metric),
    fill: 0,
    symbol: 'emptyRectangle'
  }] : [];

  return _extends({}, widget, {
    icon: common.image ? '' + BASE64 + common.image : null,
    more: intl.formatMessage({ id: 'widget.explore-common' }),
    chartType: 'line',
    time: time,
    periods: periods,
    chartCategories: chartCategories,
    chartFormatter: chartFormatter,
    chartData: [].concat(_toConsumableArray(chartData), commonChartData),
    linkTo: 'commons'
  });
};

var prepareWidget = function prepareWidget(widget, intl) {
  switch (widget.type) {
    case 'tip':
      return tip(widget, intl);
    case 'last':
      return amphiroLastShower(widget, intl);
    case 'ranking':
      return amphiroMembersRanking(widget, intl);
    case 'total':
      return amphiroOrMeterTotal(widget, intl);
    case 'efficiency':
      return amphiroEnergyEfficiency(widget, intl);
    case 'forecast':
      return meterForecast(widget, intl);
    case 'pricing':
      return meterPricing(widget, intl);
    case 'breakdown':
      return meterBreakdown(widget, intl);
    case 'comparison':
      return meterComparison(widget, intl);
    case 'budget':
      return budget(widget, intl);
    case 'wateriq':
      return waterIQ(widget, intl);
    case 'commons':
      return meterCommon(widget, intl);
    default:
      return widget;
  }
};

module.exports = prepareWidget;