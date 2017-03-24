const moment = require('moment');
const { convertGranularityToPeriod, getLowerGranularityPeriod, getTimeLabelByGranularityShort, timeToBuckets } = require('./time');
const { BRACKET_COLORS } = require('../constants/HomeConstants');

const getChartMeterCategories = function (time) {
  return timeToBuckets(time);
};

const getChartMeterCategoryLabels = function (xData, granularity, period, intl) {
  return xData.map(t => getTimeLabelByGranularityShort(t, granularity, period, intl));
};

const getChartAmphiroCategories = function (period, last) {
  let length = 0;
  if (period === 'ten') {
    length = 10;
  } else if (period === 'twenty') {
    length = 20;
  } else if (period === 'fifty') {
    length = 50;
  } else if (period === 'all') {
    length = last;
  } 
  return Array.from({ length }, (v, i) => `${i + 1}`);
};

const mapAmphiroDataToChart = function (sessions, categories, filter) {
  if (!Array.isArray(sessions) || !Array.isArray(categories)) {
    throw new Error('Cant\'t create chart. Check provided data and category', sessions, categories);
  }
  if (sessions.length === 0) return [sessions[0]];
  
  const sessionsNormalized = [
    ...Array.from({ length: categories.length - sessions.length }), 
    ...sessions
  ];
  return categories.map((v, i) => sessionsNormalized[i]);
};

// TODO: have to make sure data is ALWAYS fetched in order of ascending ids 
// for amphiro, ascending timestamps for meters

const getChartAmphiroData = function (sessions, categories, filter) {
  return mapAmphiroDataToChart(sessions, categories, filter)
  .map(x => x ? x[filter] : null)
  .map((x) => {
    if (filter === 'duration') {
      return Math.round(100 * (x / 60)) / 100;
    } else if (filter === 'energy') {
      return Math.round((100 * x) / 10) / 100;
    } 
    return Math.round(100 * x) / 100;
  });
};

const mapMeterDataToChart = function (sessions, categories, time) {
  const period = getLowerGranularityPeriod(convertGranularityToPeriod(time.granularity));
  return categories.map((t) => {
    const bucketSession = sessions.find((session) => {
      let tt;
      if (period === 'hour') {
        tt = moment(session.timestamp)
        .startOf('hour').valueOf();
      } else if (period === 'day') {
        tt = moment(session.timestamp)
        .startOf('day').valueOf();
      } else if (period === 'week') {
        tt = moment(session.timestamp)
        .endOf('isoweek').startOf('day').valueOf();
      } else if (period === 'month') {
        tt = moment(session.timestamp)
        .endOf('month').startOf('day').valueOf();
      }
      return tt === t;
    });

    return bucketSession;
  });
};

const getChartMeterData = function (sessions, categories, time, filter) {
  return mapMeterDataToChart(sessions, categories, time)
  .map(x => x && x[filter] !== null ? 
         Math.round(100 * x[filter]) / 100 : null);
};

const getChartPriceBrackets = function (xCategories, brackets, intl) {
  return brackets
  .filter(bracket => bracket.maxVolume != null)
  .map((bracket, i) => ({
    name: `${bracket.minVolume} to ${bracket.maxVolume} \u33A5: ${bracket.price}\u20AC`,
    data: xCategories.map(() => bracket.maxVolume * 1000),
    label: false,
    lineType: 'dashed',
    symbol: 'none',
    color: BRACKET_COLORS[i],
    fill: 0,
  }));
};

module.exports = {
  mapMeterDataToChart,
  mapAmphiroDataToChart,
  getChartAmphiroData,
  getChartMeterData,
  getChartMeterCategories,
  getChartMeterCategoryLabels,
  getChartAmphiroCategories,
  getChartPriceBrackets,
};
