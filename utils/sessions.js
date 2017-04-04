const { getFriendlyDuration, getEnergyClass, energyToPower } = require('./general');
const { getDeviceTypeByKey, getDeviceNameByKey } = require('./device');
const { getComparisonPeriod, getTimeLabelByGranularity, getPeriodTimeLabel } = require('./time');

const { VOLUME_BOTTLE, VOLUME_BUCKET, VOLUME_POOL, ENERGY_BULB, ENERGY_HOUSE, ENERGY_CITY, SHOWERS_PAGE } = require('../constants/HomeConstants');

const getSessionsCount = function (devices, data) {
  return data.map(dev => dev.sessions.length).reduce((p, c) => p + c, 0);
};

// reduces array of devices with multiple sessions arrays
// to single array of sessions 
// and prepare for table presentation
const prepareSessionsForTable = function (devices, data, members, user, granularity, intl) {
  if (!devices || !data) return [];
  const sessions = data.map(device => device.sessions 
                  .map((session, idx, array) => {
                    const devType = getDeviceTypeByKey(devices, device.deviceKey);
                    const vol = 'volume'; 
                    const diff = array[idx - 1] != null ? (array[idx][vol] - array[idx - 1][vol]) : null;
                    const member = session.member && session.member.index && Array.isArray(members) ? members.find(m => session.member.index === m.index) : null;
                    return {
                      ...session,
                      real: !session.history,
                      index: idx, 
                      devType,
                      vol: session.volume,
                      device: device.deviceKey,
                      devName: getDeviceNameByKey(devices, device.deviceKey) || 'SWM',
                      duration: session.duration ? Math.floor(session.duration / 60) : null,
                      friendlyDuration: getFriendlyDuration(session.duration), 
                      temperature: session.temperature ? 
                        Math.round(session.temperature * 10) / 10 
                        : null,
                      energy: session.energy ? Math.round((session.energy / 1000) * 100) / 100 : null,
                      energyClass: getEnergyClass(session.energy), 
                      percentDiff: (diff != null && array[idx - 1][vol] !== 0) ? 
                        Math.round(10000 * (diff / array[idx - 1][vol])) / 100 
                        : null,
                      hasChartData: Array.isArray(session.measurements) && 
                        session.measurements.length > 0,
                      member: member ? member.name : user,
                      date: getTimeLabelByGranularity(session.timestamp, 
                                                      granularity, 
                                                      intl
                                                     ),
                    };
                  }))
                .reduce((p, c) => [...p, ...c], []);
                
  if (sessions.length === 0) { return []; }
  
  if (granularity !== 0) {
    const minIdx = sessions.reduce((imin, c, i, arr) => c.vol <= arr[imin].vol && c.vol !== 0 ? i : imin, 0);
    sessions[minIdx].min = true;
  }
  const maxIdx = sessions.reduce((imax, c, i, arr) => c.vol >= arr[imax].vol ? i : imax, 0);
  sessions[maxIdx].max = true;
  return sessions;
};

const getSessionIndexById = function (sessions, id) {
  if (!id || !sessions || !sessions.length || !sessions[0].id) {
    return null;
  }
  return sessions.findIndex(x => (x.id).toString() === id.toString());
};

const updateOrAppendToSession = function (devices, data) {
  const { id } = data;

  const updated = devices.slice();
  if (!data || !id) return devices;

  const devIdx = devices.findIndex(d => d.deviceKey === data.deviceKey);
  if (devIdx === -1) return updated;

  const sessions = updated[devIdx].sessions.slice();
  if (!sessions || !sessions.length) return null;
  
  const index = getSessionIndexById(sessions, id);
  if (index > -1) {
    sessions[index] = data;
  } else {
    sessions.push(data);
  }
  updated[devIdx] = { ...updated[devIdx], sessions };
  return updated;
};

const getShowerById = function (data, id) {
  if (!data || !Array.isArray(data.sessions)) {
    return null;
  }
  return data.sessions.find(session => session.id === id);
};

const reduceMetric = function (devices, data, metric, average = false) {
  if (!devices || !data || !metric) return 0;
  const sessions = getSessionsCount(devices, data);

  let reducedMetric = data
  .map(d => d.sessions 
       .map(it => it[metric] ? it[metric] : 0)
       .reduce(((p, c) => p + c), 0)
  )
  .reduce(((p, c) => p + c), 0);

  //if (metric === 'temperature') {
  if (metric === 'temperature' || average) {
    reducedMetric /= sessions;
  } else if (metric === 'duration') {
    reducedMetric = (reducedMetric / sessions) / 60;
  } else if (metric === 'energy') {
    reducedMetric /= 1000;
  }

  if (metric === 'cost') {
    reducedMetric = !isNaN(reducedMetric) ? (Math.round(reducedMetric * 100) / 100) : 0;
  } else {
    reducedMetric = !isNaN(reducedMetric) ? (Math.round(reducedMetric * 10) / 10) : 0;
  }
  return reducedMetric;
};

const calculateIndexes = function (sessions) { 
  return sessions.map((session, idx, array) => ({
    ...session, 
    prev: array[idx + 1] ? 
    [
      array[idx + 1].device, 
      array[idx + 1].id, 
      array[idx + 1].timestamp,
    ]
    : null,
    next: array[idx - 1] ? 
    [
      array[idx - 1].device, 
      array[idx - 1].id, 
      array[idx - 1].timestamp,
    ]
    : null,
  }));
};

const sortSessions = function (psessions, by = 'timestamp', order = 'desc') {
  const sessions = [...psessions];
  const sorted = order === 'asc' ? 
    sessions.sort((a, b) => a[by] - b[by]) 
    : 
    sessions.sort((a, b) => b[by] - a[by]);
  return calculateIndexes(sorted);
};

const getSessionById = function (sessions, id) {
  if (!id || !sessions || !sessions.length || !sessions[0].id) {
    return null;
  }
  return sessions.find(x => (x.id).toString() === id.toString());
};

const getShowerRange = function (sessions) {
  if (!Array.isArray(sessions)) {
    console.error('sessions must be array in getShowerRange', sessions);
    return {};
  }
  return {
    first: sessions[0] ? sessions[0].id : null,
    last: sessions[sessions.length - 1] ? sessions[sessions.length - 1].id : null,
  };
};

const getLastShowerIdFromMultiple = function (data) {
  return Math.max(...data.map(device => 
                              Array.isArray(device.sessions) ? device.sessions.length : 0));
};

const filterShowers = function (data, chunk, idx) {
  const index = Math.floor(((chunk * idx) % SHOWERS_PAGE) / chunk);

  return data.map((device) => {
    const from = device.sessions.length + (chunk * (index - 1));
    const to = (device.sessions.length + (chunk * index)) - 1;

    const sessions = device.sessions
    .filter((session, i, arr) => i >= from && i <= to);
    
    const first = sessions[0] && sessions[0].id;
    const last = sessions[sessions.length - 1] && sessions[sessions.length - 1].id;
    return { 
      ...device,
      range: {
        first,
        last,
      },
      sessions,
    };
  });
};

const hasShowersAfter = function (index) {
  return index < 0;
};

const hasShowersBefore = function (data) {
  if (!Array.isArray(data) || !data[0] || !data[0].range || !data[0].range.first) return false;
  return data.reduce((p, c) => c.range.first !== 1 && c.range.first != null ? c.range.first : p, null) != null;
};


// Estimates how many bottles/buckets/pools the given volume corresponds to
// The remaining is provided in quarters
const volumeToPictures = function (volume) {
  const div = c => Math.floor(volume / c);
  const rem = c => Math.floor((4 * (volume % c)) / c) / 4;
  if (volume < VOLUME_BUCKET) {
    return {
      display: 'bottle',
      items: div(VOLUME_BOTTLE),
      remaining: rem(VOLUME_BOTTLE),
    }; 
  } else if (volume < VOLUME_POOL) {
    return {
      display: 'bucket',
      items: div(VOLUME_BUCKET),
      remaining: rem(VOLUME_BUCKET),
    };
  } 
  return {
    display: 'pool',
    items: div(VOLUME_POOL),
    remaining: 0,
  };
};

const energyToPictures = function (energy) {
  const div = c => Math.floor(energy / c);

  if (energy < ENERGY_HOUSE) {
    return {
      display: 'light-bulb',
      items: div(ENERGY_BULB),
    };
  } else if (energy < ENERGY_CITY) {
    return {
      display: 'home-energy',
      items: div(ENERGY_HOUSE),
    };
  }
  return {
    display: 'city',
    items: div(ENERGY_CITY),
  };
};
const getAllMembers = function (members) {
  if (!Array.isArray(members)) return [];
  return members.filter(member => member.active || member.index === 0);
};

const memberFilterToMembers = function (filter) {
  if (filter === 'all') {
    return [];
  } else if (!isNaN(filter)) {
    return [filter];
  } 
  return [];
};

const getMeterComparisonTitle = function (comparison, start, period, favCommon, _t) {
  let extra = '';
  if (comparison === 'last') {
    extra = getComparisonPeriod(start, period, _t);
  } else if (comparison === 'common') {
    extra = favCommon;
  }
  return _t(`comparisons.${comparison}`, { comparison: extra });
};

const getAmphiroComparisonTitle = function (comparison, members, _t) {
  const member = members.find(m => String(m.index) === comparison);
  return _t('comparisons.member', { comparison: member ? member.name : '' });
};

const getComparisonTitle = function (devType, comparison, start, period, favCommon, members, _t) {
  if (devType === 'METER') {
    return getMeterComparisonTitle(comparison, start, period, favCommon, _t);
  } else if (devType === 'AMPHIRO') {
    return getAmphiroComparisonTitle(comparison, members, _t);
  }
  return '';
};

const getComparisons = function (devType, memberFilter, members) {
   if (devType === 'METER') {
     return ['last', 'all', 'common', 'nearest', 'similar'];
   } else if (devType === 'AMPHIRO') {
     return memberFilter !== 'all' ? 
       members.filter(m => m.index !== memberFilter).map(m => String(m.index))
         : [];
   }
   return [];
};

const waterIQToNumeral = function (waterIQ) {
  return 5 - (String(waterIQ).charCodeAt(0) - 65);
};

const numeralToWaterIQ = function (num) {
  if (num < 0 || num > 5) return ' ';
  return String.fromCharCode((5 - num) + 65);
};

const prepareBreakdownSessions = function (devices, data, metric, breakdown, user, time, timeFilter, intl) {
  const total = reduceMetric(devices, data, metric);
  return breakdown.map((item) => {
    const id = String(item.label).toLowerCase().replace(' ', '-');
    const title = intl.formatMessage({ id: `breakdown.${id}` });
    return {
      id,
      devName: 'SWM',
      devType: title,
      title,
      volume: Math.round(total * (item.percent / 100)),
      member: user,
      date: getPeriodTimeLabel(time, 
                               timeFilter,
                               intl
                              ),
    };
  });
};

const getAugmental = function (array) {
  return array.map((x, i, arr) => x !== null ? 
                      arr.filter((y, j) => j <= i)
                      .reduce((p, c) => p + c, 0) 
                        : null
                     );
};

// TODO: take into consideration days that are between price brackets
const getCurrentMeasurementCost = function (volume, pTotal, brackets) {
  const curr = brackets.find(bracket => (pTotal / 1000) >= bracket.minVolume && (bracket.maxVolume === null || (pTotal / 1000) < bracket.maxVolume));
  return curr ? Math.round(curr.price * (volume / 1000) * 1000) / 1000 : 0;
};

const preparePricingSessions = function (sessions, brackets, granularity, user, intl) {
  return sortSessions(sessions, 'timestamp', 'asc')
  .map((session, i, arr) => {
    const totalVolume = arr
    .filter((x, j) => j <= i)
    .map(x => x.volume)
    .reduce((p, c) => p + c, 0);
    
    const diff = arr[i - 1] != null ? (arr[i].volume - arr[i - 1].volume) : null;
    return {
      ...session,
      devName: 'SWM',
      member: user,
      total: totalVolume,
      percentDiff: (diff != null && arr[i - 1].volume !== 0) ? 
                        Math.round(10000 * (diff / arr[i - 1].volume)) / 100 
                        : null,
      cost: getCurrentMeasurementCost(session.volume, totalVolume, brackets),
      date: getTimeLabelByGranularity(session.timestamp, 
                                      granularity, 
                                      intl
                                     ),
    };
  });
};

module.exports = {
  getSessionById,
  updateOrAppendToSession,
  prepareSessionsForTable,
  sortSessions,
  reduceMetric,
  getSessionsCount,
  getShowerById,
  getShowerRange,
  filterShowers,
  getLastShowerIdFromMultiple,
  hasShowersBefore,
  hasShowersAfter,
  volumeToPictures,
  energyToPictures,
  memberFilterToMembers,
  getComparisons,
  getComparisonTitle,
  waterIQToNumeral,
  numeralToWaterIQ,
  getAllMembers,
  getAugmental,
  prepareBreakdownSessions,
  preparePricingSessions,
};
