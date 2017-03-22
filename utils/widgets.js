const moment = require('moment');

const { STATIC_RECOMMENDATIONS, STATBOX_DISPLAYS, DEV_PERIODS, METER_PERIODS } = require('../constants/HomeConstants');

const { getFriendlyDuration, getEnergyClass, getMetricMu, getPriceBrackets } = require('./general');
const { getChartMeterData, getChartAmphiroData, getChartMeterCategories, getChartMeterCategoryLabels, getChartAmphiroCategories } = require('./chart');
const { getTimeByPeriod } = require('./time');
const { getDeviceTypeByKey, getDeviceNameByKey, getDeviceKeysByType } = require('./device');
const { reduceMetric, getShowerMeasurementsById, getSessionsCount, waterIQToNumeral, numeralToWaterIQ, prepareBreakdownSessions } = require('./sessions');

const tip = function (widget) {
  return {
    ...widget,
    highlight: STATIC_RECOMMENDATIONS[Math.floor(Math.random() * 3)].description,
  };
};

const amphiroLastShower = function (widget, devices, intl) {
  const { data, device, showerId, metric, timestamp } = widget;
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
    timeDisplay: intl.formatRelative(timestamp),
    chartData,
    highlight,
    mode: 'stats',
    mu,
    clearComparisons: true,
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

  const reduced = reduceMetric(devices, data, metric);
  const previousReduced = reduceMetric(devices, previous, metric);

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
    getChartMeterCategoryLabels(getChartMeterCategories(time), time.granularity, period, intl);

  const chartData = data ? data.map((devData) => {
    const sessions = devData.sessions 
    .map(session => ({
      ...session,
      duration: Math.round(100 * (session.duration / 60)) / 100,
      energy: Math.round(session.energy / 10) / 100,
    }));
    
    return {
      name: getDeviceNameByKey(devices, devData.deviceKey) || 'SWM', 
      data: deviceType === 'METER' ? 
        getChartMeterData(sessions, 
                          getChartMeterCategories(time),
                          time,
                          metric
                         )
        : 
          getChartAmphiroData(sessions, 
                              getChartAmphiroCategories(period),
                              metric
                             ),
    };
  }) : [];
  const hasComparison = better != null && comparePercentage != null;
  const str = better ? 'better' : 'worse';
  return {
    ...widget,
    time,
    periods,
    highlight,
    mu,
    info: [
      {
        icon: better ? 'arrow-down green' : 'arrow-up red',
        text: `${comparePercentage}% ${str} than previous ${period}!`,
        display: hasComparison,
      },
      {
        text: 'No comparison data!',
        display: !hasComparison,
      }
    ].filter(i => i.display),
    chartCategories,
    chartData,
    mode: 'stats',
    clearComparisons: true,
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

  const reduced = reduceMetric(devices, data, metric);
  const previousReduced = reduceMetric(devices, previous, metric);
  
  const better = reduced < previousReduced;

  const comparePercentage = previousReduced === 0 ? 
    null 
    : 
    Math.round((Math.abs(reduced - previousReduced) / previousReduced) * 100);
 
  const showers = getSessionsCount(devices, data);
  const highlight = (showers === 0 || reduced === 0) ? null : getEnergyClass(reduced / showers);
  const hasComparison = better != null && comparePercentage != null;
  const str = better ? 'better' : 'worse';
  return {
    ...widget,
    periods,
    highlight,
    info: [
      {
        icon: better ? 'arrow-down green' : 'arrow-up red',
        text: `${comparePercentage}% ${str} than previous ${period}!`,
        display: hasComparison,
      },
      {
        text: 'No comparison data!',
        display: !hasComparison,
      }
    ].filter(i => i.display),
    mode: 'stats',
    clearComparisons: true,
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
  const xCategoryLabels = getChartMeterCategoryLabels(xCategories, time.granularity, period, intl);
  
  const chartData = data ? data.map(devData => ({ 
      name: getDeviceNameByKey(devices, devData.deviceKey) || 'SWM', 
      data: getChartMeterData(devData.sessions, 
                              xCategories,
                              time,
                              metric
                             ),
    })) : [];

  const forecastChartData = forecastData && forecastData.sessions ? [{
    name: 'Forecast',
    data: getChartMeterData(forecastData.sessions,
                            xCategories, 
                            time,
                            metric
                           ),
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
    mode: 'forecasting',
    clearComparisons: true,
  };
};

const meterPricing = function (widget, devices, intl) {
  const { data, period, deviceType, metric, brackets } = widget;
  
  if (deviceType !== 'METER') {
    console.error('only meter pricing supported');
  } else if (period !== 'month') {
    console.error('only monthly pricing supported');
  }
  const time = widget.time ? widget.time : getTimeByPeriod(period);
  const periods = [];

  const device = getDeviceKeysByType(devices, deviceType);
  
  const mu = getMetricMu(metric);
  const xCategories = getChartMeterCategories(time);
  const xCategoryLabels = getChartMeterCategoryLabels(xCategories, time.granularity, period, intl);

  const priceBrackets = getPriceBrackets(xCategories, brackets, intl);

  const chartData = data ? data.map(devData => ({ 
      name: 'Consumption', 
      data: getChartMeterData(devData.sessions, 
                              xCategories,
                              time,
                              metric,
                              true // augmental
                             ),
    })) : [];

  return {
    ...widget,
    chartType: 'line',
    timeDisplay: intl.formatDate(time.startDate, { month: 'long' }),
    time,
    periods,
    chartCategories: xCategoryLabels,
    chartData: [...chartData, ...priceBrackets],
    mu,
    mode: 'pricing',
    clearComparisons: true,
  };
};
const meterBreakdown = function (widget, devices, intl) {
  const { data, period, deviceType, metric, breakdown = [] } = widget;
  
  if (deviceType !== 'METER') {
    console.error('only meter breakdown makes sense');
  }

  const periods = METER_PERIODS.filter(p => p.id === 'month' || p.id === 'year');

  const device = getDeviceKeysByType(devices, deviceType);
  const reduced = data ? reduceMetric(devices, data, metric) : 0;
  
  const time = widget.time ? widget.time : getTimeByPeriod(period);

  const sessions = prepareBreakdownSessions(devices,
                                            data,
                                            metric,
                                            breakdown,
                                            null,
                                            time.startDate,
                                            time.granularity,
                                            intl
                                           );

  const chartColors = ['#abaecc', '#8185b2', '#575d99', '#2d3480'];
  const chartCategories = sessions.map(x => intl.formatMessage({ id: `breakdown.${x.title}` }).split(' ').join('\n'));
  const chartData = [{
    name: 'Consumption',
    data: sessions.map(x => x[metric]),
  }];
  
  const mu = getMetricMu(metric);

  return {
    ...widget,
    time,
    periods,
    chartType: 'horizontal-bar',
    chartCategories,
    chartColors,
    chartData,
    mu,
    clearComparisons: true,
    mode: 'breakdown',
  };
};

const meterComparison = function (widget, devices, intl) {
  const { data, period, periodIndex, deviceType, metric, comparisons } = widget;
  
  if (deviceType !== 'METER') {
    console.error('only meter comparison supported');
    return {};
  }

  const time = widget.time ? widget.time : getTimeByPeriod(period, periodIndex);
  const periods = [];
  const chartColors = ['#f5dbd8', '#ebb7b1', '#a3d4f4', '#2d3480'];

  const chartCategories = Array.isArray(comparisons) ? comparisons.map(comparison => intl.formatMessage({ id: `comparisons.${comparison.id}` })) : []; 

  const chartData = [{ 
    name: 'Comparison', 
    data: Array.isArray(comparisons) ? 
      comparisons.map(comparison => comparison.sessions.reduce((p, c) => c ? p + c[metric] : p, 0) : null) 
      : [],
  }];

  const mu = 'lt';
 
  return {
    ...widget,
    timeDisplay: intl.formatDate(time.startDate, { month: 'long' }),
    time,
    periods,
    chartType: 'horizontal-bar',
    chartCategories,
    chartColors,
    chartData,
    mu,
    comparisonData: comparisons.filter(c => c.id !== 'user'), 
  };
};

const waterIQ = function (widget, devices, intl) {
  const { data, period, periodIndex, deviceType, metric, waterIQData } = widget;
  
  if (deviceType !== 'METER') {
    console.error('only meter supported for water iq');
    return {};
  }

  const time = widget.time ? widget.time : getTimeByPeriod(period, periodIndex);
  const periods = [];
  
  const hasWaterIQ = Array.isArray(waterIQData) && waterIQData.length > 0;
  const current = hasWaterIQ ? waterIQData.find(s => s.timestamp === time.startDate) : {};
  const best = hasWaterIQ ? waterIQData.reduce((p, c) => c.user < p.user ? c : p, waterIQData[0]) : {};
  const worst = hasWaterIQ ? waterIQData.reduce((p, c) => c.user > p.user ? c : p, waterIQData[0]) : {};

  const highlight = current ? current.user : null;
  const highlightImg = highlight ? `energy-${highlight}.svg` : null;

  const chartColors = ['#f5dbd8', '#ebb7b1', '#a3d4f4', '#2d3480'];
  const comparisons = ['user', 'all', 'nearest', 'similar']; 
  const chartCategories = Array.isArray(comparisons) ? comparisons.map(comparison => intl.formatMessage({ id: `comparisons.${comparison}` })) : []; 

  const chartData = [{ 
    name: 'Water IQ', 
    data: Array.isArray(comparisons) ? 
      comparisons.map(comparison => current ? waterIQToNumeral(current[comparison]) : null) 
      : [],
  }];
  return {
    ...widget,
    timeDisplay: intl.formatDate(time.startDate, { month: 'long' }),
    time,
    periods,
    info: [
      {
        icon: 'arrow-up green',
        text: `${intl.formatDate(best.timestamp, { month: 'long' })} is the best (${best.user}) of the last six months!`,
        display: hasWaterIQ,
      },
      {
        icon: 'arrow-down red',
        text: `${intl.formatDate(worst.timestamp, { month: 'long' })} is the worst (${worst.user}) of the last six months!`,
        display: hasWaterIQ,
      },
      {
        text: 'Water IQ data not computed yet!',
        display: !hasWaterIQ,
      }
    ].filter(i => i.display),
    chartType: 'horizontal-bar',
    chartColors,
    chartCategories,
    chartData,
    formatter: y => numeralToWaterIQ(y),
    highlightImg,
    waterIQData,
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
    case 'pricing':
      return meterPricing(widget, devices, intl); 
    case 'breakdown':
      return meterBreakdown(widget, devices, intl);  
    case 'comparison':
      return meterComparison(widget, devices, intl);
    case 'budget':
      return budget(widget, devices, intl);
    case 'wateriq': 
      return waterIQ(widget, devices, intl);
    default:
      return widget;
  }
};

module.exports = prepareWidget;
