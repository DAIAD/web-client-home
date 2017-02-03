const { getFriendlyDuration, getEnergyClass, energyToPower } = require('./general');
const { getDeviceTypeByKey, getDeviceNameByKey } = require('./device');
const { getTimeLabelByGranularity } = require('./chart');
const { VOLUME_BOTTLE, VOLUME_BUCKET, VOLUME_POOL, ENERGY_BULB, ENERGY_HOUSE, ENERGY_CITY } = require('../constants/HomeConstants');

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

const getSessionsCount = function (devices, data) {
  return data.map(dev => getDataSessions(devices, dev).length).reduce((p, c) => p + c, 0);
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

const getShowerMeasurementsById = function (data, id) {
  if (!data || !Array.isArray(data.sessions)) {
    return [];
  }
  const sessions = data.sessions;

  const found = sessions.find(session => session.id === id);
  return found ? found.measurements : [];
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

const getShowerRange = function (sessions) {
  if (!Array.isArray(sessions)) {
    console.error('sessions must be array in getShowerRange', sessions);
    return {};
  }
  return {
    first: sessions[0].id,
    last: sessions[sessions.length - 1].id,
  };
};

const getLastShowerIdFromMultiple = function (data) {
  return Math.max(...data.map(device => 
                              Array.isArray(device.sessions) ? device.sessions.length : 0));
};

const getLastShowers = function (data, chunk, index) {
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
  if (!Array.isArray(data) || !data[0].range || !data[0].range.first) return false;
  return data.reduce((p, c) => c.range.first !== 1 && c.range.first != null ? c.range.first : p, null) != null;
};


// Estimates how many bottles/buckets/pools the given volume corresponds to
// the remaining is provided in quarters
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

module.exports = {
  getSessionById,
  updateOrAppendToSession,
  getDataSessions,
  prepareSessionsForTable,
  sortSessions,
  reduceMetric,
  getSessionsCount,
  getShowerMeasurementsById,
  meterSessionsToCSV,
  deviceSessionsToCSV,
  getShowerRange,
  getLastShowers,
  getLastShowerIdFromMultiple,
  hasShowersBefore,
  hasShowersAfter,
  volumeToPictures,
  energyToPictures,
};
