const { getFriendlyDuration, getEnergyClass } = require('./general');
const { getDeviceTypeByKey, getDeviceNameByKey } = require('./device');
const { getTimeLabelByGranularity } = require('./chart');

// Returns sessions for AMPHIRO/METER given the DATA API response
const getDataSessions = function (devices, data) {
  if (!data || !data.deviceKey) return [];
  
  const devType = getDeviceTypeByKey(devices, data.deviceKey);
  
  if (devType === 'AMPHIRO') {
    return data.sessions;
  } else if (devType === 'METER') {
    return data.values;
  }
  return [];
};

// reduces array of devices with multiple sessions arrays
// to single array of sessions 
// and prepare for table presentation
const prepareSessionsForTable = function (devices, data, user, granularity, intl) {
  if (!devices || !data) return [];
  const sessions = data.map(device => getDataSessions(devices, device)
                  .map((session, idx, array) => {
                    const devType = getDeviceTypeByKey(devices, device.deviceKey);
                    const vol = devType === 'METER' ? 'difference' : 'volume'; 
                    const diff = array[idx - 1] != null ? (array[idx][vol] - array[idx - 1][vol]) : null;
                    return {
                      ...session,
                      index: idx, 
                      devType,
                      vol: session[vol],
                      device: device.deviceKey,
                      devName: getDeviceNameByKey(devices, device.deviceKey),
                      duration: session.duration ? Math.floor(session.duration / 60) : null,
                      friendlyDuration: getFriendlyDuration(session.duration), 
                      temperature: session.temperature ? 
                        Math.round(session.temperature * 10) / 10 
                        : null,
                      energyClass: getEnergyClass(session.energy), 
                      percentDiff: (diff != null && array[idx - 1][vol] !== 0) ? 
                        Math.round(10000 * (diff / array[idx - 1][vol])) / 100 
                        : null,
                      hasChartData: Array.isArray(session.measurements) && 
                        session.measurements.length > 0,
                      user,
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

// TODO: hm?
const getSessionsCount = function (devices, data) {
  return reduceMultipleSessions(devices, data)
  .map(() => 1)
  .reduce((p, c) => p + c, 0);
};

const getShowersCount = function (devices, data) {
  return reduceMultipleSessions(devices, data)
  .map(s => s.count ? s.count : 1)
  .reduce((p, c) => p + c, 0);
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

const getShowerMeasurements = function (devices, data, index) {
  const sessions = getDataSessions(devices, data);

  if (!sessions || !Array.isArray(sessions) || sessions.length < index) {
    return [];
  }

  return sessions[index] ? sessions[index].measurements : [];
};

const reduceMetric = function (devices, data, metric) {
  if (!devices || !data || !metric) return null;
  const sessions = getSessionsCount(devices, data);

  let reducedMetric = data
  .map(d => getDataSessions(devices, d)
       .map(it => it[metric] ? it[metric] : 0)
       .reduce(((p, c) => p + c), 0)
  )
  .reduce(((p, c) => p + c), 0);

  if (metric === 'temperature') {
    reducedMetric /= sessions;
  } else if (metric === 'duration') {
    reducedMetric = (reducedMetric / sessions) / 60;
  } else if (metric === 'energy') {
    reducedMetric /= 1000;
  }

  reducedMetric = !isNaN(reducedMetric) ? (Math.round(reducedMetric * 10) / 10) : 0;
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

const sortSessions = function (sessions, by = 'timestamp', order = 'desc') {
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

const meterSessionsToCSV = function (sessions) {
  return sessions.map(session => [
    session.devName, 
    session.volume, 
    session.difference, 
    session.timestamp, 
  ].join('%2C'))
  .reduce((prev, curr) => [prev, curr].join('%0A'), 
          'Device, Volume%A0total, Volume%A0 difference, Timestamp');
};

const deviceSessionsToCSV = function (sessions) {
  return sessions.map(session => [
    session.devName,
    session.id,
    session.history,
    session.volume, 
    session.energy,
    session.energyClass,
    session.temperature,
    session.duration, 
    session.timestamp,
  ].join('%2C'))
  .reduce((prev, curr) => [prev, curr].join('%0A'), 
          'Device, Id, Historic, Volume, Energy, Energy%A0Class, Temperature, Duration, Timestamp');
};

module.exports = {
  getSessionById,
  updateOrAppendToSession,
  getDataSessions,
  prepareSessionsForTable,
  sortSessions,
  reduceMetric,
  getShowersCount,
  getShowerMeasurements,
  meterSessionsToCSV,
  deviceSessionsToCSV,
};
