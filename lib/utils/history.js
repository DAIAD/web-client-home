'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var moment = require('moment');

var schemas = require('../schemas/history');

var _require = require('./time'),
    bringPastSessionsToPresent = _require.bringPastSessionsToPresent,
    convertGranularityToPeriod = _require.convertGranularityToPeriod,
    getTimeLabelByGranularity = _require.getTimeLabelByGranularity;

var _require2 = require('./device'),
    getDeviceNameByKey = _require2.getDeviceNameByKey,
    getDeviceKeysByType = _require2.getDeviceKeysByType;

var _require3 = require('./general'),
    formatMessage = _require3.formatMessage,
    getMetricMu = _require3.getMetricMu,
    waterIQToNumeral = _require3.waterIQToNumeral,
    numeralToWaterIQ = _require3.numeralToWaterIQ;

var _require4 = require('./comparisons'),
    getComparisons = _require4.getComparisons,
    getComparisonTitle = _require4.getComparisonTitle;

var _require5 = require('./chart'),
    getChartMeterData = _require5.getChartMeterData,
    getChartAmphiroData = _require5.getChartAmphiroData,
    getChartMeterCategories = _require5.getChartMeterCategories,
    getChartMeterCategoryLabels = _require5.getChartMeterCategoryLabels,
    getChartAmphiroCategories = _require5.getChartAmphiroCategories,
    mapMeterDataToChart = _require5.mapMeterDataToChart,
    mapAmphiroDataToChart = _require5.mapAmphiroDataToChart,
    getChartPriceBrackets = _require5.getChartPriceBrackets;

var _require6 = require('./sessions'),
    getLastShowerIdFromMultiple = _require6.getLastShowerIdFromMultiple,
    reduceMetric = _require6.reduceMetric,
    sortSessions = _require6.sortSessions,
    prepareSessionsForTable = _require6.prepareSessionsForTable,
    prepareBreakdownSessions = _require6.prepareBreakdownSessions,
    preparePricingSessions = _require6.preparePricingSessions;

var getStatsMeterData = function getStatsMeterData(props) {
  // TABLE
  var sessions = sortSessions(prepareSessionsForTable(props.devices, props.data, props.members, props.user.firstname, props.time.granularity, props.intl), props.sortFilter, props.sortOrder);

  var reducedMetric = reduceMetric(props.devices, props.data, props.filter);
  var mu = getMetricMu(props.filter);
  var highlight = reducedMetric + ' ' + mu;

  // CHART

  var chartFormatter = function chartFormatter(y) {
    return y + ' ' + mu;
  };
  var xCategories = getChartMeterCategories(props.time);

  var chartCategories = getChartMeterCategoryLabels(xCategories, props.time.granularity, props.timeFilter, props.intl);

  var chartData = props.data.map(function (devData) {
    return {
      name: 'SWM',
      data: getChartMeterData(devData.sessions, xCategories, props.time, props.filter),
      metadata: {
        ids: mapMeterDataToChart(devData.sessions, xCategories, props.time).map(function (val) {
          return val ? [val.id, val.timestamp] : [null, null];
        })
      }
    };
  });

  var comparisonsData = props.comparisons.map(function (comparison) {
    var compSessions = comparison.id === 'last' ? bringPastSessionsToPresent(comparison.sessions, props.timeFilter) : comparison.sessions;
    return {
      name: getComparisonTitle(props.activeDeviceType, comparison.id, props.time.startDate, props.timeFilter, props.favoriteCommonName, props.members, props._t),
      data: getChartMeterData(compSessions, xCategories, props.time, props.filter),
      fill: 0.1
    };
  });

  return {
    //Table
    sessions: sessions,
    sessionFields: schemas.meter,
    reducedMetric: reducedMetric,
    highlight: highlight,
    //Chart
    xCategories: xCategories,
    chartType: 'line',
    chartCategories: chartCategories,
    chartFormatter: chartFormatter,
    chartData: [].concat(_toConsumableArray(chartData), _toConsumableArray(comparisonsData)),
    mu: mu
  };
};

var getStatsAmphiroData = function getStatsAmphiroData(props) {
  // TABLE
  var sessions = sortSessions(prepareSessionsForTable(props.devices, props.data, props.members, props.user.firstname, props.time.granularity, props.intl), props.sortFilter, props.sortOrder);

  var reducedMetric = reduceMetric(props.devices, props.data, props.filter);
  var mu = getMetricMu(props.filter);
  var highlight = reducedMetric + ' ' + mu;

  // CHART

  var xCategories = getChartAmphiroCategories(props.timeFilter, getLastShowerIdFromMultiple(props.data));

  var chartCategories = xCategories;
  var chartFormatter = function chartFormatter(y) {
    return y + ' ' + mu;
  };

  var chartData = props.data.map(function (devData) {
    var memberName = props.memberFilter === 'all' ? 'All' : props.members.find(function (m) {
      return props.memberFilter === m.index;
    }).name;
    var devName = getDeviceNameByKey(props.devices, devData.deviceKey);
    return {
      name: memberName + ' (' + devName + ')',
      data: getChartAmphiroData(devData.sessions, xCategories, props.filter),
      metadata: {
        device: devData.deviceKey,
        ids: mapAmphiroDataToChart(devData.sessions, xCategories, props.time).map(function (val) {
          return val ? [val.id, val.timestamp] : [null, null];
        })
      }
    };
  });

  var comparisonsData = props.comparisons.map(function (comparison) {
    return comparison.sessions.map(function (dev) {
      return {
        name: getComparisonTitle(props.activeDeviceType, comparison.id, props.time.startDate, props.timeFilter, props.favoriteCommonName, props.members, props._t) + ' (' + dev.name + ')',
        data: getChartAmphiroData(dev.sessions, xCategories, props.filter),
        fill: 0.1
      };
    });
  }).reduce(function (p, c) {
    return [].concat(_toConsumableArray(p), _toConsumableArray(c));
  }, []);

  return {
    //Table
    sessions: sessions,
    sessionFields: schemas.amphiro,
    reducedMetric: reducedMetric,
    highlight: highlight,
    //Chart
    xCategories: xCategories,
    chartType: 'line',
    chartCategories: chartCategories,
    chartFormatter: chartFormatter,
    chartData: [].concat(_toConsumableArray(chartData), _toConsumableArray(comparisonsData)),
    mu: mu
  };
};

var getStatsData = function getStatsData(props) {
  switch (props.activeDeviceType) {
    case 'METER':
      return getStatsMeterData(props);
    case 'AMPHIRO':
      return getStatsAmphiroData(props);
    default:
      return {};
  }
};

var getForecastData = function getForecastData(props) {
  var statsData = getStatsData(props);
  var forecastData = props.forecasting && props.forecastData && Array.isArray(props.forecastData.sessions) ? [{
    name: 'Forecast',
    data: getChartMeterData(props.forecastData.sessions, statsData.xCategories, props.time, props.filter),
    metadata: {
      ids: mapMeterDataToChart(props.forecastData.sessions, statsData.xCategories, props.time).map(function (val) {
        return val ? [val.id, val.timestamp] : [null, null];
      })
    },
    lineType: 'dashed',
    color: '#2d3480',
    fill: 0.1,
    symbol: 'emptyRectangle'
  }] : [];

  var sessions = Array.isArray(props.forecastData.sessions) ? sortSessions(props.forecastData.sessions.map(function (session) {
    return _extends({}, statsData.sessions.find(function (s) {
      return s.timestamp === session.timestamp;
    }), {
      devName: 'SWM',
      forecast: Math.round(session.volume * 100) / 100,
      member: props.user.firstname,
      timestamp: session.timestamp,
      date: getTimeLabelByGranularity(session.timestamp, props.time.granularity, props.intl)

    });
  }), props.sortFilter, props.sortOrder) : [];
  return _extends({}, statsData, {
    sessionFields: schemas.forecast,
    sessions: sessions,
    chartData: [].concat(_toConsumableArray(statsData.chartData), forecastData)
  });
};

var getPricingData = function getPricingData(props) {
  //const statsData = getStatsData(props);

  var meterSessions = Array.isArray(props.data) && props.data.length === 1 ? props.data[0].sessions : [];
  var sessions = sortSessions(preparePricingSessions(meterSessions, props.priceBrackets, props.time.granularity, props.user.firstname, props.intl), props.sortFilter, props.sortOrder);

  var reducedMetric = reduceMetric(props.devices, [{ sessions: sessions }], 'cost');
  var highlight = reducedMetric + ' ' + getMetricMu('cost');

  // CHART

  var xCategories = getChartMeterCategories(props.time);

  var chartPriceBrackets = props.pricing && props.priceBrackets ? getChartPriceBrackets(xCategories, props.priceBrackets, props.intl) : [];

  var chartFormatter = function chartFormatter(y) {
    return y + ' ' + getMetricMu(props.filter);
  };

  var chartCategories = getChartMeterCategoryLabels(xCategories, props.time.granularity, props.timeFilter, props.intl);

  var chartData = [{
    name: 'SWM total',
    data: getChartMeterData(sessions, xCategories, props.time, props.filter),
    metadata: {
      ids: mapMeterDataToChart(sessions, xCategories, props.time).map(function (val) {
        return val ? [val.id, val.timestamp] : [null, null];
      })
    }
  }];

  var comparisonsData = props.comparisons.map(function (comparison) {
    var compSessions = comparison.id === 'last' ? bringPastSessionsToPresent(comparison.sessions, props.timeFilter) : comparison.sessions;

    var sessionsToCompare = preparePricingSessions(compSessions, props.priceBrackets, props.time.granularity, props.user.firstname, props.intl);
    return {
      name: getComparisonTitle(props.activeDeviceType, comparison.id, props.time.startDate, props.timeFilter, props.favoriteCommonName, props.members, props._t),
      data: getChartMeterData(sessionsToCompare, xCategories, props.time, props.filter),
      fill: 0.1
    };
  });
  return {
    sessions: sessions,
    sessionFields: schemas.pricing,
    reducedMetric: reducedMetric,
    highlight: highlight,
    chartCategories: chartCategories,
    chartFormatter: chartFormatter,
    chartData: [].concat(chartData, _toConsumableArray(comparisonsData), _toConsumableArray(chartPriceBrackets))
  };
};

var getBreakdownData = function getBreakdownData(props) {
  var statsData = getStatsData(props);

  var chartColors = ['#abaecc', '#8185b2', '#575d99', '#2d3480'];

  var sessions = prepareBreakdownSessions(props.devices, props.data, props.filter, props.waterBreakdown, props.user.firstname, props.time.startDate, props.timeFilter, props.intl);

  var sessionsSorted = sortSessions(sessions, props.sortFilter, props.sortOrder);
  var chartCategories = sessions.map(function (x) {
    return props._t('breakdown.' + x.id);
  });
  var chartData = [{
    name: 'Consumption',
    data: sessions.map(function (x) {
      return x[props.filter];
    }),
    metadata: {
      ids: sessions.map(function (x) {
        return x ? [x.id, x.timestamp] : [null, null];
      })
    }
  }].concat(_toConsumableArray(props.comparisons.map(function (comparison) {
    return {
      name: getComparisonTitle(props.activeDeviceType, comparison.id, props.time.startDate, props.timeFilter, props.favoriteCommonName, props.members, props._t),
      data: prepareBreakdownSessions(props.devices, [{ sessions: comparison.sessions }], props.filter, props.waterBreakdown, props.user.firstname, props.time.startDate, props.timeFilter, props.intl).map(function (x) {
        return x[props.filter];
      })
    };
  })));

  return _extends({}, statsData, {
    sessions: sessionsSorted,
    chartType: 'bar',
    chartCategories: chartCategories,
    chartColors: chartColors,
    chartData: chartData,
    sessionFields: schemas.breakdown
  });
};

var getWaterIQData = function getWaterIQData(props) {
  var statsData = getStatsData(props);

  var waterIQData = props.waterIQData.map(function (x) {
    return _extends({}, x, {
      user: waterIQToNumeral(x.user),
      all: waterIQToNumeral(x.all),
      similar: waterIQToNumeral(x.similar),
      nearest: waterIQToNumeral(x.nearest),
      timestamp: moment(x.from).startOf('month').valueOf()
    });
  });

  var sessions = statsData.sessions.map(function (session) {
    return _extends({}, session, {
      wateriq: waterIQData.find(function (x) {
        return x.timestamp === moment(session.timestamp).startOf('month').valueOf();
      }) ? numeralToWaterIQ(waterIQData.find(function (x) {
        return x.timestamp === moment(session.timestamp).startOf('month').valueOf();
      }).user) : null
    });
  });

  var chartData = [{
    id: 'user',
    title: 'Water IQ'
  }].concat(_toConsumableArray(props.comparisons)).map(function (c) {
    return {
      name: c.title || getComparisonTitle(props.activeDeviceType, c.id, props.time.startDate, props.timeFilter, props.favoriteCommonName, props.members, props._t),
      data: getChartMeterData(waterIQData, statsData.xCategories, props.time, c.id),
      metadata: {
        ids: mapMeterDataToChart(Array.isArray(props.data) && props.data.length > 0 ? props.data[0].sessions : [], statsData.xCategories, props.time).map(function (val) {
          return val ? [val.id, val.timestamp] : [null, null];
        })
      },
      //color: '#2d3480',
      fill: 0
    };
  });

  var chartFormatter = function chartFormatter(y) {
    return numeralToWaterIQ(y);
  };
  return _extends({}, statsData, {
    sessions: sessions,
    sessionFields: schemas.wateriq,
    highlight: '',
    chartData: chartData,
    chartYMax: 6,
    chartFormatter: chartFormatter,
    chartType: 'bar'
  });
};

var getHistoryData = function getHistoryData(props) {
  var mode = props.mode;

  switch (mode) {
    case 'stats':
      return getStatsData(props);
    case 'forecasting':
      return getForecastData(props);
    case 'pricing':
      return getPricingData(props);
    case 'breakdown':
      return getBreakdownData(props);
    case 'wateriq':
      return getWaterIQData(props);
    default:
      return getStatsData(props);
  }
};

module.exports = {
  getHistoryData: getHistoryData
};