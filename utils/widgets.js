const moment = require('moment');

const { STATIC_RECOMMENDATIONS, STATBOX_DISPLAYS, PERIODS, BASE64, IMAGES } = require('../constants/HomeConstants');

const { getFriendlyDuration, getEnergyClass, waterIQToNumeral, numeralToWaterIQ, displayMetric, formatMetric, showerFilterToLength } = require('./general');
const { getChartMeterData, getChartAmphiroData, getChartMeterCategories, getChartMeterCategoryLabels, getChartAmphiroCategories, getChartPriceBrackets, colorFormatterSingle } = require('./chart');
const { getTimeByPeriod } = require('./time');
const { getDeviceTypeByKey, getDeviceNameByKey, getDeviceKeysByType } = require('./device');
const { reduceMetric, getShowerById, getSessionsCount, prepareBreakdownSessions, preparePricingSessions } = require('./sessions');
const { stripTags } = require('./messages');

const tip = function (widget, intl) {
  const { tip: currTip } = widget;
  if (!currTip) {
    return {
      ...widget,
      highlight: {},
      info: [{
        text: intl.formatMessage({ id: 'widget.no-tips' }),
      }],
      notificationType: 'RECOMMENDATION_STATIC',
      linkTo: 'notifications',
    };
  }
  const description = String(stripTags(currTip).description);
  const text = description;
  return {
    ...widget,
    highlight: {
      image: currTip.imageEncoded ? `${BASE64}${currTip.imageEncoded}` : null,
    },
    info: [{
      text,
    }],
    notificationType: 'RECOMMENDATION_STATIC',
    notificationId: currTip.id,
    linkTo: 'notifications',
  };
};

const amphiroLastShower = function (widget, intl) {
  const { data = [], devices, device, showerId, metric = 'volume', timestamp, unit } = widget;

  const lastSession = getShowerById(data.find(d => d.deviceKey === device), showerId);
  const measurements = lastSession ? lastSession.measurements : [];
  const chartCategories = Array.isArray(measurements) ? measurements.map(m => moment(m.timestamp).format('hh:mm:ss')) : [];
  const chartData = [{
    name: getDeviceNameByKey(devices, device) || '', 
    data: Array.isArray(measurements) ? measurements.map(m => m ? m[metric] : null) : [],
  }];
  const chartFormatter = y => displayMetric(formatMetric(y, metric, unit));
  return {
    ...widget,
    icon: `${IMAGES}/shower.svg`,
    more: intl.formatMessage({ id: 'widget.explore-last-shower' }),
    chartCategories,
    timeDisplay: intl.formatRelative(timestamp),
    chartData,
    chartFormatter,
    highlight: {
      image: `${IMAGES}/volume.svg`,
      text: lastSession ? formatMetric(lastSession[metric], metric, unit) : null,
    },
    info: lastSession ? [
      {
        image: `${IMAGES}/energy.svg`,
        text: displayMetric(formatMetric(lastSession.energy, 'energy', unit)),
      },
      {
        image: `${IMAGES}/timer-on.svg`,
        text: getFriendlyDuration(lastSession.duration),
      },
      {
        image: `${IMAGES}/temperature.svg`,
        text: displayMetric(formatMetric(lastSession.temperature, 'temperature', unit)),
      }
    ] : [],
    mode: 'stats',
    clearComparisons: true,
  };
};

const amphiroMembersRanking = function (widget, intl) {
  const { devices, device, metric = 'volume', data = [], unit } = widget;
  
  const periods = PERIODS.AMPHIRO;
  const membersData = data.map(m => ({ 
    ...m, 
    average: reduceMetric(m.sessions, metric, true),
    showers: m.sessions.reduce((p, c) => p + c.sessions.length, 0),
  }))
  .filter(x => x.showers > 0)
  .sort((a, b) => a.average - b.average)
  .filter((x, i) => i < 5);
  
  const chartCategories = membersData.map(m => m.name); 
  const chartData = [{
    name: intl.formatMessage({ id: 'widget.shower-average' }),
    data: membersData.map(x => x.average),
  }];
  const chartColors = ['#7AD3AB', '#abaecc', '#2d3480', '#808285', '#CD4D3E'];

  const chartColorFormatter = colorFormatterSingle(chartColors);
  const chartFormatter = y => displayMetric(formatMetric(y, metric, unit));

  return {
    ...widget,
    icon: `${IMAGES}/goals.svg`,
    more: intl.formatMessage({ id: 'widget.explore-comparisons' }),
    periods,
    chartCategories,
    chartFormatter,
    chartData,
    legend: false,
    chartColorFormatter,
    chartType: 'bar',
    mode: 'stats',
    info: membersData.map((m, i) => ({
      image: `${IMAGES}/rank-${i + 1}.svg`,
    })),
    data: null,
    memberFilter: membersData.length > 0 ? membersData[0].index : null,
    comparisons: membersData.filter((x, i) => i > 0).map(x => String(x.index)),
  };
};

// TODO: split into two functions for amphiro / swm
const amphiroOrMeterTotal = function (widget, intl) {
  const { data = [], period, devices, deviceType, metric = 'volume', previous, unit } = widget;
  
  const time = widget.time ? widget.time : getTimeByPeriod(period);
  const device = getDeviceKeysByType(devices, deviceType);
  const periods = deviceType === 'AMPHIRO' ? 
    PERIODS.AMPHIRO.filter(p => p.id !== 'all') 
    : 
    PERIODS.METER.filter(p => p.id !== 'custom' && p.id !== 'trimester');

  const average = deviceType === 'AMPHIRO' && (metric === 'temperature' || metric === 'duration');
  const reduced = reduceMetric(data, metric, average);
  const previousReduced = reduceMetric(previous, metric, average);

  const better = reduced < previousReduced;
  const comparePercentage = previousReduced === 0 ?
    null
    :
    Math.round((Math.abs(reduced - previousReduced) / previousReduced) * 100);
    
  const chartCategories = deviceType === 'AMPHIRO' ?
    getChartAmphiroCategories(period)
    :
    getChartMeterCategoryLabels(getChartMeterCategories(time), time.granularity, period, intl);

  const chartFormatter = y => displayMetric(formatMetric(y, metric, unit));
  const chartData = Array.isArray(data) ? data.map((devData) => {
    const sessions = devData.sessions 
    .map(session => ({
      ...session,
      duration: Math.round(100 * (session.duration / 60)) / 100,
      energy: Math.round(session.energy / 10) / 100,
    }));
    
    return {
      name: deviceType === 'METER' ? intl.formatMessage({ id: 'devices.meter' }) : getDeviceNameByKey(devices, devData.deviceKey), 
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
    icon: `${IMAGES}/${metric}.svg`,
    more: deviceType === 'AMPHIRO' ? intl.formatMessage({ id: 'widget.explore-showers' }) : intl.formatMessage({ id: 'widget.explore-swm' }),
    time,
    periods,
    highlight: {
      text: formatMetric(reduced, metric, unit, reduced),
    },
    info: [
      {
        image: better ? `${IMAGES}/better.svg` : `${IMAGES}/worse.svg`,
        text: intl.formatMessage({ 
          id: `comparisons.${str}-${deviceType}`, 
        }, {
          percent: comparePercentage, 
          period: deviceType === 'AMPHIRO' ? showerFilterToLength(period) : intl.formatMessage({ id: `comparisons.${period}` }), 
        }),
        display: hasComparison,
      },
      {
        text: intl.formatMessage({ id: 'comparisons.no-data' }),
        display: !hasComparison,
      }
    ].filter(i => i.display),
    chartCategories,
    chartFormatter,
    chartData,
    mode: 'stats',
    clearComparisons: true,
  };
};

const amphiroEnergyEfficiency = function (widget, intl) {
  const { data = [], period, devices, deviceType, previous } = widget;

  if (deviceType !== 'AMPHIRO') {
    console.error('only amphiro energy efficiency supported');
  }
  const metric = 'energy';

  const device = getDeviceKeysByType(devices, deviceType);
  const periods = PERIODS.AMPHIRO.filter(p => p.id !== 'all');

  const reduced = reduceMetric(data, metric, true);
  const previousReduced = reduceMetric(previous, metric, true);
  
  const better = reduced < previousReduced;

  const comparePercentage = previousReduced === 0 ? 
    null 
    : 
    Math.round((Math.abs(reduced - previousReduced) / previousReduced) * 100);
 
  const showers = getSessionsCount(data);
  const highlight = (showers === 0 || reduced === 0) ? null : getEnergyClass(reduced / showers);
  const hasComparison = better != null && comparePercentage != null;
  const str = better ? 'better' : 'worse';
  return {
    ...widget,
    icon: `${IMAGES}/energy.svg`,
    periods,
    highlight: {
      text: highlight,
    },
    info: [
      {
        image: better ? `${IMAGES}/better.svg` : `${IMAGES}/worse.svg`,
        text: intl.formatMessage({ 
          id: `comparisons.${str}-${deviceType}`,
        }, { 
          percent: comparePercentage, 
          period: showerFilterToLength(period), 
        }),
        display: hasComparison,
      },
      {
        text: intl.formatMessage({ id: 'comparisons.no-data' }),
        display: !hasComparison,
      }
    ].filter(i => i.display),
    mode: 'stats',
    clearComparisons: true,
  };
};

const meterForecast = function (widget, intl) {
  const { data = [], forecastData, period, periodIndex, deviceType, metric = 'volume', previous, unit } = widget;
  
  if (deviceType !== 'METER') {
    console.error('only meter forecast supported');
  }
  const time = widget.time || getTimeByPeriod(period, periodIndex);
  const forecastTime = widget.forecastTime || time;

  const periods = []; 

  const chartColors = ['#2d3480', '#abaecc', '#7AD3AB', '#CD4D3E'];

  const xCategories = getChartMeterCategories(forecastTime);
  const xCategoryLabels = getChartMeterCategoryLabels(xCategories, forecastTime.granularity, period, intl);
  
  const chartFormatter = y => displayMetric(formatMetric(y, metric, unit));
  const chartData = data.map(devData => ({ 
      name: intl.formatMessage({ id: 'widget.consumption' }), 
      data: getChartMeterData(devData.sessions, 
                              xCategories,
                              forecastTime,
                              metric
                             ),
    }));

  const forecastChartData = Array.isArray(forecastData) ? [{
    name: intl.formatMessage({ id: 'history.forecast' }),
    data: getChartMeterData(forecastData,
                            xCategories, 
                            forecastTime,
                            metric
                           ),
    lineType: 'dashed',
    color: '#2d3480',
    fill: 0,
    symbol: 'emptyRectangle',
  }]
  : [];

  return {
    ...widget,
    chartType: 'line',
    timeDisplay: moment(time.startDate).year(),
    time,
    periods,
    chartCategories: xCategoryLabels,
    chartFormatter,
    chartData: [...chartData, ...forecastChartData],
    mode: 'forecasting',
    clearComparisons: true,
  };
};

const meterPricing = function (widget, intl) {
  const { data = [], period, deviceType, brackets, unit } = widget;
  
  if (deviceType !== 'METER') {
    console.error('only meter pricing supported');
  }
  const metric = 'total';
  const time = widget.time ? widget.time : getTimeByPeriod(period);
  const periods = [];

  const meterSessions = Array.isArray(data) && data.length === 1 ? data[0].sessions : [];
  const sessions = preparePricingSessions(meterSessions, 
                                          brackets, 
                                          time.granularity,
                                          null,
                                          intl
                                         );

  const xCategories = getChartMeterCategories(time);
  const xCategoryLabels = getChartMeterCategoryLabels(xCategories, time.granularity, period, intl);

  const priceBrackets = getChartPriceBrackets(xCategories, brackets, unit, intl);
  
  const chartFormatter = y => displayMetric(formatMetric(y, metric, unit, Math.max(...brackets.map(x => x.minVolume))));

  const chartData = data.map(devData => ({ 
      name: intl.formatMessage({ id: `history.${metric}` }), 
      data: getChartMeterData(sessions, 
                              xCategories,
                              time,
                              metric
                             ),
    }));

  return {
    ...widget,
    icon: `${IMAGES}/money-navy.svg`,
    chartType: 'line',
    timeDisplay: `${intl.formatDate(time.startDate, { month: 'long' })} - ${intl.formatDate(time.endDate, { month: 'long' })}`,
    time,
    periods,
    chartCategories: xCategoryLabels,
    chartFormatter,
    chartData: [...chartData, ...priceBrackets],
    mode: 'pricing',
    clearComparisons: true,
  };
};

const meterBreakdown = function (widget, intl) {
  const { data = [], period, devices, deviceType, metric = 'volume', breakdown = [], unit } = widget;
  
  if (deviceType !== 'METER') {
    console.error('only meter breakdown makes sense');
  }

  const periods = PERIODS.METER.filter(p => p.id === 'month' || p.id === 'year');

  const reduced = reduceMetric(data, metric);
  
  const time = widget.time ? widget.time : getTimeByPeriod(period);

  const sessions = prepareBreakdownSessions(data,
                                            metric,
                                            breakdown,
                                            null,
                                            time.startDate,
                                            time.granularity,
                                            intl
                                           );

  const chartData = [{
    name: intl.formatMessage({ id: `history.${metric}` }),
    data: sessions.map(x => x[metric]),
  }];

  const chartColors = ['#abaecc', '#8185b2', '#575d99', '#2d3480'];
  const chartColorFormatter = colorFormatterSingle(chartColors);

  const chartFormatter = y => displayMetric(formatMetric(y, metric, unit, Math.max(...((chartData.length > 0 && chartData[0].data) || []))));

  const chartCategories = sessions.map(x => intl.formatMessage({ id: `breakdown.${x.id}` }).split(' ').join('\n'));
  
  return {
    ...widget,
    icon: `${IMAGES}/stats-side.svg`,
    time,
    periods,
    chartType: 'horizontal-bar',
    chartCategories,
    chartColorFormatter,
    chartFormatter,
    chartData,
    clearComparisons: true,
    mode: 'stats',
  };
};

const meterComparison = function (widget, intl) {
  const { data, period, periodIndex, deviceType, metric = 'volume', comparisons, unit } = widget;
  
  if (deviceType !== 'METER') {
    console.error('only meter comparison supported');
    return {};
  }

  const time = widget.time ? widget.time : getTimeByPeriod(period, periodIndex);
  const periods = [];
  const chartColors = ['#f5dbd8', '#ebb7b1', '#a3d4f4', '#2d3480'];
  const chartColorFormatter = colorFormatterSingle(chartColors);

  const chartCategories = Array.isArray(comparisons) ? 
    comparisons.map(comparison => intl.formatMessage({ id: `comparisons.${comparison.id}` })) 
    : []; 

  const chartData = [{ 
    name: 'Comparison', 
    data: Array.isArray(comparisons) ? 
      comparisons.map(comparison => comparison.sessions.reduce((p, c) => c ? p + c[metric] : p, 0) : null) 
      : [],
  }];

  const chartFormatter = y => displayMetric(formatMetric(y, metric, unit, Math.max(...((chartData.length > 0 && chartData[0].data) || []))));
 
  return {
    ...widget,
    icon: `${IMAGES}/stats-side.svg`,
    timeDisplay: intl.formatDate(time.startDate, { month: 'long' }),
    time,
    periods,
    chartType: 'horizontal-bar',
    chartCategories,
    chartColorFormatter,
    chartFormatter,
    chartData,
    mode: 'stats',
    comparisonData: Array.isArray(comparisons) ? comparisons.filter(c => c.id !== 'user') : [], 
  };
};

const waterIQ = function (widget, intl) {
  const { data, period, periodIndex, deviceType, metric = 'volume' } = widget;
  
  if (deviceType !== 'METER') {
    console.error('only meter supported for water iq');
    return {};
  }

  const time = widget.time ? widget.time : getTimeByPeriod(period, periodIndex);
  const periods = [];
  
  const current = Array.isArray(data) && data.length > 0 && data.find(s => s.timestamp === time.startDate);

  const hasWaterIQ = current !== false && current != null;
  
  const best = hasWaterIQ ? data.reduce((p, c) => c.user < p.user ? c : p, data[0]) : {};
  const worst = hasWaterIQ ? data.reduce((p, c) => c.user > p.user ? c : p, data[0]) : {};

  const highlight = hasWaterIQ ? null : '-';
  const highlightImg = hasWaterIQ ? `${IMAGES}/energy-${current.user}.svg` : null;

  const chartColors = ['#f5dbd8', '#ebb7b1', '#a3d4f4', '#2d3480'];
  const chartColorFormatter = colorFormatterSingle(chartColors);
  const comparisons = ['similar', 'nearest', 'all', 'user']; 
  const chartCategories = Array.isArray(comparisons) ? comparisons.map(comparison => intl.formatMessage({ id: `comparisons.${comparison}` })) : []; 

  const chartData = [{ 
    name: intl.formatMessage({ id: 'history.wateriq' }), 
    data: Array.isArray(comparisons) ? 
      comparisons.map(comparison => current ? waterIQToNumeral(current[comparison]) : null) 
      : [],
  }];
  return {
    ...widget,
    icon: `${IMAGES}/default-ranking.svg`,
    timeDisplay: intl.formatDate(time.startDate, { month: 'long' }),
    display: hasWaterIQ ? widget.display : 'stat',
    //time,
    periods,
    info: [
      {
        image: `${IMAGES}/better.svg`,
        text: intl.formatMessage({
          id: 'comparisons.wateriq-best',
        }, {
          value: best.user,
          month: intl.formatDate(best.timestamp, { month: 'long' }),
        }),
        display: hasWaterIQ,
      },
      {
        image: `${IMAGES}/worse.svg`,
        text: intl.formatMessage({
          id: 'comparisons.wateriq-worst',
        }, {
          value: worst.user,
          month: intl.formatDate(worst.timestamp, { month: 'long' }),
        }),
        display: hasWaterIQ,
      },
      {
        text: intl.formatMessage({ id: 'comparisons.wateriq-no-data' }),
        display: !hasWaterIQ,
      }
    ].filter(i => i.display),
    chartType: 'horizontal-bar',
    chartColorFormatter,
    chartCategories,
    chartData,
    chartFormatter: y => numeralToWaterIQ(y),
    highlight: {
      text: highlight,
      image: highlightImg,
    },
    mode: 'wateriq',
    period: 'year',
    comparisonData: widget.display === 'chart' ? comparisons.map(c => ({ id: c, sessions: [] })) : [],
    time: getTimeByPeriod('year'),
  };
};

const budget = function (widget, intl) {
  const { data, period, devices, deviceType, metric, previous } = widget;
  
  if (deviceType !== 'METER') {
    console.error('only meter comparison supported');
  }

  const periods = PERIODS.METER.filter(p => p.id !== 'custom');
  const reduced = reduceMetric(data, metric);
  
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
    highlight: {
      text: reduced,
    },
    chartData,
    chartColors,
  };
};

const meterCommon = function (widget, intl) {
  const { data = [], period, devices, deviceType, metric = 'volume', common, commonData, unit } = widget;
  
  if (!common) {
    return {
      ...widget,
      error: intl.formatMessage({ id: 'widget.empty-or-no-fav-common' }),
    };
  }
  const time = widget.time ? widget.time : getTimeByPeriod(period);
  const periods = PERIODS.METER.filter(p => p.id !== 'custom' && p.id !== 'day');

  const reduced = reduceMetric(data, metric);

  const xCategories = getChartMeterCategories(time);
  const chartCategories = getChartMeterCategoryLabels(xCategories, time.granularity, period, intl);
  const chartFormatter = y => displayMetric(formatMetric(y, metric, unit));

  
  const chartData = data.map(devData => ({ 
      name: intl.formatMessage({ id: 'common.me' }), 
      data: getChartMeterData(devData.sessions, 
                              xCategories,
                              time,
                              metric
                             ),
    }));

  
  const commonChartData = Array.isArray(commonData) ? [{
    name: common.name,
    data: getChartMeterData(commonData,
                            xCategories, 
                            time,
                            metric
                           ),
    fill: 0,
    symbol: 'emptyRectangle',
  }]
  : [];

  return {
    ...widget,
    icon: common.image ? `${BASE64}${common.image}` : null,
    more: intl.formatMessage({ id: 'widget.explore-common' }),
    chartType: 'line',
    time,
    periods,
    chartCategories: chartCategories,
    chartFormatter,
    chartData: [...chartData, ...commonChartData],
    linkTo: 'commons',
  };
};

const prepareWidget = function (widget, intl) {
  switch (widget.type) {
    case 'tip': 
      return tip(widget, intl);
    case 'last': 
      return amphiroLastShower(widget, intl);
    case 'ranking': 
      return amphiroMembersRanking(widget, intl);
    case 'total':
      return amphiroOrMeterTotal(widget, intl); 
    case 'efficiency':
      return amphiroEnergyEfficiency(widget, intl); 
    case 'forecast':
      return meterForecast(widget, intl); 
    case 'pricing':
      return meterPricing(widget, intl); 
    case 'breakdown':
      return meterBreakdown(widget, intl);  
    case 'comparison':
      return meterComparison(widget, intl);
    case 'budget':
      return budget(widget, intl);
    case 'wateriq': 
      return waterIQ(widget, intl);
    case 'commons':
      return meterCommon(widget, intl);
    default:
      return widget;
  }
};

module.exports = prepareWidget;
