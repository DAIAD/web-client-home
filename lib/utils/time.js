'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var moment = require('moment');

var last24Hours = function last24Hours(timestamp) {
  return {
    startDate: moment(timestamp).subtract(24, 'hours').valueOf(),
    endDate: timestamp,
    granularity: 0
  };
};

var getDay = function getDay() {
  var timestamp = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : moment().valueOf();

  return {
    startDate: moment(timestamp).startOf('day').valueOf(),
    endDate: moment(timestamp).endOf('day').valueOf(),
    granularity: 0
  };
};

var getWeek = function getWeek() {
  var timestamp = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : moment().valueOf();

  return {
    startDate: moment(timestamp).startOf('isoweek').valueOf(),
    endDate: moment(timestamp).endOf('isoweek').valueOf(),
    granularity: 2
  };
};
var getMonth = function getMonth() {
  var timestamp = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : moment().valueOf();

  return {
    startDate: moment(timestamp).startOf('month').valueOf(),
    endDate: moment(timestamp).endOf('month').valueOf(),
    granularity: 2
  };
};

var getYear = function getYear() {
  var timestamp = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : moment().valueOf();

  return {
    startDate: moment(timestamp).startOf('year').valueOf(),
    endDate: moment(timestamp).endOf('year').valueOf(),
    granularity: 4
  };
};

var lastSixMonths = function lastSixMonths() {
  var timestamp = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : moment().valueOf();

  return {
    startDate: moment(timestamp).subtract(6, 'month').startOf('month').valueOf(),
    endDate: moment(timestamp).endOf('month').valueOf(),
    granularity: 4
  };
};

var convertPeriodToGranularity = function convertPeriodToGranularity(period) {
  if (period === 'year') return 4;else if (period === 'month') return 2;else if (period === 'week') return 2;else if (period === 'day') return 0;
  return 0;
};

var convertGranularityToPeriod = function convertGranularityToPeriod(granularity) {
  if (granularity === 4) return 'year';else if (granularity === 3) return 'month'; // (period === 'month') return 3;
  else if (granularity === 2) return 'week'; // (period === 'week') return 2;
    else if (granularity === 1 || granularity === 0) return 'day'; // (period === 'day') return 0;
  return 'day';
};

var getLowerGranularityPeriod = function getLowerGranularityPeriod(period) {
  if (period === 'year') return 'month';else if (period === 'month') return 'day';else if (period === 'week') return 'day';else if (period === 'day') return 'hour';
  return null;
};

var getTimeByPeriod = function getTimeByPeriod(period, index) {
  if (period === 'year') return getYear(moment().add(index, period).valueOf());else if (period === 'month') return getMonth(moment().add(index, period).valueOf());else if (period === 'week') return getWeek(moment().add(index, period).valueOf());else if (period === 'day') return getDay(moment().add(index, period).valueOf());
  return {};
};

var getPeriod = function getPeriod(period) {
  var timestamp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : moment().valueOf();

  return {
    startDate: moment().startOf(period).valueOf(),
    endDate: moment(timestamp).endOf(period).valueOf(),
    granularity: convertPeriodToGranularity(period)
  };
};

// get Start or End of iso week instead of week to start from monday
var getNextPeriod = function getNextPeriod(period) {
  var timestamp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : moment().valueOf();

  var sPeriod = period === 'week' ? 'isoweek' : period;
  return {
    startDate: moment(timestamp).add(1, period).startOf(sPeriod).valueOf(),
    endDate: moment(timestamp).add(1, period).endOf(sPeriod).valueOf(),
    granularity: convertPeriodToGranularity(period)
  };
};

var getPreviousPeriod = function getPreviousPeriod(period) {
  var timestamp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : moment().valueOf();

  var sPeriod = period === 'week' ? 'isoweek' : period;
  return {
    startDate: moment(timestamp).subtract(1, period).startOf(sPeriod).valueOf(),
    endDate: moment(timestamp).subtract(1, period).endOf(sPeriod).valueOf(),
    granularity: convertPeriodToGranularity(period)
  };
};

var getPreviousPeriodSoFar = function getPreviousPeriodSoFar(period) {
  var timestamp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : moment().valueOf();

  var sPeriod = period === 'week' ? 'isoweek' : period;
  return {
    startDate: moment(timestamp).subtract(1, period).startOf(sPeriod).valueOf(),
    // ends later than now ?
    endDate: moment(timestamp).endOf(period).valueOf() > moment().valueOf() ? moment().subtract(1, period).valueOf() : moment(timestamp).subtract(1, period).endOf(sPeriod).valueOf(),
    granularity: convertPeriodToGranularity(period)
  };
};

var defaultFormatter = function defaultFormatter(timestamp) {
  var date = new Date(timestamp);
  return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
};

var selectTimeFormatter = function selectTimeFormatter(key, intl) {
  switch (key) {
    case 'always':
      return function (x) {
        return intl.formatDate(x);
      };
    case 'year':
      return function (x) {
        return intl.formatDate(x, {
          day: 'numeric', month: 'long', year: 'numeric'
        });
      };
    case 'month':
      return function (x) {
        return intl.formatDate(x, { day: 'numeric', month: 'short' });
      };
    case 'week':
      return function (x) {
        return intl.formatMessage({ id: 'weekdays.' + (new Date(x).getDay() + 1).toString() });
      };
    case 'day':
      return function (x) {
        return intl.formatTime(x, { hour: 'numeric', minute: 'numeric' });
      };
    default:
      return function (x) {
        return intl.formatDate(x);
      };
  }
};

var getLastPeriod = function getLastPeriod(period, timestamp) {
  return moment(timestamp).subtract(period, 1).valueOf();
};

var getComparisonPeriod = function getComparisonPeriod(timestamp, period, intl) {
  var last = getLastPeriod(period, timestamp);
  if (period === 'year') {
    return intl.formatDate(last, { year: 'numeric' });
  } else if (period === 'month') {
    return intl.formatDate(last, { month: 'long' });
  } else if (period === 'week') {
    return intl.formatMessage({ id: 'periods.week' }) + ' ' + moment(last).get('isoweek');
  } else if (period === 'day') {
    return intl.formatDate(last, { weekday: 'long' });
  }
  return null;
};

var getLastShowerTime = function getLastShowerTime() {
  return {
    startDate: moment().subtract(3, 'month').valueOf(),
    endDate: moment().valueOf(),
    granularity: 0
  };
};

var getGranularityByDiff = function getGranularityByDiff(start, end) {
  var diff = moment.duration(end - start);

  var years = diff.years();
  var months = diff.months();
  var days = diff.days();

  if (years > 0 || months > 5) return 4;else if (years === 0 && months <= 5 && days > 1) return 2;
  return 1;
};

var timeToBuckets = function timeToBuckets(time) {
  if (time == null) return [];
  var startDate = time.startDate,
      endDate = time.endDate,
      granularity = time.granularity;

  if (startDate == null || endDate == null || granularity == null) {
    return [];
  }
  var period = getLowerGranularityPeriod(convertGranularityToPeriod(granularity));
  var aggrPeriod = period === 'hour' ? 'hour' : 'day';

  var bucketCount = moment(endDate).add(1, 'second').diff(moment(startDate), period);

  var buckets = [];
  var x = moment(startDate);
  Array.from({ length: bucketCount }, function (y, i) {
    return i;
  }).forEach(function (it, i) {
    var t = x.endOf(period === 'week' ? 'isoweek' : period).startOf(aggrPeriod);
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

var bringPastSessionsToPresent = function bringPastSessionsToPresent(sessions, period) {
  return sessions.map(function (session) {
    return _extends({}, session, {
      timestamp: period === 'month' ? moment(session.timestamp).add(1, period).startOf(getLowerGranularityPeriod(period)).valueOf() : moment(session.timestamp).add(1, period).valueOf()
    });
  });
};

var getTimeLabelByGranularity = function getTimeLabelByGranularity(timestamp, granularity, intl) {
  if (granularity === 5) {
    return intl.formatDate(new Date(timestamp), { year: 'numeric' });
  } else if (granularity === 4) {
    return intl.formatDate(new Date(timestamp), { year: 'numeric', month: 'long' });
  } else if (granularity === 3) {
    return intl.formatMessage({ id: 'periods.week' }) + ' ' + moment(timestamp).get('isoweek') + intl.formatDate(new Date(timestamp), { year: 'numeric', month: 'long' });
  } else if (granularity === 2) {
    return intl.formatDate(new Date(timestamp), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }
  return intl.formatDate(new Date(timestamp), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' });
};

var getPeriodTimeLabel = function getPeriodTimeLabel(timestamp, period, intl) {
  var granularity = convertPeriodToGranularity(period) + 1;
  if (period === 'month') granularity = 4;

  return getTimeLabelByGranularity(timestamp, granularity, intl);
};

var getTimeLabelByGranularityShort = function getTimeLabelByGranularityShort(timestamp, granularity, period, intl) {
  if (granularity === 4) {
    return intl.formatDate(new Date(timestamp), { month: 'short' });
  } else if (granularity === 3 && period === 'month') {
    return intl.formatMessage({ id: 'periods.week' }) + ' ' + moment(timestamp).get('isoweek');
  } else if (granularity === 2 && (period === 'month' || period === 'custom')) {
    return intl.formatDate(new Date(timestamp), { day: 'numeric', month: 'numeric' });
  } else if (granularity === 2) {
    return intl.formatDate(new Date(timestamp), { weekday: 'short' });
  } else if (granularity === 1 || granularity === 0) {
    return intl.formatDate(new Date(timestamp), { hour: 'numeric', minute: 'numeric' });
  }
  return ' ';
};

var convertOldTimeObject = function convertOldTimeObject(time) {
  return {
    type: 'ABSOLUTE',
    start: time.startDate,
    end: time.endDate,
    granularity: getLowerGranularityPeriod(convertGranularityToPeriod(time.granularity))
  };
};

module.exports = {
  defaultFormatter: defaultFormatter,
  selectTimeFormatter: selectTimeFormatter,
  last24Hours: last24Hours,
  getDay: getDay,
  getWeek: getWeek,
  getMonth: getMonth,
  getYear: getYear,
  lastSixMonths: lastSixMonths,
  getPeriod: getPeriod,
  getNextPeriod: getNextPeriod,
  getPreviousPeriod: getPreviousPeriod,
  getPreviousPeriodSoFar: getPreviousPeriodSoFar,
  getTimeByPeriod: getTimeByPeriod,
  convertGranularityToPeriod: convertGranularityToPeriod,
  getGranularityByDiff: getGranularityByDiff,
  getLastShowerTime: getLastShowerTime,
  getLastPeriod: getLastPeriod,
  timeToBuckets: timeToBuckets,
  getLowerGranularityPeriod: getLowerGranularityPeriod,
  bringPastSessionsToPresent: bringPastSessionsToPresent,
  getComparisonPeriod: getComparisonPeriod,
  getTimeLabelByGranularity: getTimeLabelByGranularity,
  getTimeLabelByGranularityShort: getTimeLabelByGranularityShort,
  getPeriodTimeLabel: getPeriodTimeLabel,
  convertOldTimeObject: convertOldTimeObject
};