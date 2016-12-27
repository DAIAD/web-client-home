const moment = require('moment');

const last24Hours = function (timestamp) {
  return {
    startDate: moment(timestamp).subtract(24, 'hours').valueOf(),
    endDate: timestamp,
    granularity: 0,
  };
};

const today = function () {
  return {
    startDate: moment().startOf('day').valueOf(),
    endDate: moment().endOf('day').valueOf(),
    granularity: 0,
  };
};

const thisWeek = function () {
  return {
    startDate: moment().startOf('isoweek').valueOf(),
    endDate: moment().endOf('isoweek').valueOf(),
    granularity: 2,
  };
};
const thisMonth = function () {
  return {
    startDate: moment().startOf('month').valueOf(),
    endDate: moment().endOf('month').valueOf(),
    granularity: 3,
  };
};

const thisYear = function () {
  return {
    startDate: moment().startOf('year').valueOf(),
    endDate: moment().endOf('year').valueOf(),
    granularity: 4,
  };
};

const convertPeriodToGranularity = function (period) {
  if (period === 'year') return 4;
  else if (period === 'month') return 3;
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
  else if (period === 'month') return 'week';
  else if (period === 'week') return 'day';
  else if (period === 'day') return 'hour';
  throw new Error('error in get lower granularity period with', period);
};

const getTimeByPeriod = function (period) {
  if (period === 'year') return thisYear();
  else if (period === 'month') return thisMonth();
  else if (period === 'week') return thisWeek();
  else if (period === 'day') return today();
  return {};
  //throw new Error(`Period unrecognized ${period}`);
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
    .startOf(sPeriod)
    .add(1, period).valueOf(),
    endDate: moment(timestamp)
    .endOf(sPeriod)
    .add(1, period).valueOf(),
    granularity: convertPeriodToGranularity(period),
  };
};

const getPreviousPeriod = function (period, timestamp = moment().valueOf()) {
  const sPeriod = period === 'week' ? 'isoweek' : period;
  return {
    startDate: moment(timestamp)
    .startOf(sPeriod)
    .subtract(1, period).valueOf(),
    endDate: moment(timestamp)
    .endOf(sPeriod)
    .subtract(1, period).valueOf(),
    granularity: convertPeriodToGranularity(period),
  };
};

const getPreviousPeriodSoFar = function (period, timestamp = moment().valueOf()) {
  const sPeriod = period === 'week' ? 'isoweek' : period;
  return {
    startDate: moment(timestamp)
    .startOf(sPeriod)
    .subtract(1, period).valueOf(),
    endDate: moment(timestamp)
    .endOf(getLowerGranularityPeriod(period))
    .subtract(1, period).valueOf(),
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

const getComparisonPeriod = function (timestamp, granularity, intl) {
  const last = getLastPeriod(convertGranularityToPeriod(granularity), timestamp);
  if (granularity === 4) {
    return moment(last).get('year').toString();
  } else if (granularity === 3) {
    return intl.formatMessage({ id: `months.${moment(last).get('month')}` }); 
  } else if (granularity === 2) {
    return `${intl.formatMessage({ id: 'periods.week' })} ${moment(last).get('isoweek')}`;
  }
  return intl.formatMessage({ id: `weekdays.${moment(last).get('day')}` });
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

  if (years > 0 || months > 6) return 4;
  else if (months > 0) return 3;
  else if (days > 0) return 2;
  return 0;
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

const addPeriodToSessions = function (sessions, period) {
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

module.exports = {
  defaultFormatter,
  selectTimeFormatter,
  last24Hours,
  today,
  thisWeek,
  thisMonth,
  thisYear,
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
  addPeriodToSessions,
  getComparisonPeriod,
};
