const moment = require('moment');

const { STATIC_RECOMMENDATIONS, STATBOX_DISPLAYS, DEV_PERIODS, METER_PERIODS } = require('../constants/HomeConstants');

const { getFriendlyDuration, getEnergyClass, getMetricMu } = require('./general');
const { getChartMeterData, getChartAmphiroData, getChartMeterCategories, getChartMeterCategoryLabels, getChartAmphiroCategories } = require('./chart');
const { getTimeByPeriod } = require('./time');
const { getDeviceTypeByKey, getDeviceNameByKey, getDeviceKeysByType } = require('./device');
const { reduceMetric, getDataSessions, getShowerMeasurementsById, getSessionsCount } = require('./sessions');

const tip = function (widget) {
  return {
    ...widget,
    highlight: STATIC_RECOMMENDATIONS[Math.floor(Math.random() * 3)].description,
  };
};

const amphiroLastShower = function (widget, devices, intl) {
  const { data, device, showerId, metric } = widget;
  const last = data ? data.find(d => d.deviceKey === device) : null;
  const measurements = last ? getShowerMeasurementsById(last, showerId) : [];
  const chartCategories = measurements.map(m => moment(m.timestamp).format('hh:mm:ss'));
  const chartData = [{
    name: getDeviceNameByKey(devices, device) || '', 
    data: measurements.map(m => m ? m[metric] : null),
  }];
  const mu = getMetricMu(metric);

  const highlight = measurements.map(s => s[metric]).reduce((p, c) => p + c, 0);

  return {
    ...widget,
    chartCategories,
    chartData,
    highlight,
    mu,
  };
};

const amphiroOrMeterTotal = function (widget, devices, intl) {
  const { data, period, deviceType, metric, previous } = widget;
  
  const time = widget.time ? widget.time : getTimeByPeriod(period);
  const device = getDeviceKeysByType(devices, deviceType);
  const periods = deviceType === 'AMPHIRO' ? 
    DEV_PERIODS.filter(p => p.id !== 'all') 
    : 
    METER_PERIODS.filter(p => p.id !== 'custom');

  const reduced = data ? reduceMetric(devices, data, metric) : 0;
  
  // TODO: static
  let fac = 1.1;
  if (period === 'ten') fac = 1.2;
  else if (period === 'twenty') fac = 0.8;
  else if (period === 'fifty') fac = 0.75;

  const previousReduced = (deviceType === 'AMPHIRO' || previous == null) ?
    reduced * fac 
    :
    reduceMetric(devices, previous, metric);

  const highlight = reduced;
  const mu = getMetricMu(metric);
  const better = reduced < previousReduced;
  const comparePercentage = previousReduced === 0 ?
    null
    :
    Math.round((Math.abs(reduced - previousReduced) / previousReduced) * 100);
    
  const chartCategories = deviceType === 'AMPHIRO' ?
    getChartAmphiroCategories(period)
    :
    getChartMeterCategoryLabels(getChartMeterCategories(time), time, intl);

  const chartData = data ? data.map((devData) => {
    const sessions = getDataSessions(devices, devData)
    .map(session => ({
      ...session,
      duration: Math.round(100 * (session.duration / 60)) / 100,
      energy: Math.round(session.energy / 10) / 100,
    }));
    
    return {
      name: getDeviceNameByKey(devices, devData.deviceKey) || '', 
      data: deviceType === 'METER' ? 
        getChartMeterData(sessions, 
                          getChartMeterCategories(time),
                          time
                         ).map(x => x ? x[widget.metric] : null)
        : 
          getChartAmphiroData(sessions, getChartAmphiroCategories(period))
          .map(x => x ? x[widget.metric] : null),
    };
  }) : [];
  
  return {
    ...widget,
    time,
    periods,
    highlight,
    mu,
    better,
    comparePercentage,
    chartCategories,
    chartData,
  };
};

const amphiroEnergyEfficiency = function (widget, devices, intl) {
  const { data, period, deviceType, metric, previous } = widget;

  if (metric !== 'energy') {
    console.error('only energy efficiency supported');
  } else if (deviceType !== 'AMPHIRO') {
    console.error('only amphiro energy efficiency supported');
  }
  const device = getDeviceKeysByType(devices, deviceType);
  const periods = DEV_PERIODS.filter(p => p.id !== 'all');

  const reduced = data ? reduceMetric(devices, data, metric) : 0;

  // TODO: static
  let fac; 
  if (period === 'ten') fac = 0.4;
  else if (period === 'twenty') fac = 1.1;
  else if (period === 'fifty') fac = 1.15;

  const previousReduced = previous ? reduceMetric(devices, previous, metric) : reduced * fac; 
  const better = reduced < previousReduced;

  const comparePercentage = previousReduced === 0 ? 
    null 
    : 
    Math.round((Math.abs(reduced - previousReduced) / previousReduced) * 100);
 
  const showers = getSessionsCount(devices, data);
  const highlight = (showers === 0 || reduced === 0) ? null : getEnergyClass(reduced / showers);
  return {
    ...widget,
    periods,
    highlight,
    better,
    comparePercentage,
  };
};

const meterForecast = function (widget, devices, intl) {
  const { data, forecastData, period, deviceType, metric, previous } = widget;
  
  if (deviceType !== 'METER') {
    console.error('only meter forecast supported');
  }
  const time = widget.time ? widget.time : getTimeByPeriod(period);
  const periods = METER_PERIODS.filter(p => p.id !== 'custom');

  const device = getDeviceKeysByType(devices, deviceType);
  
  const chartColors = ['#2d3480', '#abaecc', '#7AD3AB', '#CD4D3E'];
  const mu = getMetricMu(metric);
  const xCategories = getChartMeterCategories(time);
  const xCategoryLabels = getChartMeterCategoryLabels(xCategories, time, intl);
  
  const chartData = data ? data.map((devData) => {
    const sessions = getDataSessions(devices, devData);
    return {
      name: getDeviceNameByKey(devices, devData.deviceKey) || '', 
      data: getChartMeterData(sessions, 
                              xCategories,
                              time
                             ).map(x => x ? x[widget.metric] : null),
    };
  }) : [];

  const forecastChartData = forecastData ? [{
    name: 'Forecast',
    data: getChartMeterData(forecastData,
                            xCategories, 
                            time
                           ).map(x => x && x.volume && x.volume.SUM ? 
                             Math.round(100 * x.volume.SUM) / 100
                             : null),
  }]
  : [];

  return {
    ...widget,
    chartType: 'bar',
    time,
    periods,
    chartCategories: xCategoryLabels,
    chartData: [...chartData, ...forecastChartData],
    chartColors,
    mu,
  };
};

const meterBreakdown = function (widget, devices, intl) {
  const { data, period, deviceType, metric, previous } = widget;
  
  if (deviceType !== 'METER') {
    console.error('only meter breakdown makes sense');
  }

  const periods = METER_PERIODS.filter(p => p.id === 'month' || p.id === 'year');

  const device = getDeviceKeysByType(devices, deviceType);
  const reduced = data ? reduceMetric(devices, data, metric) : 0;
  
  const time = widget.time ? widget.time : getTimeByPeriod(period);
  // TODO: static
  // dummy data
  const chartCategories = ['toilet', 'faucet', 'shower', 'kitchen'];
  const chartColors = ['#abaecc', '#8185b2', '#575d99', '#2d3480'];
  const chartData = [{
    name: 'Consumption', 
    data: [
      Math.floor(reduced / 4), 
      Math.floor(reduced / 4), 
      Math.floor(reduced / 3), 
      Math.floor((reduced / 2) - (reduced / 3)),
    ],
  }];
  const mu = getMetricMu(metric);
  const invertAxis = true;
  return {
    ...widget,
    time,
    periods,
    chartType: 'horizontal-bar',
    chartCategories,
    chartColors,
    chartData,
    mu,
    invertAxis,
  };
};

const meterComparison = function (widget, devices, intl) {
  const { data, period, deviceType, metric, previous } = widget;
  
  if (deviceType !== 'METER') {
    console.error('only meter comparison supported');
  }

  const time = widget.time ? widget.time : getTimeByPeriod(period);
  //const periods = deviceType === 'AMPHIRO' ? DEV_PERIODS : METER_PERIODS.filter(p => p.id !== 'custom');
  const periods = METER_PERIODS.filter(p => p.id !== 'custom');
  const reduced = data ? reduceMetric(devices, data, metric) : 0;
  // TODO: static
  // dummy data based on real user data
  const chartCategories = ['City', 'Neighbors', 'Similar', 'You'];
  const chartColors = ['#f5dbd8', '#ebb7b1', '#a3d4f4', '#2d3480'];
  const chartData = [{ 
    name: 'Comparison', 
    data: [
      reduced - (0.2 * reduced), 
      reduced + (0.5 * reduced), 
      reduced / 2, 
      reduced,
    ],
  }];
  const mu = getMetricMu(metric);
  const invertAxis = true;
  return {
    ...widget,
    time,
    periods,
    chartType: 'horizontal-bar',
    chartCategories,
    chartColors,
    chartData,
    mu,
    invertAxis,
  };
};

const budget = function (widget, devices, intl) {
  const { data, period, deviceType, metric, previous } = widget;
  
  if (deviceType !== 'METER') {
    console.error('only meter comparison supported');
  }

  const periods = METER_PERIODS.filter(p => p.id !== 'custom');
  const reduced = data ? reduceMetric(devices, data, metric) : 0;
  const mu = getMetricMu(metric);
  
  // dummy data based on real user data
  // TODO: static
  const consumed = reduced;

  const remaining = Math.round(reduced * 0.35);
  const percent = `${Math.round((consumed / (consumed + remaining)) * 100)}%`;
  //percent = isNaN(percent) ? '' : `${percent}%`;

  const chartData = [{
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

  const chartColors = ['#2d3480', '#abaecc'];
  return {
    ...widget,
    highlight: reduced,
    chartData,
    chartColors,
  };
};

const prepareWidget = function (widget, devices, intl) {
  switch (widget.type) {
    case 'tip': 
      return tip();
    case 'last': 
      return amphiroLastShower(widget, devices, intl);
    case 'total':
      return amphiroOrMeterTotal(widget, devices, intl); 
    case 'efficiency':
      return amphiroEnergyEfficiency(widget, devices, intl); 
    case 'forecast':
      return meterForecast(widget, devices, intl); 
    case 'breakdown':
      return meterBreakdown(widget, devices, intl);  
    case 'comparison':
      return meterComparison(widget, devices, intl);
    case 'budget':
      return budget(widget, devices, intl);
    default:
      return widget;
  }
};

module.exports = prepareWidget;
