const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const { injectIntl } = require('react-intl');

const HistoryActions = require('../actions/HistoryActions');

const Chart = require('../components/helpers/Chart');

const { addPeriodToSessions } = require('../utils/time');
const { getChartMeterData, getChartAmphiroData, getChartMeterCategories, getChartMeterCategoryLabels, getChartAmphiroCategories, getChartMetadata } = require('../utils/chart');
const { getDeviceNameByKey } = require('../utils/device');
const { getDataSessions } = require('../utils/transformations');
const { getMetricMu } = require('../utils/general');


function mapStateToProps(state) {
  if (!state.user.isAuthenticated) {
    return {};
  }
  return {
    time: state.section.history.time,
    filter: state.section.history.filter,
    devices: state.user.profile.devices,
    activeDeviceType: state.section.history.activeDeviceType,
    timeFilter: state.section.history.timeFilter,
    data: state.section.history.data,
    comparisonData: state.section.history.comparisonData,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(HistoryActions, dispatch);
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  const xData = stateProps.activeDeviceType === 'METER' ? 
    getChartMeterCategories(stateProps.time) : 
      getChartAmphiroCategories(stateProps.timeFilter);

  const chartData = stateProps.data.map((devData) => {
    const sessions = getDataSessions(stateProps.devices, devData)
    .map(session => ({
      ...session,
      duration: Math.round(100 * (session.duration / 60)) / 100,
      energy: Math.round(session.energy / 10) / 100,
    }));
    return ({
      title: getDeviceNameByKey(stateProps.devices, devData.deviceKey), 
      data: stateProps.activeDeviceType === 'METER' ? 
        getChartMeterData(sessions, xData, stateProps.filter, stateProps.time) 
         : 
        getChartAmphiroData(sessions, xData, stateProps.filter),
      metadata: {
        device: devData.deviceKey,
        ids: getChartMetadata(sessions, xData, stateProps.activeDeviceType === 'METER'),
      }
    });
  });

  const xDataLabels = stateProps.activeDeviceType === 'METER' ?
    getChartMeterCategoryLabels(xData, stateProps.time, ownProps.intl)
     : xData;

  const comparison = stateProps.comparisonData.map((devData) => {
    const sessions = getDataSessions(stateProps.devices, devData)
    .map(session => ({
      ...session,
      duration: Math.round(100 * (session.duration / 60)) / 100,
      energy: Math.round(session.energy / 10) / 100,
    }));
    return ({
      title: `${getDeviceNameByKey(stateProps.devices, devData.deviceKey)}` +
         `(previous ${stateProps.timeFilter})`,
      data: stateProps.activeDeviceType === 'METER' ? 
        getChartMeterData(addPeriodToSessions(sessions, stateProps.timeFilter), 
                          xData, 
                          stateProps.filter, 
                          stateProps.time
                         ) 
         : 
         getChartAmphiroData(sessions, xData, stateProps.filter),
    });
  });

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    data: chartData.concat(comparison),
    xAxis: 'category',
    xAxisData: xDataLabels,
    type: 'line',
    mu: getMetricMu(stateProps.filter),
    clickable: true,
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
    dataZoom: true,
    fontSize: 13,
    y2Margin: 70,
    height: 380,
  };
}

const HistoryChart = injectIntl(connect(mapStateToProps, 
                                        mapDispatchToProps, 
                                        mergeProps,
                                       )(Chart));
module.exports = HistoryChart;
