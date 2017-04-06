'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var moment = require('moment');

var _require = require('../constants/HomeConstants'),
    STATIC_RECOMMENDATIONS = _require.STATIC_RECOMMENDATIONS,
    STATBOX_DISPLAYS = _require.STATBOX_DISPLAYS,
    PERIODS = _require.PERIODS;

var _require2 = require('./general'),
    getFriendlyDuration = _require2.getFriendlyDuration,
    getEnergyClass = _require2.getEnergyClass,
    getMetricMu = _require2.getMetricMu,
    waterIQToNumeral = _require2.waterIQToNumeral,
    numeralToWaterIQ = _require2.numeralToWaterIQ;

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
    prepareBreakdownSessions = _require6.prepareBreakdownSessions;

var tip = function tip(widget) {
  return _extends({}, widget, {
    highlight: STATIC_RECOMMENDATIONS[Math.floor(Math.random() * 3)].description
  });
};

var amphiroLastShower = function amphiroLastShower(widget, devices, intl) {
  var _widget$data = widget.data,
      data = _widget$data === undefined ? [] : _widget$data,
      device = widget.device,
      showerId = widget.showerId,
      metric = widget.metric,
      timestamp = widget.timestamp;


  var lastSession = getShowerById(data.find(function (d) {
    return d.deviceKey === device;
  }), showerId);
  var measurements = lastSession ? lastSession.measurements : [];
  var chartCategories = measurements.map(function (m) {
    return moment(m.timestamp).format('hh:mm:ss');
  });
  var chartData = [{
    name: getDeviceNameByKey(devices, device) || '',
    data: measurements.map(function (m) {
      return m ? m[metric] : null;
    })
  }];
  var mu = getMetricMu(metric);

  return _extends({}, widget, {
    icon: 'shower.svg',
    more: 'See more details',
    chartCategories: chartCategories,
    timeDisplay: intl.formatRelative(timestamp),
    chartData: chartData,
    highlight: {
      image: 'volume.svg',
      text: lastSession ? lastSession[metric] : null,
      mu: mu
    },
    info: lastSession ? [{
      image: 'energy.svg',
      text: Math.round(lastSession.energy / 10) / 100 + ' ' + getMetricMu('energy')
    }, {
      image: 'timer-on.svg',
      text: getFriendlyDuration(lastSession.duration)
    }, {
      image: 'temperature.svg',
      text: lastSession.temperature + ' ' + getMetricMu('temperature')
    }] : [],
    mode: 'stats',
    mu: mu,
    clearComparisons: true
  });
};

var amphiroMembersRanking = function amphiroMembersRanking(widget, devices, intl) {
  var device = widget.device,
      metric = widget.metric,
      _widget$data2 = widget.data,
      data = _widget$data2 === undefined ? [] : _widget$data2;


  var periods = PERIODS.AMPHIRO;
  var membersData = data.map(function (m) {
    return _extends({}, m, {
      average: reduceMetric(devices, m.sessions, metric, true),
      showers: m.sessions.reduce(function (p, c) {
        return p + c.sessions.length;
      }, 0)
    });
  }).sort(function (a, b) {
    return a.average - b.average;
  }).filter(function (x, i) {
    return i < 3;
  });

  var chartCategories = membersData.map(function (m) {
    return m.name;
  });
  var chartData = [{
    name: 'Average shower',
    data: membersData.map(function (x) {
      return x.average;
    })
  }];
  var mu = getMetricMu(metric);
  var chartColors = ['#7AD3AB', '#2d3480', '#abaecc'];
  var chartColorFormatter = colorFormatterSingle(chartColors);

  return _extends({}, widget, {
    icon: 'goals.svg',
    more: 'See shower comparisons',
    periods: periods,
    chartCategories: chartCategories,
    chartData: chartData,
    legend: false,
    chartColorFormatter: chartColorFormatter,
    chartType: 'bar',
    mode: 'stats',
    mu: mu,
    info: membersData.map(function (m, i) {
      return {
        image: 'rank-' + (i + 1) + '.svg'
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

var amphiroOrMeterTotal = function amphiroOrMeterTotal(widget, devices, intl) {
  var _widget$data3 = widget.data,
      data = _widget$data3 === undefined ? [] : _widget$data3,
      period = widget.period,
      deviceType = widget.deviceType,
      metric = widget.metric,
      previous = widget.previous;


  var time = widget.time ? widget.time : getTimeByPeriod(period);
  var device = getDeviceKeysByType(devices, deviceType);
  var periods = deviceType === 'AMPHIRO' ? PERIODS.AMPHIRO.filter(function (p) {
    return p.id !== 'all';
  }) : PERIODS.METER.filter(function (p) {
    return p.id !== 'custom';
  });

  var reduced = reduceMetric(devices, data, metric);
  var previousReduced = reduceMetric(devices, previous, metric);

  var mu = getMetricMu(metric);
  var better = reduced < previousReduced;
  var comparePercentage = previousReduced === 0 ? null : Math.round(Math.abs(reduced - previousReduced) / previousReduced * 100);

  var chartCategories = deviceType === 'AMPHIRO' ? getChartAmphiroCategories(period) : getChartMeterCategoryLabels(getChartMeterCategories(time), time.granularity, period, intl);

  var chartData = data ? data.map(function (devData) {
    var sessions = devData.sessions.map(function (session) {
      return _extends({}, session, {
        duration: Math.round(100 * (session.duration / 60)) / 100,
        energy: Math.round(session.energy / 10) / 100
      });
    });

    return {
      name: getDeviceNameByKey(devices, devData.deviceKey) || 'SWM',
      data: deviceType === 'METER' ? getChartMeterData(sessions, getChartMeterCategories(time), time, metric) : getChartAmphiroData(sessions, getChartAmphiroCategories(period), metric)
    };
  }) : [];
  var hasComparison = better != null && comparePercentage != null;
  var str = better ? 'better' : 'worse';
  return _extends({}, widget, {
    icon: metric + '.svg',
    more: 'Explore ' + (deviceType === 'AMPHIRO' ? 'all showers' : 'SWM consumption'),
    time: time,
    periods: periods,
    highlight: {
      text: reduced,
      mu: mu
    },
    mu: mu,
    info: [{
      icon: better ? 'arrow-down green' : 'arrow-up red',
      text: comparePercentage + '% ' + str + ' than previous ' + period + '!',
      display: hasComparison
    }, {
      text: 'No comparison data!',
      display: !hasComparison
    }].filter(function (i) {
      return i.display;
    }),
    chartCategories: chartCategories,
    chartData: chartData,
    mode: 'stats',
    clearComparisons: true
  });
};

var amphiroEnergyEfficiency = function amphiroEnergyEfficiency(widget, devices, intl) {
  var _widget$data4 = widget.data,
      data = _widget$data4 === undefined ? [] : _widget$data4,
      period = widget.period,
      deviceType = widget.deviceType,
      metric = widget.metric,
      previous = widget.previous;


  if (metric !== 'energy') {
    console.error('only energy efficiency supported');
  } else if (deviceType !== 'AMPHIRO') {
    console.error('only amphiro energy efficiency supported');
  }
  var device = getDeviceKeysByType(devices, deviceType);
  var periods = PERIODS.AMPHIRO.filter(function (p) {
    return p.id !== 'all';
  });

  var reduced = reduceMetric(devices, data, metric);
  var previousReduced = reduceMetric(devices, previous, metric);

  var better = reduced < previousReduced;

  var comparePercentage = previousReduced === 0 ? null : Math.round(Math.abs(reduced - previousReduced) / previousReduced * 100);

  var showers = getSessionsCount(devices, data);
  var highlight = showers === 0 || reduced === 0 ? null : getEnergyClass(reduced / showers);
  var hasComparison = better != null && comparePercentage != null;
  var str = better ? 'better' : 'worse';
  return _extends({}, widget, {
    icon: 'energy.svg',
    periods: periods,
    highlight: {
      text: highlight,
      mu: ''
    },
    info: [{
      icon: better ? 'arrow-down green' : 'arrow-up red',
      text: comparePercentage + '% ' + str + ' than previous ' + period + '!',
      display: hasComparison
    }, {
      text: 'No comparison data!',
      display: !hasComparison
    }].filter(function (i) {
      return i.display;
    }),
    mode: 'stats',
    clearComparisons: true
  });
};

var meterForecast = function meterForecast(widget, devices, intl) {
  var _widget$data5 = widget.data,
      data = _widget$data5 === undefined ? [] : _widget$data5,
      forecastData = widget.forecastData,
      period = widget.period,
      deviceType = widget.deviceType,
      metric = widget.metric,
      previous = widget.previous;


  if (deviceType !== 'METER') {
    console.error('only meter forecast supported');
  }
  var time = widget.time ? widget.time : getTimeByPeriod(period);
  var periods = PERIODS.METER.filter(function (p) {
    return p.id !== 'custom';
  });

  var device = getDeviceKeysByType(devices, deviceType);

  var chartColors = ['#2d3480', '#abaecc', '#7AD3AB', '#CD4D3E'];

  var mu = getMetricMu(metric);
  var xCategories = getChartMeterCategories(time);
  var xCategoryLabels = getChartMeterCategoryLabels(xCategories, time.granularity, period, intl);

  var chartData = data.map(function (devData) {
    return {
      name: 'SWM',
      data: getChartMeterData(devData.sessions, xCategories, time, metric)
    };
  });

  var forecastChartData = forecastData && forecastData.sessions ? [{
    name: 'Forecast',
    data: getChartMeterData(forecastData.sessions, xCategories, time, metric)
  }] : [];

  return _extends({}, widget, {
    chartType: 'bar',
    time: time,
    periods: periods,
    chartCategories: xCategoryLabels,
    chartData: [].concat(_toConsumableArray(chartData), forecastChartData),
    mu: mu,
    mode: 'forecasting',
    clearComparisons: true
  });
};

var meterPricing = function meterPricing(widget, devices, intl) {
  var _widget$data6 = widget.data,
      data = _widget$data6 === undefined ? [] : _widget$data6,
      period = widget.period,
      deviceType = widget.deviceType,
      metric = widget.metric,
      brackets = widget.brackets;


  if (deviceType !== 'METER') {
    console.error('only meter pricing supported');
  } else if (period !== 'month') {
    console.error('only monthly pricing supported');
  }
  var time = widget.time ? widget.time : getTimeByPeriod(period);
  var periods = [];

  var device = getDeviceKeysByType(devices, deviceType);

  var mu = getMetricMu(metric);
  var xCategories = getChartMeterCategories(time);
  var xCategoryLabels = getChartMeterCategoryLabels(xCategories, time.granularity, period, intl);

  var priceBrackets = getChartPriceBrackets(xCategories, brackets, intl);

  var chartData = data.map(function (devData) {
    return {
      name: 'Consumption',
      data: getChartMeterData(devData.sessions, xCategories, time, metric, true // augmental
      )
    };
  });

  return _extends({}, widget, {
    icon: 'money.svg',
    chartType: 'line',
    timeDisplay: intl.formatDate(time.startDate, { month: 'long' }),
    time: time,
    periods: periods,
    chartCategories: xCategoryLabels,
    chartData: [].concat(_toConsumableArray(chartData), _toConsumableArray(priceBrackets)),
    mu: mu,
    mode: 'pricing',
    clearComparisons: true
  });
};

var meterBreakdown = function meterBreakdown(widget, devices, intl) {
  var _widget$data7 = widget.data,
      data = _widget$data7 === undefined ? [] : _widget$data7,
      period = widget.period,
      deviceType = widget.deviceType,
      metric = widget.metric,
      _widget$breakdown = widget.breakdown,
      breakdown = _widget$breakdown === undefined ? [] : _widget$breakdown;


  if (deviceType !== 'METER') {
    console.error('only meter breakdown makes sense');
  }

  var periods = PERIODS.METER.filter(function (p) {
    return p.id === 'month' || p.id === 'year';
  });

  var device = getDeviceKeysByType(devices, deviceType);
  var reduced = reduceMetric(devices, data, metric);

  var time = widget.time ? widget.time : getTimeByPeriod(period);

  var sessions = prepareBreakdownSessions(devices, data, metric, breakdown, null, time.startDate, time.granularity, intl);

  var chartColors = ['#abaecc', '#8185b2', '#575d99', '#2d3480'];
  var chartColorFormatter = colorFormatterSingle(chartColors);
  var chartCategories = sessions.map(function (x) {
    return intl.formatMessage({ id: 'breakdown.' + x.id }).split(' ').join('\n');
  });
  var chartData = [{
    name: 'Consumption',
    data: sessions.map(function (x) {
      return x[metric];
    })
  }];

  var mu = getMetricMu(metric);

  return _extends({}, widget, {
    icon: 'stats-side.svg',
    time: time,
    periods: periods,
    chartType: 'horizontal-bar',
    chartCategories: chartCategories,
    chartColorFormatter: chartColorFormatter,
    chartData: chartData,
    mu: mu,
    clearComparisons: true,
    mode: 'breakdown'
  });
};

var meterComparison = function meterComparison(widget, devices, intl) {
  var data = widget.data,
      period = widget.period,
      periodIndex = widget.periodIndex,
      deviceType = widget.deviceType,
      metric = widget.metric,
      comparisons = widget.comparisons;


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

  var mu = 'lt';

  return _extends({}, widget, {
    icon: 'stats-side.svg',
    timeDisplay: intl.formatDate(time.startDate, { month: 'long' }),
    time: time,
    periods: periods,
    chartType: 'horizontal-bar',
    chartCategories: chartCategories,
    chartColorFormatter: chartColorFormatter,
    chartData: chartData,
    mu: mu,
    mode: 'stats',
    comparisonData: Array.isArray(comparisons) ? comparisons.filter(function (c) {
      return c.id !== 'user';
    }) : []
  });
};

var waterIQ = function waterIQ(widget, devices, intl) {
  var data = widget.data,
      period = widget.period,
      periodIndex = widget.periodIndex,
      deviceType = widget.deviceType,
      metric = widget.metric;


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
  var highlightImg = hasWaterIQ ? 'energy-' + current.user + '.svg' : null;

  var chartColors = ['#f5dbd8', '#ebb7b1', '#a3d4f4', '#2d3480'];
  var chartColorFormatter = colorFormatterSingle(chartColors);
  var comparisons = ['similar', 'nearest', 'all', 'user'];
  var chartCategories = Array.isArray(comparisons) ? comparisons.map(function (comparison) {
    return intl.formatMessage({ id: 'comparisons.' + comparison });
  }) : [];

  var chartData = [{
    name: 'Water IQ',
    data: Array.isArray(comparisons) ? comparisons.map(function (comparison) {
      return current ? waterIQToNumeral(current[comparison]) : 0;
    }) : []
  }];
  return _extends({}, widget, {
    icon: 'stats-side.svg',
    timeDisplay: intl.formatDate(time.startDate, { month: 'long' }),
    //time,
    periods: periods,
    info: [{
      icon: 'arrow-up green',
      text: intl.formatDate(best.timestamp, { month: 'long' }) + ' is the best (' + best.user + ') of the last six months!',
      display: hasWaterIQ
    }, {
      icon: 'arrow-down red',
      text: intl.formatDate(worst.timestamp, { month: 'long' }) + ' is the worst (' + worst.user + ') of the last six months!',
      display: hasWaterIQ
    }, {
      text: 'Water IQ data not computed yet!',
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

var budget = function budget(widget, devices, intl) {
  var data = widget.data,
      period = widget.period,
      deviceType = widget.deviceType,
      metric = widget.metric,
      previous = widget.previous;


  if (deviceType !== 'METER') {
    console.error('only meter comparison supported');
  }

  var periods = PERIODS.METER.filter(function (p) {
    return p.id !== 'custom';
  });
  var reduced = data ? reduceMetric(devices, data, metric) : 0;
  var mu = getMetricMu(metric);

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
      text: reduced,
      mu: mu
    },
    chartData: chartData,
    chartColors: chartColors
  });
};

var prepareWidget = function prepareWidget(widget, devices, intl) {
  switch (widget.type) {
    case 'tip':
      return tip();
    case 'last':
      return amphiroLastShower(widget, devices, intl);
    case 'ranking':
      return amphiroMembersRanking(widget, devices, intl);
    case 'total':
      return amphiroOrMeterTotal(widget, devices, intl);
    case 'efficiency':
      return amphiroEnergyEfficiency(widget, devices, intl);
    case 'forecast':
      return meterForecast(widget, devices, intl);
    case 'pricing':
      return meterPricing(widget, devices, intl);
    case 'breakdown':
      return meterBreakdown(widget, devices, intl);
    case 'comparison':
      return meterComparison(widget, devices, intl);
    case 'budget':
      return budget(widget, devices, intl);
    case 'wateriq':
      return waterIQ(widget, devices, intl);
    default:
      return widget;
  }
};

module.exports = prepareWidget;