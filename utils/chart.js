const moment = require('moment');
const { convertGranularityToPeriod, getLowerGranularityPeriod, timeToBuckets } = require('./time');


const getTimeLabelByGranularity = function (timestamp, granularity, intl) {
  if (granularity === 4) {
    return intl.formatMessage({ id: `months.${moment(timestamp).get('month')}` }) + 
      moment(timestamp).format('YYYY'); 
  } else if (granularity === 3) {
    return intl.formatMessage({ id: 'periods.week' }) + 
      moment(timestamp).get('isoweek') + 
      intl.formatMessage({ id: `months.${moment(timestamp).get('month')}` }) + 
      moment(timestamp).format('YYYY');
  } else if (granularity === 2) {
    return intl.formatMessage({ id: `weekdays.${moment(timestamp).get('day')}` }) + 
      moment(timestamp).format(' DD / MM / YYYY');
  }
  return intl.formatMessage({ id: `weekdays.${moment(timestamp).get('day')}` }) + 
    moment(timestamp).format('DD/ MM/ YYYY hh:mm a');
};

const getTimeLabelByGranularityShort = function (timestamp, granularity, intl) {
  if (granularity === 4) {
    return intl.formatMessage({ 
      id: `months.${moment(timestamp).get('month')}`,
    }); 
  } else if (granularity === 3) {
    return intl.formatMessage({ id: 'periods.week' }) + 
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

const getChartAmphiroCategories = function (period) {
  if (period === 'ten') {
    return Array.from({ length: 10 }, (v, i) => `#${i + 1}`);
  } else if (period === 'twenty') {
    return Array.from({ length: 20 }, (v, i) => `#${i + 1}`);
  } else if (period === 'fifty') {
    return Array.from({ length: 50 }, (v, i) => `#${i + 1}`);
  } 
  return [];
};


const getChartTimeData = function (sessions, metric) {
  return sessions.map(session => session[metric] == null ? [] :
                    [new Date(session.timestamp), session[metric]]);
};

// TODO: have to make sure data is ALWAYS fetched in order of ascending ids 
// for amphiro, ascending timestamps for meters

const getChartAmphiroData = function (sessions, xAxisData, metric) {
  if (!Array.isArray(sessions) 
      || !Array.isArray(xAxisData)) {
    throw new Error('Cant\'t create chart. Check provided data and category', sessions, xAxisData);
  }
  if (sessions.length === 0) return [sessions[0]];
  return xAxisData.map((v, i) => sessions.find((s, idx, arr) => (s.id - arr[0].id) === i) || {});
};

const getChartMeterData = function (sessions, xAxisData, metric, time) {
  const period = getLowerGranularityPeriod(convertGranularityToPeriod(time.granularity));
  return xAxisData.map((t) => {
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

    return (bucketSession && bucketSession[metric] != null) ? 
      bucketSession[metric] 
      : null;
  });
};

const getChartMetadata = function (sessions, xAxisData, timeBased = true) {
  if (timeBased) {
    return xAxisData.map((v) => {
      const index = sessions.findIndex(x => moment(x.timestamp).startOf('hour').valueOf() === v);
      return index > -1 ? 
        [sessions[index].id, sessions[index].timestamp] 
        : [];
    });
  }
  return xAxisData.map((v, i, arr) => 
     sessions[i] ? 
       [sessions[i].id, sessions[i].timestamp]
      : [null, null],
  );
};

module.exports = {
  getChartMeterData,
  getChartAmphiroData,
  getChartTimeData,
  getChartMeterCategories,
  getChartMeterCategoryLabels,
  getChartAmphiroCategories,
  getChartMetadata,
  getTimeLabelByGranularity,
  getTimeLabelByGranularityShort,
};
