const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const { injectIntl } = require('react-intl');

const HistoryActions = require('../actions/HistoryActions');

const HistoryChart = require('../components/sections/HistoryChart');

const { bringPastSessionsToPresent, getComparisonPeriod } = require('../utils/time');
const { getChartMeterData, getChartAmphiroData, getChartMeterCategories, getChartMeterCategoryLabels, getChartAmphiroCategories, mapMeterDataToChart } = require('../utils/chart');
const { getDeviceNameByKey, getDeviceKeysByType } = require('../utils/device');
const { getLastShowerIdFromMultiple, getComparisons, getComparisonTitle } = require('../utils/sessions');
const { getMetricMu } = require('../utils/general');


function mapStateToProps(state) {
  return {
    time: state.section.history.time,
    filter: state.section.history.filter,
    devices: state.user.profile.devices,
    activeDeviceType: state.section.history.activeDeviceType,
    timeFilter: state.section.history.timeFilter,
    data: state.section.history.data,
    comparisons: state.section.history.comparisons,
    width: state.viewport.width,
    forecasting: state.section.history.forecasting,
    forecastData: state.section.history.forecastData,
    myCommons: state.section.commons.myCommons,
    favoriteCommon: state.section.settings.commons.favorite,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(HistoryActions, dispatch);
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  const xCategories = stateProps.activeDeviceType === 'METER' ? 
    getChartMeterCategories(stateProps.time) : 
      getChartAmphiroCategories(stateProps.timeFilter, getLastShowerIdFromMultiple(stateProps.data));
    
  const xCategoryLabels = stateProps.activeDeviceType === 'METER' ?
    getChartMeterCategoryLabels(xCategories, stateProps.time, ownProps.intl)
     : xCategories;
   
  const favoriteCommonName = stateProps.favoriteCommon ? stateProps.myCommons.find(c => c.key === stateProps.favoriteCommon).name : '';

  const chartData = stateProps.data.map((devData) => {  
    if (stateProps.activeDeviceType === 'METER') {
      return {
        name: 'SWM',
        data: getChartMeterData(devData.sessions,
                          xCategories, 
                          stateProps.time,
                          stateProps.filter,
                         ),
        metadata: {
          ids: mapMeterDataToChart(devData.sessions, xCategories, stateProps.time).map(val => val ? [val.id, val.timestamp] : [null, null]),
        },
      };
    } else if (stateProps.activeDeviceType === 'AMPHIRO') {
      return {
        name: getDeviceNameByKey(stateProps.devices, devData.deviceKey) || '', 
        data: getChartAmphiroData(devData.sessions, xCategories, stateProps.filter),
        metadata: {
          device: devData.deviceKey,
          ids: devData.sessions.map(val => val ? [val.id, val.timestamp] : [null, null])
        },
      };
    }
    return [];
  });

  const comparisons = stateProps.comparisons.map((comparison) => {
    const sessions = comparison.id === 'last' ? 
      bringPastSessionsToPresent(comparison.sessions, stateProps.timeFilter) 
      : 
      comparison.sessions;
    return ({
      name: getComparisonTitle(comparison.id, 
                               stateProps.time, 
                               favoriteCommonName, 
                               ownProps.intl),
      data: getChartMeterData(sessions, 
                              xCategories, 
                              stateProps.time, 
                              stateProps.filter),
      fill: 0.1,
    });
  });
  
  const forecast = stateProps.activeDeviceType === 'METER' && stateProps.forecasting && stateProps.forecastData ? 
    [{
      name: 'Forecast',
      data: getChartMeterData(stateProps.forecastData.sessions,
                        xCategories, 
                        stateProps.time,
                        stateProps.filter
                       ),
      lineType: 'dashed',
      color: '#2d3480',
      fill: 0.1,
      symbol: 'emptyRectangle',
    }]
    : [];

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    xCategoryLabels,
    mu: getMetricMu(stateProps.filter), 
    chartData: [
      ...chartData,
      ...forecast,
      ...comparisons,
    ],
    //chart width = viewport width - main menu - sidebar left - sidebar right - padding
    width: Math.max(stateProps.width - 130 - 160 - 160 - 20, 550),
    onPointClick: (series, index) => {
      const device = chartData[series] ? 
        chartData[series].metadata.device 
        : null;
        
      const [id, timestamp] = chartData[series] 
       && chartData[series].metadata.ids ? 
         chartData[series].metadata.ids[index] 
         : [null, null];
      dispatchProps.setActiveSession(device, id, timestamp);
    },
  };
}

const HistoryChartData = injectIntl(connect(mapStateToProps, 
                                            mapDispatchToProps, 
                                            mergeProps
                                           )(HistoryChart));
module.exports = HistoryChartData;
