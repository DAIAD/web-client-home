const moment = require('moment');
const { convertGranularityToPeriod, getLowerGranularityPeriod, timeToBuckets } = require('./time');


const getTimeLabelByGranularity = function (timestamp, granularity, intl) {
  if (granularity === 4) {
    return intl.formatMessage({ id: `months.${moment(timestamp).get('month')}` }) + 
      ' ' +
      moment(timestamp).format('YYYY'); 
  } else if (granularity === 3) {
    return intl.formatMessage({ id: 'periods.week' }) + 
      ' ' +
      moment(timestamp).get('isoweek') + 
      ', ' +
      intl.formatMessage({ id: `months.${moment(timestamp).get('month')}` }) + 
      ' ' +
      moment(timestamp).format('YYYY');
  } else if (granularity === 2) {
    return intl.formatMessage({ id: `weekdays.${moment(timestamp).get('day')}` }) + 
      ' ' +
      moment(timestamp).format(' DD / MM / YYYY');
  }
  return intl.formatMessage({ id: `weekdays.${moment(timestamp).get('day')}` }) + 
    ' ' +
    moment(timestamp).format('DD/ MM/ YYYY hh:mm a');
};

const getTimeLabelByGranularityShort = function (timestamp, granularity, period, intl) {
  if (granularity === 4) {
    return intl.formatMessage({ 
      id: `months.${moment(timestamp).get('month')}`,
    });
  } else if (granularity === 3 && period === 'month') {
    return intl.formatMessage({ id: 'periods.week' }) + 
      ' ' +
      moment(timestamp).get('isoweek');
  } else if (granularity === 2 && (period === 'month' || period === 'custom')) {
    return moment(timestamp).format('DD/MM');
  } else if (granularity === 2) {
    return intl.formatMessage({ 
      id: `weekdays.${moment(timestamp).get('day')}`,
    });
  } else if (granularity === 1 || granularity === 0) { 
    return moment(timestamp).format('hh:mm');
  }
  return ' ';
};

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

const getChartMeterData = function (sessions, categories, time, filter, augmental = false) {
  const mapped = mapMeterDataToChart(sessions, categories, time)
  .map(x => x && x[filter] !== null ? 
         Math.round(100 * x[filter]) / 100 : null);

  return augmental ? 
    mapped.map((x, i, arr) => x !== null ? arr.filter((y, j) => j <= i).reduce((p, c) => p + c, 0) : null)
    :
    mapped;
};

module.exports = {
  mapMeterDataToChart,
  mapAmphiroDataToChart,
  getChartAmphiroData,
  getChartMeterData,
  getChartMeterCategories,
  getChartMeterCategoryLabels,
  getChartAmphiroCategories,
  getTimeLabelByGranularity,
  getTimeLabelByGranularityShort,
};
