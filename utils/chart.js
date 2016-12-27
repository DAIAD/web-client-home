const moment = require('moment');
const { convertGranularityToPeriod, getLowerGranularityPeriod, timeToBuckets } = require('./time');

// TODO: commented out unused functions
/*
const getCount = function (metrics) {
  return metrics.count?metrics.count:1;
};

const getTimestampIndex = function (points, timestamp) {
    return points.findIndex((x) => (x[0]===timestamp));
};
*/


// TODO: complete this±
/*
const getChartMeterCategories = function (time) {
  if (period === 'year') {
    return Array.from({length: 12}, (v, i) => i);
  } else if (period === 'month') {
    return Array.from({length: 4}, (v, i) => i);
  } else if (period === 'week') {
    return Array.from({length: 7}, (v, i) => i);
  } else if (period === 'day') {
    return Array.from({length: 24}, (v, i) => i);
  }
  return [];
};
*/
/*
   
const getChartMeterCategories = function (period, intl) {
  if (period === 'year') {
    //    return Array.from({length: 12}, (v, i) => i);
    return Array.from({length: 12}, (v, i) => intl.formatMessage({id:`months.${i}`}));
  } else if (period === 'month') {
    //    return Array.from({length: 4}, (v, i) => i);
     return Array.from({length: 4}, (v, i) => `Week ${i+1}`);
  } else if (period === 'week') {
    //    return Array.from({length: 7}, (v, i) => i);
    return Array.from({length: 7}, (v, i) => intl.formatMessage({id: `weekdays.${i}`}));
  } else if (period === 'day') {
    //    return Array.from({length: 24}, (v, i) => i);
    return Array.from({length: 24}, (v, i) => `${i}:00`);
  }
  return [];
};
*/

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
    return Array.from({ length: 10 }, (v, i) => `#${10 - i}`);
  } else if (period === 'twenty') {
    return Array.from({ length: 20 }, (v, i) => `#${20 - i}`);
  } else if (period === 'fifty') {
    return Array.from({ length: 50 }, (v, i) => `#${50 - i}`);
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
  return xAxisData.map((v, i, arr) => 
   (i >= (arr.length - sessions.length)) 
   && sessions[i - (arr.length - sessions.length)] ? 
     sessions[i - (arr.length - sessions.length)][metric] 
     : null,
   );
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
    (i >= (arr.length - sessions.length)) 
    && sessions[i - (arr.length - sessions.length)] ? 
    [sessions[i - (arr.length - sessions.length)].id, 
      sessions[i - (arr.length - sessions.length)].timestamp] 
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
