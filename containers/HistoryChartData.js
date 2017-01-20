const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const { injectIntl } = require('react-intl');

const HistoryActions = require('../actions/HistoryActions');

const HistoryChart = require('../components/sections/HistoryChart');

const { addPeriodToSessions } = require('../utils/time');
const { getChartMeterData, getChartAmphiroData, getChartMeterCategories, getChartMeterCategoryLabels, getChartAmphiroCategories } = require('../utils/chart');
const { getDeviceNameByKey } = require('../utils/device');
const { getDataSessions } = require('../utils/transformations');
const { getMetricMu } = require('../utils/general');


function mapStateToProps(state) {
  return {
    time: state.section.history.time,
    filter: state.section.history.filter,
    devices: state.user.profile.devices,
    activeDeviceType: state.section.history.activeDeviceType,
    timeFilter: state.section.history.timeFilter,
    data: state.section.history.data,
    comparisonData: state.section.history.comparisonData,
    width: state.viewport.width,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(HistoryActions, dispatch);
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  const xCategories = stateProps.activeDeviceType === 'METER' ? 
    getChartMeterCategories(stateProps.time) : 
      getChartAmphiroCategories(stateProps.timeFilter);

      
  const chartData = stateProps.data.map((devData) => {
    const sessions = getDataSessions(stateProps.devices, devData)
    .map(session => ({
      ...session,
      duration: Math.round(100 * (session.duration / 60)) / 100,
      energy: Math.round(session.energy / 10) / 100,
    }));
  
    const xData = stateProps.activeDeviceType === 'METER' ? 
      getChartMeterData(sessions, xCategories, stateProps.time) 
      : 
      getChartAmphiroData(sessions, xCategories);

    return ({
      name: getDeviceNameByKey(stateProps.devices, devData.deviceKey), 
      data: xData.map(x => x ? x[stateProps.filter] : null),
      metadata: {
        device: devData.deviceKey,
        ids: xData.map(val => val ? [val.id, val.timestamp] : [null, null])
      }
    });
  });

  const xCategoryLabels = stateProps.activeDeviceType === 'METER' ?
    getChartMeterCategoryLabels(xCategories, stateProps.time, ownProps.intl)
     : xCategories;

  const comparison = stateProps.comparisonData.map((devData) => {
    const sessions = getDataSessions(stateProps.devices, devData)
    .map(session => ({
      ...session,
      duration: Math.round(100 * (session.duration / 60)) / 100,
      energy: Math.round(session.energy / 10) / 100,
    }));
    const xData = stateProps.activeDeviceType === 'METER' ? 
        getChartMeterData(addPeriodToSessions(sessions, stateProps.timeFilter), 
                          xCategories, 
                          stateProps.time
                         ) 
       : 
       getChartAmphiroData(sessions, xCategories);

    return ({
      name: `${getDeviceNameByKey(stateProps.devices, devData.deviceKey)}` +
         ` (previous ${stateProps.timeFilter})`,
      data: xData.map(x => x ? x[stateProps.filter] : null),
    });
  });

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    xCategoryLabels,
    mu: getMetricMu(stateProps.filter), 
    chartData: [
      ...chartData,
      ...comparison,
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
