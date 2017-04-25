const moment = require('moment');

const last24Hours = function (timestamp) {
  return {
    startDate: moment(timestamp).subtract(24, 'hours').valueOf(),
    endDate: timestamp,
    granularity: 0,
  };
};

const getDay = function (timestamp = moment().valueOf()) {
  return {
    startDate: moment(timestamp).startOf('day').valueOf(),
    endDate: moment(timestamp).endOf('day').valueOf(),
    granularity: 0,
  };
};

const getWeek = function (timestamp = moment().valueOf()) {
  return {
    startDate: moment(timestamp).startOf('isoweek').valueOf(),
    endDate: moment(timestamp).endOf('isoweek').valueOf(),
    granularity: 2,
  };
};
const getMonth = function (timestamp = moment().valueOf()) {
  return {
    startDate: moment(timestamp).startOf('month').valueOf(),
    endDate: moment(timestamp).endOf('month').valueOf(),
    granularity: 2,
  };
};

const getYear = function (timestamp = moment().valueOf()) {
  return {
    startDate: moment(timestamp).startOf('year').valueOf(),
    endDate: moment(timestamp).endOf('year').valueOf(),
    granularity: 4,
  };
};

const lastSixMonths = function (timestamp = moment().valueOf()) {
  return {
    startDate: moment(timestamp).subtract(6, 'month').startOf('month').valueOf(),
    endDate: moment(timestamp).endOf('month').valueOf(),
    granularity: 4,
  };
};

const convertPeriodToGranularity = function (period) {
  if (period === 'year') return 4;
  else if (period === 'month') return 2;
  else if (period === 'week') return 2;
  else if (period === 'day') return 0;
  return 0;
};

const convertGranularityToPeriod = function (granularity) {
  if (granularity === 4) return 'year';
  else if (granularity === 3) return 'month'; // (period === 'month') return 3;
  else if (granularity === 2) return 'week'; // (period === 'week') return 2;
  else if (granularity === 1 || granularity === 0) return 'day'; // (period === 'day') return 0;
  return 'day';
};

const getLowerGranularityPeriod = function (period) {
  if (period === 'year') return 'month';
  else if (period === 'month') return 'day';
  else if (period === 'week') return 'day';
  else if (period === 'day') return 'hour';
  return null;
};

const getTimeByPeriod = function (period, index) {
  if (period === 'year') return getYear(moment().add(index, period).valueOf());
  else if (period === 'month') return getMonth(moment().add(index, period).valueOf());
  else if (period === 'week') return getWeek(moment().add(index, period).valueOf());
  else if (period === 'day') return getDay(moment().add(index, period).valueOf());
  return {};
};

const getPeriod = function (period, timestamp = moment().valueOf()) {
  return {
    startDate: moment().startOf(period).valueOf(),
    endDate: moment(timestamp).endOf(period).valueOf(),
    granularity: convertPeriodToGranularity(period),
  };
};

// get Start or End of iso week instead of week to start from monday
const getNextPeriod = function (period, timestamp = moment().valueOf()) {
  const sPeriod = period === 'week' ? 'isoweek' : period;
  return {
    startDate: moment(timestamp)
    .add(1, period)
    .startOf(sPeriod)
    .valueOf(),
    endDate: moment(timestamp)
    .add(1, period)
    .endOf(sPeriod)
    .valueOf(),
    granularity: convertPeriodToGranularity(period),
  };
};

const getPreviousPeriod = function (period, timestamp = moment().valueOf()) {
  const sPeriod = period === 'week' ? 'isoweek' : period;
  return {
    startDate: moment(timestamp)
    .subtract(1, period)
    .startOf(sPeriod)
    .valueOf(),
    endDate: moment(timestamp)
    .subtract(1, period)
    .endOf(sPeriod)
    .valueOf(),
    granularity: convertPeriodToGranularity(period),
  };
};

const getPreviousPeriodSoFar = function (period, timestamp = moment().valueOf()) {
  const sPeriod = period === 'week' ? 'isoweek' : period;
  return {
    startDate: moment(timestamp)
    .subtract(1, period)
    .startOf(sPeriod)
    .valueOf(),
    // ends later than now ?
    endDate: moment(timestamp).endOf(period).valueOf() > moment().valueOf() ? 
      moment()
      .subtract(1, period)
      .valueOf() 
      :
      moment(timestamp)
      .subtract(1, period)
      .endOf(sPeriod)
      .valueOf(),
    granularity: convertPeriodToGranularity(period),
  };
};


const defaultFormatter = function (timestamp) {
  const date = new Date(timestamp);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

const selectTimeFormatter = function (key, intl) {
  switch (key) {
    case 'always':
      return x => intl.formatDate(x);
    case 'year':
      return x => intl.formatDate(x, { 
        day: 'numeric', month: 'long', year: 'numeric',
      });
    case 'month':
      return x => intl.formatDate(x, { day: 'numeric', month: 'short' });
    case 'week':
      return x => intl.formatMessage({ id: `weekdays.${(new Date(x).getDay() + 1).toString()}` });
    case 'day':
      return x => intl.formatTime(x, { hour: 'numeric', minute: 'numeric' });
    default:
      return x => intl.formatDate(x);
  }
};

const getLastPeriod = function (period, timestamp) {
  return moment(timestamp).subtract(period, 1).valueOf();
};

const getComparisonPeriod = function (timestamp, period, intl) {
  const last = getLastPeriod(period, timestamp);
  if (period === 'year') {
    return moment(last).get('year').toString();
  } else if (period === 'month') {
    //return _t(`months.${moment(last).get('month')}`); 
    return intl.formatDate(new Date(timestamp), { month: 'long' }); 
  } else if (period === 'week') {
    return `${intl.formatMessage({ id: 'periods.week' })} ${moment(last).get('isoweek')}`;
  } else if (period === 'day') {
    //return _t(`weekdays.${moment(last).get('day')}`);
    return intl.formatDate(new Date(timestamp), { weekday: 'long' }); 
  }
  return null;
};

const getLastShowerTime = function () {
  return {
    startDate: moment().subtract(3, 'month').valueOf(),
    endDate: moment().valueOf(),
    granularity: 0,
  };
};

const getGranularityByDiff = function (start, end) {
  const diff = moment.duration(end - start);

  const years = diff.years(); 
  const months = diff.months();
  const days = diff.days();

  if (years > 0 || months > 5) return 4;
  else if (years === 0 && months <= 5 && days > 1) return 2;
  return 1;
};

const timeToBuckets = function (time) {
  if (time == null) return [];
  const { startDate, endDate, granularity } = time;
  if (startDate == null || endDate == null || granularity == null) {
    return [];
  }
  const period = getLowerGranularityPeriod(convertGranularityToPeriod(granularity));
  const aggrPeriod = period === 'hour' ? 'hour' : 'day';
  
  const bucketCount = moment(endDate).add(1, 'second').diff(moment(startDate), period);

  const buckets = [];
  let x = moment(startDate);
  Array.from({ length: bucketCount }, (y, i) => i).forEach((it, i) => {
    const t = x.endOf(period === 'week' ? 'isoweek' : period).startOf(aggrPeriod);
    buckets.push(t.valueOf());
    x = t.endOf(aggrPeriod).add(1, 'second').clone();
  });

  /*
  for (let i = 0; i < bucketCount; i + 1) {
    const t = x.endOf(period === 'week' ? 'isoweek' : period).startOf(aggrPeriod);
    buckets.push(t.valueOf());
    x = t.endOf(aggrPeriod).add(1, 'second').clone();
    }
    */
  return buckets;
};

const bringPastSessionsToPresent = function (sessions, period) {
  return sessions.map(session => ({
    ...session, 
    timestamp: period === 'month' ? 
      moment(session.timestamp)
      .add(1, period)
      .startOf(getLowerGranularityPeriod(period)).valueOf() 
      : 
      moment(session.timestamp)
      .add(1, period).valueOf(), 
  }));
};

const getTimeLabelByGranularity = function (timestamp, granularity, intl) {
    if (granularity === 5) {
      return intl.formatDate(new Date(timestamp), { year: 'numeric' }); 
    } else if (granularity === 4) {
      return intl.formatDate(new Date(timestamp), { year: 'numeric', month: 'long' }); 
  } else if (granularity === 3) {
    return intl.formatMessage({ id: 'periods.week' }) + 
      ' ' +
      moment(timestamp).get('isoweek') + 
      intl.formatDate(new Date(timestamp), { year: 'numeric', month: 'long' }); 
  } else if (granularity === 2) {
    return intl.formatDate(new Date(timestamp), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); 
  } 
  return intl.formatDate(new Date(timestamp), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' }); 
};

const getPeriodTimeLabel = function (timestamp, period, intl) {
  let granularity = convertPeriodToGranularity(period) + 1;
  if (period === 'month') granularity = 4;
  
  return getTimeLabelByGranularity(timestamp, granularity, intl);
};

const getTimeLabelByGranularityShort = function (timestamp, granularity, period, intl) {
  if (granularity === 4) {
    return intl.formatDate(new Date(timestamp), { month: 'short' });
  } else if (granularity === 3 && period === 'month') {
    return intl.formatMessage({ id: 'periods.week' }) + 
      ' ' +
      moment(timestamp).get('isoweek');
  } else if (granularity === 2 && (period === 'month' || period === 'custom')) {
    return intl.formatDate(new Date(timestamp), { day: 'numeric', month: 'numeric' }); 
  } else if (granularity === 2) {
    return intl.formatDate(new Date(timestamp), { weekday: 'short' });
  } else if (granularity === 1 || granularity === 0) { 
    return intl.formatDate(new Date(timestamp), { hour: 'numeric', minute: 'numeric' }); 
  }
  return ' ';
};

const convertOldTimeObject = function (time) {
  return {
    type: 'ABSOLUTE',
    start: time.startDate,
    end: time.endDate,
    granularity: getLowerGranularityPeriod(
      convertGranularityToPeriod(time.granularity)
    ),
  };
};

module.exports = {
  defaultFormatter,
  selectTimeFormatter,
  last24Hours,
  getDay,
  getWeek,
  getMonth,
  getYear,
  lastSixMonths,
  getPeriod,
  getNextPeriod,
  getPreviousPeriod,
  getPreviousPeriodSoFar,
  getTimeByPeriod,
  convertGranularityToPeriod,
  getGranularityByDiff,
  getLastShowerTime,
  getLastPeriod,
  timeToBuckets,
  getLowerGranularityPeriod,
  bringPastSessionsToPresent,
  getComparisonPeriod,
  getTimeLabelByGranularity,
  getTimeLabelByGranularityShort,
  getPeriodTimeLabel,
  convertOldTimeObject,
};
