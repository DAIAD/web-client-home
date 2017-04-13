const { getFriendlyDuration, getEnergyClass } = require('./general');
const { getDeviceTypeByKey, getDeviceNameByKey } = require('./device');
const { getTimeLabelByGranularity, getPeriodTimeLabel } = require('./time');

const { SHOWERS_PAGE } = require('../constants/HomeConstants');

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
                      date: devType === 'AMPHIRO' ? 
                        intl.formatDate(new Date(session.timestamp), { 
                          weekday: 'short', 
                          day: 'numeric', 
                          month: 'numeric', 
                          year: 'numeric' 
                        })
                        : getTimeLabelByGranularity(session.timestamp, 
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

const filterDataByDeviceKeys = function (data, deviceKeys) {
  if (deviceKeys == null) return data;
  return data.filter(x => deviceKeys.findIndex(k => k === x.deviceKey) > -1);
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
  getAugmental,
  prepareBreakdownSessions,
  preparePricingSessions,
  filterDataByDeviceKeys,
};
