'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var moment = require('moment');

var _require = require('./time'),
    convertGranularityToPeriod = _require.convertGranularityToPeriod,
    getLowerGranularityPeriod = _require.getLowerGranularityPeriod,
    getTimeLabelByGranularityShort = _require.getTimeLabelByGranularityShort,
    timeToBuckets = _require.timeToBuckets;

var _require2 = require('./general'),
    formatMetric = _require2.formatMetric,
    displayMetric = _require2.displayMetric,
    showerFilterToLength = _require2.showerFilterToLength;

var _require3 = require('../constants/HomeConstants'),
    BRACKET_COLORS = _require3.BRACKET_COLORS;

var getChartMeterCategories = function getChartMeterCategories(time) {
  return timeToBuckets(time);
};

var getChartMeterCategoryLabels = function getChartMeterCategoryLabels(xData, granularity, period, intl) {
  return xData.map(function (t) {
    return getTimeLabelByGranularityShort(t, granularity, period, intl);
  });
};

var getChartAmphiroCategories = function getChartAmphiroCategories(period, last) {
  var length = showerFilterToLength(period);
  if (period === 'all') {
    length = last;
  }
  return Array.from({ length: length }, function (v, i) {
    return '' + (i + 1);
  });
};

var mapAmphiroDataToChart = function mapAmphiroDataToChart(sessions, categories, filter) {
  if (!Array.isArray(sessions) || !Array.isArray(categories)) {
    throw new Error('Cant\'t create chart. Check provided data and category', sessions, categories);
  }
  if (sessions.length === 0) return [sessions[0]];

  var sessionsNormalized = [].concat(_toConsumableArray(Array.from({ length: categories.length - sessions.length })), _toConsumableArray(sessions));
  return categories.map(function (v, i) {
    return sessionsNormalized[i];
  });
};

// TODO: have to make sure data is ALWAYS fetched in order of ascending ids 
// for amphiro, ascending timestamps for meters

var getChartAmphiroData = function getChartAmphiroData(sessions, categories, filter) {
  return mapAmphiroDataToChart(sessions, categories, filter).map(function (x) {
    return x ? x[filter] : null;
  }).map(function (x) {
    return Math.round(100 * x) / 100;
  });
};

var mapMeterDataToChart = function mapMeterDataToChart(sessions, categories, time) {
  var period = getLowerGranularityPeriod(convertGranularityToPeriod(time.granularity));
  return categories.map(function (t) {
    var bucketSession = sessions.find(function (session) {
      var tt = void 0;
      if (period === 'hour') {
        tt = moment(session.timestamp).startOf('hour').valueOf();
      } else if (period === 'day') {
        tt = moment(session.timestamp).startOf('day').valueOf();
      } else if (period === 'week') {
        tt = moment(session.timestamp).endOf('isoweek').startOf('day').valueOf();
      } else if (period === 'month') {
        tt = moment(session.timestamp).endOf('month').startOf('day').valueOf();
      }
      return tt === t;
    });

    return bucketSession;
  });
};

var getChartMeterData = function getChartMeterData(sessions, categories, time, filter) {
  return mapMeterDataToChart(sessions, categories, time).map(function (x) {
    return x && x[filter] !== null ? Math.round(100 * x[filter]) / 100 : null;
  });
};

var getChartPriceBrackets = function getChartPriceBrackets(xCategories, brackets, unit, intl) {
  var max = Math.max.apply(Math, _toConsumableArray(brackets.map(function (b) {
    return b.minVolume;
  })));
  return Array.isArray(brackets) ? brackets.filter(function (bracket) {
    return bracket.maxVolume != null;
  }).map(function (bracket, i) {
    return {
      name: displayMetric(formatMetric(bracket.minVolume, 'volume', unit, max)) + ' - ' + displayMetric(formatMetric(bracket.maxVolume, 'volume', unit, max)) + ': ' + displayMetric(formatMetric(bracket.price, 'cost', unit)),
      data: xCategories.map(function () {
        return formatMetric(bracket.maxVolume, 'total', unit)[0];
      }),
      label: false,
      lineType: 'dashed',
      symbol: 'none',
      color: BRACKET_COLORS[i],
      fill: 0
    };
  }) : [];
};

var colorFormatterSingle = function colorFormatterSingle(colors) {
  return function (name, data, idx) {
    return colors.find(function (c, i, arr) {
      return idx % arr.length === i;
    });
  };
};

module.exports = {
  mapMeterDataToChart: mapMeterDataToChart,
  mapAmphiroDataToChart: mapAmphiroDataToChart,
  getChartAmphiroData: getChartAmphiroData,
  getChartMeterData: getChartMeterData,
  getChartMeterCategories: getChartMeterCategories,
  getChartMeterCategoryLabels: getChartMeterCategoryLabels,
  getChartAmphiroCategories: getChartAmphiroCategories,
  getChartPriceBrackets: getChartPriceBrackets,
  colorFormatterSingle: colorFormatterSingle
};