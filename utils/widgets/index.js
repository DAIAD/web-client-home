const moment = require('moment');

const { STATIC_RECOMMENDATIONS, STATBOX_DISPLAYS, DEV_PERIODS, METER_PERIODS } = require('../../constants/HomeConstants');

const { getFriendlyDuration, getEnergyClass, getMetricMu } = require('../general');
const { getChartMeterData, getChartAmphiroData, getChartMeterCategories, getChartMeterCategoryLabels, getChartAmphiroCategories } = require('../chart');
const { getTimeByPeriod, getLowerGranularityPeriod } = require('../time');
const { getDeviceTypeByKey, getDeviceNameByKey, getDeviceKeysByType } = require('../device');
const { reduceMetric, getDataSessions, getShowerMeasurements, getShowersCount } = require('../sessions');


const prepareWidget = function (widget, devices, intl) {
  const { type, period, index, deviceType, data, previous, metric } = widget;

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
  const time = widget.time ? widget.time : getTimeByPeriod(period);
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
    device = widget.device;
    const last = data ? data.find(d => d.deviceKey === device) : null;
    const lastShowerMeasurements = last ? getShowerMeasurements(devices, last, index) : [];

    chartLabels = lastShowerMeasurements.map(measurement => moment(measurement.timestamp).format('hh:mm:ss'));
    chartXAxis = 'category'; 
    chartFormatter = t => moment(t).format('hh:mm');
    
    reduced = lastShowerMeasurements
    .map(s => s[metric])
    .reduce((p, c) => p + c, 0);

    highlight = reduced;
    mu = getMetricMu(metric);

    chartData = [{
      name: getDeviceNameByKey(devices, device) || '', 
      data: lastShowerMeasurements.map(measurement => measurement ? 
                                       measurement[widget.metric] 
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
                           ).map(x => x ? x[widget.metric] : null)
          : 
            getChartAmphiroData(sessions, chartCategories)
            .map(x => x ? x[widget.metric] : null),
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
                         ).map(x => x ? x[widget.metric] : null)
       : 
       getChartAmphiroData(getDataSessions(devices, devData), 
                           chartCategories
                          ).map(x => x ? x[widget.metric] : null)
    })) : [];
  } else if (type === 'forecast') {
    // FORECASTING
    chartType = 'bar';
    
    device = getDeviceKeysByType(devices, deviceType);
    reduced = data ? reduceMetric(devices, data, widget.metric) : 0;

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
    ...widget,
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

module.exports = {
  prepareWidget,
};
