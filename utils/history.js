const moment = require('moment');

const schemas = require('../schemas/history');

const { bringPastSessionsToPresent, convertGranularityToPeriod, getTimeLabelByGranularity } = require('./time');
const { getDeviceNameByKey, getDeviceKeysByType } = require('./device');
const { formatMessage, getMetricMu, waterIQToNumeral, numeralToWaterIQ } = require('./general');

const { getComparisons, getComparisonTitle } = require('./comparisons');

const { 
  getChartMeterData, 
  getChartAmphiroData, 
  getChartMeterCategories, 
  getChartMeterCategoryLabels, 
  getChartAmphiroCategories, 
  mapMeterDataToChart, 
  mapAmphiroDataToChart, 
  getChartPriceBrackets 
} = require('./chart');

const { 
  getLastShowerIdFromMultiple,  
  reduceMetric, 
  sortSessions, 
  prepareSessionsForTable, 
  prepareBreakdownSessions, 
  preparePricingSessions, 
} = require('./sessions');


const getStatsMeterData = function (props) {
  // TABLE
  const sessions = sortSessions(prepareSessionsForTable(props.devices, 
                                                        props.data, 
                                                        props.members,
                                                        props.user.firstname, 
                                                        props.time.granularity,
                                                        props.intl
                                                       ),
                                    props.sortFilter, 
                                    props.sortOrder
                );
                
    
  const reducedMetric = reduceMetric(props.devices, props.data, props.filter);
  const mu = getMetricMu(props.filter);
  const highlight = `${reducedMetric} ${mu}`;
    
  // CHART

  const chartFormatter = y => `${y} ${mu}`;
  const xCategories = getChartMeterCategories(props.time);
      
  const chartCategories = getChartMeterCategoryLabels(xCategories, props.time.granularity, props.timeFilter, props.intl);
     
  const chartData = props.data.map(devData => ({
    name: 'SWM',
    data: getChartMeterData(devData.sessions,
                            xCategories, 
                            props.time,
                            props.filter
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
                               props.favoriteCommonName, 
                               props.members,
                               props._t
                              ),
     data: getChartMeterData(compSessions, 
                      xCategories, 
                      props.time, 
                      props.filter
                     ),
      fill: 0.1,
    });
  }); 

  return {
    //Table
    sessions,
    sessionFields: schemas.meter,
    reducedMetric,
    highlight,
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
  // TABLE
  const sessions = sortSessions(prepareSessionsForTable(props.devices, 
                                                        props.data, 
                                                        props.members,
                                                        props.user.firstname, 
                                                        props.time.granularity,
                                                        props.intl
                                                       ),
                                    props.sortFilter, 
                                    props.sortOrder
                );
                
  const reducedMetric = reduceMetric(props.devices, props.data, props.filter);
  const mu = getMetricMu(props.filter);
  const highlight = `${reducedMetric} ${mu}`;
  
  // CHART

  const xCategories = getChartAmphiroCategories(props.timeFilter, getLastShowerIdFromMultiple(props.data));
      
  const chartCategories = xCategories;
  const chartFormatter = y => `${y} ${mu}`;
     
  const chartData = props.data.map((devData) => {  
    const memberName = props.memberFilter === 'all' ? 'All' : props.members.find(m => props.memberFilter === m.index).name;
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
                               props.favoriteCommonName, 
                               props.members,
                               props._t
                              ) + ' (' + dev.name + ')',
     data: getChartAmphiroData(dev.sessions, xCategories, props.filter),
     fill: 0.1,
    }))).reduce((p, c) => [...p, ...c], []);

  return {
    //Table
    sessions,
    sessionFields: schemas.amphiro,
    reducedMetric,
    highlight,
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
  const forecastData = props.forecasting && props.forecastData && Array.isArray(props.forecastData.sessions) ? 
    [{
      name: 'Forecast',
      data: getChartMeterData(props.forecastData.sessions,
                        statsData.xCategories, 
                        props.time,
                        props.filter
                       ),
      metadata: {
        ids: mapMeterDataToChart(props.forecastData.sessions, 
                               statsData.xCategories, 
                               props.time)
                               .map(val => val ? [val.id, val.timestamp] : [null, null]),
    },
      lineType: 'dashed',
      color: '#2d3480',
      fill: 0.1,
      symbol: 'emptyRectangle',
    }]
    : [];
    
  const sessions = Array.isArray(props.forecastData.sessions) ? sortSessions(props.forecastData.sessions.map(session => ({
    ...statsData.sessions.find(s => s.timestamp === session.timestamp),
    devName: 'SWM',
    forecast: Math.round(session.volume * 100) / 100,
    timestamp: session.timestamp,
    date: getTimeLabelByGranularity(session.timestamp, 
                                    props.time.granularity, 
                                    props.intl
                                   ),

  })),
    props.sortFilter,
    props.sortOrder
                                                                            ) : [];
  return {
    ...statsData,
    sessionFields: schemas.forecast,
    sessions,
    chartData: [
      ...statsData.chartData,
      ...forecastData,
    ],
  };
};

const getPricingData = function (props) {
  //const statsData = getStatsData(props);

  const meterSessions = Array.isArray(props.data) && props.data.length === 1 ? props.data[0].sessions : [];
  const sessions = sortSessions(preparePricingSessions(meterSessions, 
                                                       props.priceBrackets, 
                                                       props.time.granularity,
                                                       props.user.firstname,
                                                       props.intl
                                                      ),
                                props.sortFilter,
                                props.sortOrder
                               );
  
  const reducedMetric = reduceMetric(props.devices, [{ sessions }], 'cost');
  const highlight = `${reducedMetric} ${getMetricMu('cost')}`;

  // CHART

  const xCategories = getChartMeterCategories(props.time);

  const chartPriceBrackets = props.pricing && props.priceBrackets ? 
    getChartPriceBrackets(xCategories, props.priceBrackets, props.intl) 
    : [];

  const chartFormatter = y => `${y} ${getMetricMu(props.filter)}`;

  const chartCategories = getChartMeterCategoryLabels(xCategories, props.time.granularity, props.timeFilter, props.intl);
     
  const chartData = [{
    name: 'SWM total',
    data: getChartMeterData(sessions,
                            xCategories, 
                            props.time,
                            props.filter
                           ),
    metadata: {
      ids: mapMeterDataToChart(sessions, 
                               xCategories, 
                               props.time)
                               .map(val => val ? [val.id, val.timestamp] : [null, null]),
    },
  }];
  
  const comparisonsData = props.comparisons.map((comparison) => {
    const compSessions = comparison.id === 'last' ? 
      bringPastSessionsToPresent(comparison.sessions, props.timeFilter) 
      : 
      comparison.sessions;

      const sessionsToCompare = preparePricingSessions(compSessions, 
                                                       props.priceBrackets,
                                                       props.time.granularity,
                                                       props.user.firstname,
                                                       props.intl
                                                      );
      return ({
        name: getComparisonTitle(props.activeDeviceType,
                                 comparison.id, 
                                 props.time.startDate,
                                 props.timeFilter, 
                                 props.favoriteCommonName, 
                                 props.members,
                                 props._t
                                ),
       data: getChartMeterData(sessionsToCompare, 
                        xCategories, 
                        props.time, 
                        props.filter
                       ),
        fill: 0.1,
      });
  }); 
  return {
    sessions,
    sessionFields: schemas.pricing,
    reducedMetric,
    highlight,
    chartCategories,
    chartFormatter,
    chartData: [
      ...chartData,
      ...comparisonsData,
      ...chartPriceBrackets,
    ],
  };
};

const getBreakdownData = function (props) {
  const statsData = getStatsData(props);

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
  const chartCategories = sessions.map(x => props._t(`breakdown.${x.id}`));
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
                             props.favoriteCommonName, 
                             props.members,
                             props._t
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

  return {
    ...statsData,
    sessions: sessionsSorted,
    chartType: 'bar',
    chartCategories,
    chartColors,
    chartData,
    sessionFields: schemas.breakdown, 
  };
};

const getWaterIQData = function (props) {
  const statsData = getStatsData(props);

  const waterIQData = props.waterIQData.map(x => ({ 
    ...x, 
    user: waterIQToNumeral(x.user), 
    all: waterIQToNumeral(x.all), 
    similar: waterIQToNumeral(x.similar), 
    nearest: waterIQToNumeral(x.nearest), 
    timestamp: moment(x.from).startOf('month').valueOf(), 
  }));

  const sessions = statsData.sessions.map(session => ({
    ...session,
    wateriq: waterIQData.find(x => x.timestamp === moment(session.timestamp).startOf('month').valueOf()) ? 
      numeralToWaterIQ(waterIQData.find(x => x.timestamp === moment(session.timestamp).startOf('month').valueOf()).user) : null,
  }));
  
  const chartData = [
    { 
      id: 'user', 
      title: 'Water IQ'
    }, 
    ...props.comparisons
  ].map(c => ({
      name: c.title || getComparisonTitle(props.activeDeviceType,
                                          c.id, 
                                          props.time.startDate,
                                          props.timeFilter, 
                                          props.favoriteCommonName, 
                                          props.members,
                                          props._t
                                         ),
     data: getChartMeterData(waterIQData,
                             statsData.xCategories, 
                             props.time,
                             c.id
                            ),
    metadata: {
      ids: mapMeterDataToChart(Array.isArray(props.data) && props.data.length > 0 ? props.data[0].sessions : [], 
                               statsData.xCategories, 
                               props.time)
                               .map(val => val ? [val.id, val.timestamp] : [null, null]),
    },
     //color: '#2d3480',
     fill: 0,
     //symbol: 'emptyRectangle',
     }));
 
  const chartFormatter = y => numeralToWaterIQ(y);
  return {
    ...statsData,
    sessions,
    sessionFields: schemas.wateriq,
    highlight: '',
    chartData,
    chartYMax: 6,
    chartFormatter,
    chartType: 'bar',
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
    case 'wateriq':
      return getWaterIQData(props);
    default:
      return getStatsData(props);
  }
};

module.exports = {
  getHistoryData,
};
