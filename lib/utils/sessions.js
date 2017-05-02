'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _require = require('./general'),
    getFriendlyDuration = _require.getFriendlyDuration,
    getEnergyClass = _require.getEnergyClass,
    formatMetric = _require.formatMetric;

var _require2 = require('./device'),
    getDeviceTypeByKey = _require2.getDeviceTypeByKey,
    getDeviceNameByKey = _require2.getDeviceNameByKey;

var _require3 = require('./time'),
    getTimeLabelByGranularity = _require3.getTimeLabelByGranularity,
    getPeriodTimeLabel = _require3.getPeriodTimeLabel;

var _require4 = require('../constants/HomeConstants'),
    SHOWERS_PAGE = _require4.SHOWERS_PAGE;

var getSessionsCount = function getSessionsCount(data) {
  return data.map(function (dev) {
    return dev.sessions.length;
  }).reduce(function (p, c) {
    return p + c;
  }, 0);
};

var calculateIndexes = function calculateIndexes(sessions) {
  return sessions.map(function (session, idx, array) {
    return _extends({}, session, {
      prev: array[idx + 1] ? [array[idx + 1].device, array[idx + 1].id, array[idx + 1].timestamp] : null,
      next: array[idx - 1] ? [array[idx - 1].device, array[idx - 1].id, array[idx - 1].timestamp] : null
    });
  });
};

var sortSessions = function sortSessions(psessions) {
  var by = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'timestamp';
  var order = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'desc';

  var sessions = [].concat(_toConsumableArray(psessions));
  var sorted = order === 'asc' ? sessions.sort(function (a, b) {
    return a[by] - b[by];
  }) : sessions.sort(function (a, b) {
    return b[by] - a[by];
  });
  return calculateIndexes(sorted);
};

// reduces array of devices with multiple sessions arrays
// to single array of sessions 
// and prepare for table presentation
var prepareSessionsForTable = function prepareSessionsForTable(devices, data, members, user, granularity, unit, intl) {
  if (!data) return [];
  var sessions = data.map(function (device) {
    var devType = getDeviceTypeByKey(devices, device.deviceKey);
    var sortBy = devType === 'AMPHIRO' ? 'id' : 'timestamp';
    return sortSessions(device.sessions, sortBy, 'asc').map(function (session, idx, array) {
      var diff = array[idx - 1] != null ? array[idx].volume - array[idx - 1].volume : null;
      var member = session.member && session.member.index && Array.isArray(members) ? members.find(function (m) {
        return session.member.index === m.index;
      }) : null;
      return _extends({}, session, {
        real: !session.history,
        index: idx,
        devType: devType,
        device: device.deviceKey,
        deviceName: getDeviceNameByKey(devices, device.deviceKey) || intl.formatMessage({ id: 'devices.meter' }),
        energyClass: getEnergyClass(session.energy),
        percentDiff: diff != null && array[idx - 1].volume !== 0 ? Math.round(10000 * (diff / array[idx - 1].volume)) / 100 : null,
        hasChartData: Array.isArray(session.measurements) && session.measurements.length > 0,
        member: member ? member.name : user,
        date: devType === 'AMPHIRO' ? intl.formatDate(new Date(session.timestamp), {
          weekday: 'short',
          day: 'numeric',
          month: 'numeric',
          year: 'numeric'
        }) : getTimeLabelByGranularity(session.timestamp, granularity, intl)
      });
    });
  }).reduce(function (p, c) {
    return [].concat(_toConsumableArray(p), _toConsumableArray(c));
  }, []);

  if (sessions.length === 0) {
    return [];
  }

  if (granularity !== 0) {
    var minIdx = sessions.reduce(function (imin, c, i, arr) {
      return c.vol <= arr[imin].vol && c.vol !== 0 ? i : imin;
    }, 0);
    sessions[minIdx].min = true;
  }
  var maxIdx = sessions.reduce(function (imax, c, i, arr) {
    return c.vol >= arr[imax].vol ? i : imax;
  }, 0);
  sessions[maxIdx].max = true;
  return sessions;
};

var getSessionIndexById = function getSessionIndexById(sessions, id) {
  if (!id || !sessions || !sessions.length || !sessions[0].id) {
    return null;
  }
  return sessions.findIndex(function (x) {
    return x.id.toString() === id.toString();
  });
};

var updateOrAppendToSession = function updateOrAppendToSession(devices, data) {
  var id = data.id;


  var updated = devices.slice();
  if (!data || !id) return devices;

  var devIdx = devices.findIndex(function (d) {
    return d.deviceKey === data.deviceKey;
  });
  if (devIdx === -1) return updated;

  var sessions = updated[devIdx].sessions.slice();
  if (!sessions || !sessions.length) return null;

  var index = getSessionIndexById(sessions, id);
  if (index > -1) {
    sessions[index] = data;
  } else {
    sessions.push(data);
  }
  updated[devIdx] = _extends({}, updated[devIdx], { sessions: sessions });
  return updated;
};

var getShowerById = function getShowerById(data, id) {
  if (!data || !Array.isArray(data.sessions)) {
    return null;
  }
  return data.sessions.find(function (session) {
    return session.id === id;
  });
};

var reduceMetric = function reduceMetric(data, metric) {
  var average = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  if (!data || !metric) return 0;
  var sessions = getSessionsCount(data);

  var reducedMetric = data.map(function (d) {
    return d.sessions.map(function (it) {
      return it[metric] ? it[metric] : 0;
    }).reduce(function (p, c) {
      return p + c;
    }, 0);
  }).reduce(function (p, c) {
    return p + c;
  }, 0);

  if (average) return reducedMetric / sessions;
  return reducedMetric;
};

var getSessionById = function getSessionById(sessions, id) {
  if (!id || !sessions || !sessions.length || !sessions[0].id) {
    return null;
  }
  return sessions.find(function (x) {
    return x.id.toString() === id.toString();
  });
};

var getShowerRange = function getShowerRange(sessions) {
  if (!Array.isArray(sessions)) {
    console.error('sessions must be array in getShowerRange', sessions);
    return {};
  }
  return {
    first: sessions[0] ? sessions[0].id : null,
    last: sessions[sessions.length - 1] ? sessions[sessions.length - 1].id : null
  };
};

var getLastShowerIdFromMultiple = function getLastShowerIdFromMultiple(data) {
  return Math.max.apply(Math, _toConsumableArray(data.map(function (device) {
    return Array.isArray(device.sessions) ? device.sessions.length : 0;
  })));
};

var filterShowers = function filterShowers(data, chunk, idx) {
  var index = Math.floor(chunk * idx % SHOWERS_PAGE / chunk);

  return data.map(function (device) {
    var from = device.sessions.length + chunk * (index - 1);
    var to = device.sessions.length + chunk * index - 1;

    var sessions = device.sessions.filter(function (session, i, arr) {
      return i >= from && i <= to;
    });

    var first = sessions[0] && sessions[0].id;
    var last = sessions[sessions.length - 1] && sessions[sessions.length - 1].id;
    return _extends({}, device, {
      range: {
        first: first,
        last: last
      },
      sessions: sessions
    });
  });
};

var hasShowersAfter = function hasShowersAfter(index) {
  return index < 0;
};

var hasShowersBefore = function hasShowersBefore(data) {
  if (!Array.isArray(data) || !data[0] || !data[0].range || !data[0].range.first) return false;
  return data.reduce(function (p, c) {
    return c.range.first !== 1 && c.range.first != null ? c.range.first : p;
  }, null) != null;
};

var prepareBreakdownSessions = function prepareBreakdownSessions(data, metric, breakdown, user, time, timeFilter, intl) {
  var total = reduceMetric(data, metric);
  return breakdown.map(function (item) {
    var id = String(item.label).toLowerCase().replace(' ', '-');
    var title = intl.formatMessage({ id: 'breakdown.' + id });
    return {
      id: id,
      devType: title,
      title: title,
      volume: Math.round(total * (item.percent / 100)),
      member: user,
      date: getPeriodTimeLabel(time, timeFilter, intl)
    };
  });
};

var getAugmental = function getAugmental(array) {
  return array.map(function (x, i, arr) {
    return x !== null ? arr.filter(function (y, j) {
      return j <= i;
    }).reduce(function (p, c) {
      return p + c;
    }, 0) : null;
  });
};

// TODO: take into consideration days that are between price brackets
var getCurrentMeasurementCost = function getCurrentMeasurementCost(volume, pTotal, brackets) {
  var curr = brackets.find(function (bracket) {
    return pTotal / 1000 >= bracket.minVolume && (bracket.maxVolume === null || pTotal / 1000 < bracket.maxVolume);
  });
  return curr ? Math.round(curr.price * (volume / 1000) * 1000) / 1000 : 0;
};

var preparePricingSessions = function preparePricingSessions(sessions, brackets, granularity, user, intl) {
  return sortSessions(sessions, 'timestamp', 'asc').map(function (session, i, arr) {
    var totalVolume = arr.filter(function (x, j) {
      return j <= i;
    }).map(function (x) {
      return x.volume;
    }).reduce(function (p, c) {
      return p + c;
    }, 0);

    var diff = arr[i - 1] != null ? arr[i].volume - arr[i - 1].volume : null;
    return _extends({}, session, {
      total: totalVolume,
      percentDiff: diff != null && arr[i - 1].volume !== 0 ? Math.round(10000 * (diff / arr[i - 1].volume)) / 100 : null,
      cost: getCurrentMeasurementCost(session.volume, totalVolume, brackets),
      date: getTimeLabelByGranularity(session.timestamp, granularity, intl)
    });
  });
};
var getAllMembers = function getAllMembers(members, firstname) {
  return members.filter(function (member) {
    return member.active || member.index === 0;
  });
};

var filterDataByDeviceKeys = function filterDataByDeviceKeys(data, deviceKeys) {
  if (deviceKeys == null) return data;
  return data.filter(function (x) {
    return deviceKeys.findIndex(function (k) {
      return k === x.deviceKey;
    }) > -1;
  });
};

module.exports = {
  getSessionById: getSessionById,
  updateOrAppendToSession: updateOrAppendToSession,
  prepareSessionsForTable: prepareSessionsForTable,
  sortSessions: sortSessions,
  reduceMetric: reduceMetric,
  getSessionsCount: getSessionsCount,
  getShowerById: getShowerById,
  getShowerRange: getShowerRange,
  filterShowers: filterShowers,
  getLastShowerIdFromMultiple: getLastShowerIdFromMultiple,
  hasShowersBefore: hasShowersBefore,
  hasShowersAfter: hasShowersAfter,
  getAugmental: getAugmental,
  prepareBreakdownSessions: prepareBreakdownSessions,
  preparePricingSessions: preparePricingSessions,
  filterDataByDeviceKeys: filterDataByDeviceKeys
};