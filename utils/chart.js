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

const getTimeLabelByGranularityShort = function (timestamp, granularity, intl) {
  if (granularity === 4) {
    return intl.formatMessage({ 
      id: `months.${moment(timestamp).get('month')}`,
    }); 
  } else if (granularity === 3) {
    return intl.formatMessage({ id: 'periods.week' }) + 
      ' ' +
      moment(timestamp).get('isoweek');
  } else if (granularity === 2) {
    return intl.formatMessage({ 
      id: `weekdays.${moment(timestamp).get('day')}`,
    });
  } 
  return moment(timestamp).format('hh:mm');
};

const getChartMeterCategories = function (time) {
  return timeToBuckets(time);
};

const getChartMeterCategoryLabels = function (xData, time, intl) {
  if (!time || time.granularity == null || !intl) return [];
  return xData.map(t => getTimeLabelByGranularityShort(t, time.granularity, intl));
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

// TODO: have to make sure data is ALWAYS fetched in order of ascending ids 
// for amphiro, ascending timestamps for meters

const getChartAmphiroData = function (sessions, categories) {
  if (!Array.isArray(sessions) || !Array.isArray(categories)) {
    throw new Error('Cant\'t create chart. Check provided data and category', sessions, categories);
  }
  if (sessions.length === 0) return [sessions[0]];
  //return categories.map((v, i) => sessions.find((s, idx, arr) => (s.id - arr[0].id) === i) || {});
  return categories.map((v, i) => sessions[i]);
};

const getChartMeterData = function (sessions, categories, time) {
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

module.exports = {
  getChartAmphiroData,
  getChartMeterData,
  getChartMeterCategories,
  getChartMeterCategoryLabels,
  getChartAmphiroCategories,
  getTimeLabelByGranularity,
  getTimeLabelByGranularityShort,
};
