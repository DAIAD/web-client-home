const moment = require('moment');

const { STATIC_RECOMMENDATIONS, STATBOX_DISPLAYS, DEV_PERIODS, METER_PERIODS } = require('../constants/HomeConstants');

const { getFriendlyDuration, getEnergyClass, getMetricMu } = require('./general');
const { getChartMeterData, getChartAmphiroData, getChartMeterCategories, getChartMeterCategoryLabels, getChartAmphiroCategories } = require('./chart');
const { getTimeByPeriod, getLowerGranularityPeriod } = require('./time');
const { getDeviceTypeByKey, getDeviceNameByKey, getDeviceKeysByType } = require('./device');

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
// to single array of sessions (including device key)
const reduceSessions = function (devices, data) {
  if (!devices || !data) return [];
  return data
         .map(device =>  
              getDataSessions(devices, device)
              .map((session, idx, array) => {
                const devType = getDeviceTypeByKey(devices, device.deviceKey);
                const vol = devType === 'METER' ? 'difference' : 'volume'; 
                const diff = array[idx - 1] ? (array[idx][vol] - array[idx - 1][vol]) : null;
                return {
                  ...session,
                  index: idx, 
                  devType,
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
                  hasChartData: Array.isArray(session.measurements) 
                  && session.measurements.length > 0,
                };
              }))
          .reduce((p, c) => p.concat(c), []);
};

// TODO: hm?
const getSessionsCount = function (devices, data) {
  return reduceSessions(devices, data)
  .map(() => 1)
  .reduce((p, c) => p + c, 0);
};

const getShowersCount = function (devices, data) {
  return reduceSessions(devices, data)
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

const getDataMeasurements = function (devices, data, index) {
  const sessions = getDataSessions(devices, data);

  if (!sessions || !Array.isArray(sessions) || sessions.length < index) {
    return [];
  }

  return sessions[index] ? sessions[index].measurements : [];
};

const reduceMetric = function (devices, data, metric) {
  if (!devices || !data || !metric) return null;
  const showers = getShowersCount(devices, data);                     
  const sessions = getSessionsCount(devices, data);
  let reducedMetric;
  
  if (metric === 'showers') return showers;
  
  reducedMetric = data
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
const transformInfoboxData = function (infobox, devices, intl) {
  const { type, period, index, deviceType, data, previous, metric } = infobox;

  const meterPeriods = METER_PERIODS.filter(x => x.id !== 'custom');
  const devPeriods = DEV_PERIODS;

  let device;
  let chartData;
  let reduced;
  let highlight;
  let previousReduced;
  let better;
  let comparePercentage;
  let mu;
  let periods = [];
  let displays = []; 
  //let chartProps = {};

  const time = infobox.time ? infobox.time : getTimeByPeriod(period);

  const showers = getShowersCount(devices, data);
  
  let chartType = 'line';
  let chartXAxis = 'category';
  let chartFormatter = null;
  //let chartCategories = [];
  
  let chartCategories = deviceType === 'METER' ? 
    getChartMeterCategories(time) 
    : 
    getChartAmphiroCategories(period);
  
  //let chartLabels;
  let chartLabels = deviceType === 'METER' ? 
    getChartMeterCategoryLabels(chartCategories, time, intl) 
    :
    chartCategories; 
  let chartColors = ['#2d3480', '#abaecc', '#7AD3AB', '#CD4D3E'];
  let invertAxis = false;

  if (type === 'tip') {
    highlight = STATIC_RECOMMENDATIONS[Math.floor(Math.random() * 3)].description;
  } else if (type === 'last') {
    // LAST SHOWER
    device = infobox.device;
    
    const last = data ? data.find(d => d.deviceKey === device) : null;
    const lastShowerMeasurements = getDataMeasurements(devices, last, index);

    chartLabels = lastShowerMeasurements.map(measurement => moment(measurement.timestamp).format('hh:mm:ss'));
    chartXAxis = 'category'; 
    chartFormatter = t => moment(t).format('hh:mm');
    
    reduced = lastShowerMeasurements
    .map(s => s[metric])
    .reduce((p, c) => p + c, 0);

    highlight = reduced;
    mu = getMetricMu(metric);

    chartData = [{
      name: getDeviceNameByKey(devices, device), 
      //data: getChartTimeData(lastShowerMeasurements, infobox.metric),
      data: lastShowerMeasurements.map(measurement => measurement ? 
                                       measurement[infobox.metric] 
                                       : null),
    }];
  } else if (type === 'total') {
    // TOTAL
    device = getDeviceKeysByType(devices, deviceType);
    
    periods = deviceType === 'AMPHIRO' ? 
      devPeriods 
       : 
       meterPeriods.map(per => ({ ...per, time: getTimeByPeriod(per) }));
    displays = STATBOX_DISPLAYS;

    reduced = data ? reduceMetric(devices, data, metric) : 0;
    // TODO: static
    let fac; 
    if (period === 'ten') fac = 1.2;
    else if (period === 'twenty') fac = 0.8;
    else if (period === 'fifty') fac = 0.75;

    previousReduced = deviceType === 'AMPHIRO' ? 
      reduced * fac 
      : 
      // (previous ? reduceMetric(devices, previous, metric) : 0); 
      reduceMetric(devices, previous, metric); 

    highlight = reduced;
    mu = getMetricMu(metric);
    
    better = reduced < previousReduced;
    comparePercentage = previousReduced === 0 ? 
      null 
      : 
      Math.round((Math.abs(reduced - previousReduced) / previousReduced) * 100);
    
      chartData = data ? data.map((devData) => {
      const sessions = getDataSessions(devices, devData)
      .map(session => ({
        ...session,
        duration: Math.round(100 * (session.duration / 60)) / 100,
        energy: Math.round(session.energy / 10) / 100,
      }));
      
      return {
        name: getDeviceNameByKey(devices, devData.deviceKey), 
        data: deviceType === 'METER' ? 
          getChartMeterData(sessions, 
                            chartCategories, 
                            time
                           ).map(x => x ? x[infobox.metric] : null)
          : 
            getChartAmphiroData(sessions, chartCategories)
            .map(x => x ? x[infobox.metric] : null),
      };
    }) : []; 
  } else if (type === 'efficiency') {
    // EFFICIENCY
    device = getDeviceKeysByType(devices, deviceType);
    reduced = data ? reduceMetric(devices, data, metric) : 0;

    periods = deviceType === 'AMPHIRO' ? devPeriods : meterPeriods;
    displays = STATBOX_DISPLAYS;

    // TODO: static
    let fac; 
    if (period === 'ten') fac = 0.4;
    else if (period === 'twenty') fac = 1.1;
    else if (period === 'fifty') fac = 1.15;
    
    previousReduced = previous ? reduceMetric(devices, previous, metric) : reduced * fac; 

    better = reduced < previousReduced;

    comparePercentage = previousReduced === 0 ? 
      null 
      : 
      Math.round((Math.abs(reduced - previousReduced) / previousReduced) * 100);

    if (metric === 'energy') {
      highlight = (showers === 0 || reduced === 0) ? null : getEnergyClass(reduced / showers);
    } else {
      throw new Error('only energy efficiency supported');
    }
    
    chartData = data ? data.map(devData => ({ 
      name: getDeviceNameByKey(devices, devData.deviceKey), 
      data: deviceType === 'METER' ? 
        getChartMeterData(getDataSessions(devices, devData), 
                          chartCategories, 
                          getLowerGranularityPeriod(period)
                         ).map(x => x ? x[infobox.metric] : null)
       : 
       getChartAmphiroData(getDataSessions(devices, devData), 
                           chartCategories
                          ).map(x => x ? x[infobox.metric] : null)
    })) : [];
  } else if (type === 'forecast') {
    // FORECASTING
    chartType = 'bar';
    
    device = getDeviceKeysByType(devices, deviceType);
    reduced = data ? reduceMetric(devices, data, infobox.metric) : 0;

    // TODO: static
    // dummy data
    chartLabels = [2014, 2015, 2016];
    chartData = [{
      name: 'Consumption', 
      data: [Math.round(reduced), Math.round(reduced * 1.5), Math.round(reduced * 0.8)],
    }];
    mu = getMetricMu(metric);
  } else if (type === 'breakdown') {
    chartType = 'bar';

    periods = meterPeriods.filter(p => p.id === 'month' || p.id === 'year');

    reduced = data ? reduceMetric(devices, data, metric) : 0;
    // TODO: static
    // dummy data
    chartData = [{
      name: 'Consumption', 
      data: [
        Math.floor(reduced / 4), 
        Math.floor(reduced / 4), 
        Math.floor(reduced / 3), 
        Math.floor((reduced / 2) - (reduced / 3)),
      ],
    }];
    chartLabels = ['toilet', 'faucet', 'shower', 'kitchen'];
    chartColors = ['#abaecc', '#8185b2', '#575d99', '#2d3480'];
    mu = getMetricMu(metric);
    invertAxis = true;
  } else if (type === 'comparison') {
    chartType = 'bar';

    periods = deviceType === 'AMPHIRO' ? devPeriods : meterPeriods;

    reduced = data ? reduceMetric(devices, data, metric) : 0;
    mu = getMetricMu(metric);
    // TODO: static
    // dummy data based on real user data
    chartData = [{ 
      name: 'Comparison', 
      data: [
        reduced - (0.2 * reduced), 
        reduced + (0.5 * reduced), 
        reduced / 2, 
        reduced,
      ],
    }];
    chartLabels = ['City', 'Neighbors', 'Similar', 'You'];
    chartColors = ['#f5dbd8', '#ebb7b1', '#a3d4f4', '#2d3480'];
    mu = getMetricMu(metric);
    invertAxis = true;
  } else if (type === 'budget') {
    chartType = 'pie';

    periods = [];
    reduced = data ? reduceMetric(devices, data, metric) : 0;
    mu = getMetricMu(metric);
    chartCategories = null; 
    
    // dummy data based on real user data
    // TODO: static
    const consumed = reduced;

    const remaining = Math.round(reduced * 0.35);
    let percent = Math.round((consumed / (consumed + remaining)) * 100);
    percent = isNaN(percent) ? '' : `${percent}%`;

    chartData = [{
      name: percent, 
      data: [{
        value: consumed, 
        name: 'consumed', 
        color: '#2D3580',
      }, {
        value: remaining, 
        name: 'remaining', 
        color: '#D0EAFA',
      },
      ],
    }];

    chartColors = ['#2d3480', '#abaecc'];
    mu = getMetricMu(metric);
  }
  return {
    ...infobox,
    periods,
    displays,
    time,
    device,
    highlight,
    chartData,
    chartFormatter,
    chartType,
    chartCategories: chartLabels,
    chartColors,
    chartXAxis,
    invertAxis,
    better,
    comparePercentage,
    mu,
  };
};

const calculateIndexes = function (sessions) { 
  return sessions.map((session, idx, array) => ({
    ...session, 
    next: array[idx + 1] ? 
    [
      array[idx + 1].device, 
      array[idx + 1].id, 
      array[idx + 1].timestamp,
    ]
    : null,
    prev: array[idx - 1] ? 
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

const getLastSession = function (sessions) { 
  if (!sessions || !sessions.length || !sessions[0].timestamp) {
    return null;
  }

  return sessions.reduce((prev, curr) => (curr.timestamp > prev.timestamp) ? curr : prev);
};

const getSessionById = function (sessions, id) {
  if (!id || !sessions || !sessions.length || !sessions[0].id) {
    return null;
  }
  return sessions.find(x => (x.id).toString() === id.toString());
};

const getSessionByIndex = function (sessions, index) {
  if (typeof index !== 'number' || !sessions || !sessions.length) {
    return null;
  }
  return sessions[index];
};

const getNextSession = function (sessions, id) {
  if (!id || !sessions || !sessions.length || !sessions[0].id) {
    return null;
  }
  
  const sessionIndex = getSessionIndexById(sessions, id);
  if (sessions[sessionIndex + 1]) {
    return sessions[sessionIndex + 1].id;
  }
  return null;
};

const getPreviousSession = function (sessions, id) {
  if (!id || !sessions || !sessions.length || !sessions[0].id) {
    return null;
  }
  
  const sessionIndex = getSessionIndexById(sessions, id);
  if (sessions[sessionIndex - 1]) {
    return sessions[sessionIndex - 1].id;
  }
  return null;
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
  getNextSession,
  getPreviousSession,
  getSessionById,
  getSessionByIndex,
  getLastSession,
  updateOrAppendToSession,
  getDataSessions,
  getDataMeasurements,
  reduceSessions,
  sortSessions,
  reduceMetric,
  transformInfoboxData,
  meterSessionsToCSV,
  deviceSessionsToCSV,
};
