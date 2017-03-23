const { meter: meterSchema, amphiro: amphiroSchema, breakdown: breakdownSchema } = require('../schemas/history');

const { bringPastSessionsToPresent } = require('./time');
const { getChartMeterData, getChartAmphiroData, getChartMeterCategories, getChartMeterCategoryLabels, getChartAmphiroCategories, mapMeterDataToChart, mapAmphiroDataToChart, getTimeLabelByGranularity } = require('./chart');
const { getDeviceNameByKey, getDeviceKeysByType } = require('./device');
const { getLastShowerIdFromMultiple, getComparisonTitle, getAllMembers, prepareSessionsForTable, reduceMetric, sortSessions, meterSessionsToCSV, deviceSessionsToCSV, hasShowersBefore, hasShowersAfter, getComparisons, prepareBreakdownSessions } = require('./sessions');
const { formatMessage, getMetricMu, getPriceBrackets } = require('./general');


const getStatsMeterData = function (props) {
  const _t = formatMessage(props.intl);
  const members = getAllMembers(props.members, props.user.firstname);
  const favoriteCommonName = props.favoriteCommon ? props.myCommons.find(c => c.key === props.favoriteCommon).name : '';

  // TABLE
  const sessions = sortSessions(prepareSessionsForTable(props.devices, 
                                                        props.data, 
                                                        members,
                                                        props.user.firstname, 
                                                        props.time.granularity,
                                                        props.intl
                                                       ),
                                    props.sortFilter, 
                                    props.sortOrder
                );
                
  const sessionFields = meterSchema;
    
  const csvData = meterSessionsToCSV(sessions);

  const reducedMetric = reduceMetric(props.devices, props.data, props.filter);
  const mu = getMetricMu(props.filter);
    
  // CHART

  const chartFormatter = y => `${y} ${mu}`;
  const xCategories = getChartMeterCategories(props.time);
      
  const chartCategories = getChartMeterCategoryLabels(xCategories, props.time.granularity, props.timeFilter, props.intl);
     
  const chartData = props.data.map(devData => ({
    name: 'SWM',
    data: getChartMeterData(devData.sessions,
                            xCategories, 
                            props.time,
                            props.filter,
                            props.pricing
                           ),
    metadata: {
      ids: mapMeterDataToChart(devData.sessions, 
                               xCategories, 
                               props.time)
                               .map(val => val ? [val.id, val.timestamp] : [null, null]),
    },
  }));
      
  const comparisonsData = props.comparisons.map((comparison) => {
    const compSessions = comparison.id === 'last' ? 
      bringPastSessionsToPresent(comparison.sessions, props.timeFilter) 
      : 
      comparison.sessions;
    return ({
      name: getComparisonTitle(props.activeDeviceType,
                               comparison.id, 
                               props.time.startDate,
                               props.timeFilter, 
                               favoriteCommonName, 
                               members,
                               _t
                              ),
     data: getChartMeterData(compSessions, 
                      xCategories, 
                      props.time, 
                      props.filter,
                      props.pricing
                     ),
      fill: 0.1,
    });
  }); 

  return {
    //Table
    sessions,
    sessionFields,
    csvData,
    reducedMetric,
    //Chart
    xCategories,
    chartType: 'line',
    chartCategories,
    chartFormatter,
    chartData: [
      ...chartData,
      ...comparisonsData,
    ],
    mu,
  };
};

const getStatsAmphiroData = function (props) {
  const _t = formatMessage(props.intl);
  const members = getAllMembers(props.members, props.user.firstname);
  const favoriteCommonName = props.favoriteCommon ? props.myCommons.find(c => c.key === props.favoriteCommon).name : '';

  // TABLE
  const sessions = sortSessions(prepareSessionsForTable(props.devices, 
                                                        props.data, 
                                                        members,
                                                        props.user.firstname, 
                                                        props.time.granularity,
                                                        props.intl
                                                       ),
                                    props.sortFilter, 
                                    props.sortOrder
                );
                
  const sessionFields = amphiroSchema;
    
  const csvData = deviceSessionsToCSV(sessions);

  const reducedMetric = reduceMetric(props.devices, props.data, props.filter);
  const mu = getMetricMu(props.filter);
  
  // CHART

  const xCategories = getChartAmphiroCategories(props.timeFilter, getLastShowerIdFromMultiple(props.data));
      
  const chartCategories = xCategories;
  const chartFormatter = y => `${y} ${mu}`;
     
  const chartData = props.data.map((devData) => {  
    const memberName = props.memberFilter === 'all' ? 'All' : members.find(m => props.memberFilter === m.index).name;
    const devName = getDeviceNameByKey(props.devices, devData.deviceKey);
    return {
      name: memberName + ' (' + devName + ')', 
      data: getChartAmphiroData(devData.sessions, xCategories, props.filter),
      metadata: {
        device: devData.deviceKey,
        ids: mapAmphiroDataToChart(devData.sessions, 
                                   xCategories, 
                                   props.time)
                                   .map(val => val ? [val.id, val.timestamp] : [null, null]),
      },
    };
  });
  
  const comparisonsData = props.comparisons.map(comparison => comparison.sessions.map(dev => ({
      name: getComparisonTitle(props.activeDeviceType,
                               comparison.id, 
                               props.time.startDate,
                               props.timeFilter, 
                               favoriteCommonName, 
                               members,
                               _t
                              ) + ' (' + dev.name + ')',
     data: getChartAmphiroData(dev.sessions, xCategories, props.filter),
     fill: 0.1,
    }))).reduce((p, c) => [...p, ...c], []);

  return {
    //Table
    sessions,
    sessionFields,
    csvData,
    reducedMetric,
    //Chart
    xCategories,
    chartType: 'line',
    chartCategories,
    chartFormatter,
    chartData: [
      ...chartData,
      ...comparisonsData,
    ],
    mu,
  };
};

const getStatsData = function (props) {
  switch (props.activeDeviceType) {
    case 'METER':
      return getStatsMeterData(props);
    case 'AMPHIRO':
      return getStatsAmphiroData(props);
    default:
      return {};
  }
};

const getForecastData = function (props) {
  const statsData = getStatsData(props);
  const forecastData = props.forecasting && props.forecastData ? 
    [{
      name: 'Forecast',
      data: getChartMeterData(props.forecastData.sessions,
                        statsData.xCategories, 
                        props.time,
                        props.filter
                       ),
      lineType: 'dashed',
      color: '#2d3480',
      fill: 0.1,
      symbol: 'emptyRectangle',
    }]
    : [];
  
  return {
    ...statsData,
    chartData: [
      ...statsData.chartData,
      ...forecastData,
    ],
  };
};

const getPricingData = function (props) {
  const statsData = getStatsData(props);
  const priceBrackets = props.pricing && props.priceBrackets ? getPriceBrackets(statsData.xCategories, props.priceBrackets, props.intl) : [];
  return {
    ...statsData,
    chartData: [
      ...statsData.chartData,
      ...priceBrackets,
    ],
  };
};

const getBreakdownData = function (props) {
  const statsData = getStatsData(props);
  const _t = formatMessage(props.intl);
  const members = getAllMembers(props.members, props.user.firstname);
  const favoriteCommonName = props.favoriteCommon ? props.myCommons.find(c => c.key === props.favoriteCommon).name : '';

  const chartColors = ['#abaecc', '#8185b2', '#575d99', '#2d3480'];

  const sessions = prepareBreakdownSessions(props.devices,
                                            props.data,
                                            props.filter,
                                            props.waterBreakdown,
                                            props.user.firstname,
                                            props.time.startDate,
                                            props.timeFilter,
                                            props.intl
                                           );

  const sessionsSorted = sortSessions(sessions, props.sortFilter, props.sortOrder);
  const chartCategories = sessions.map(x => props.intl.formatMessage({ id: `breakdown.${x.title}` }));
  const chartData = [{
    name: 'Consumption',
    data: sessions.map(x => x[props.filter]),
    metadata: {
      ids: sessions.map(x => x ? [x.id, x.timestamp] : [null, null]),
    }, 
  },
  ...props.comparisons.map(comparison => ({
    name: getComparisonTitle(props.activeDeviceType,
                             comparison.id, 
                             props.time.startDate,
                             props.timeFilter, 
                             favoriteCommonName, 
                             members,
                             _t
                            ),
    data: prepareBreakdownSessions(props.devices,
                                   [{ sessions: comparison.sessions }],
                                   props.filter,
                                   props.waterBreakdown,
                                   props.user.firstname,
                                   props.time.startDate,
                                   props.timeFilter,
                                   props.intl
                                  )
.map(x => x[props.filter]),
  }))
  ];

  console.log('chart data', chartData, props);
  return {
    ...statsData,
    sessions: sessionsSorted,
    chartType: 'bar',
    chartCategories,
    chartColors,
    chartData,
    sessionFields: breakdownSchema, 
  };
};

const getHistoryData = function (props) {
  const { mode } = props;
  switch (mode) {
    case 'stats':
      return getStatsData(props);
    case 'forecasting':
      return getForecastData(props);
    case 'pricing':
      return getPricingData(props);
    case 'breakdown':
      return getBreakdownData(props);
    default:
      return getStatsData(props);
  }
};

module.exports = {
  getHistoryData,
};
