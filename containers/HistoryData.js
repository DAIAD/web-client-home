const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');
const { injectIntl } = require('react-intl');

const HistoryActions = require('../actions/HistoryActions');

const History = require('../components/sections/History');

const { getAvailableDevices, getDeviceCount, getMeterCount } = require('../utils/device');
const { prepareSessionsForTable, reduceMetric, sortSessions, meterSessionsToCSV, deviceSessionsToCSV, hasShowersBefore, hasShowersAfter } = require('../utils/sessions');
const timeUtil = require('../utils/time');
const { getMetricMu } = require('../utils/general');
const { getTimeLabelByGranularity } = require('../utils/chart');

const { meter: meterSessionSchema, amphiro: amphiroSessionSchema } = require('../schemas/history');

const { DEV_METRICS, METER_METRICS, DEV_PERIODS, METER_PERIODS, DEV_SORT, METER_SORT } = require('../constants/HomeConstants');

function mapStateToProps(state) {
  return {
    firstname: state.user.profile.firstname,
    devices: state.user.profile.devices,
    ...state.section.history,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(HistoryActions, dispatch);
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  const devType = stateProps.activeDeviceType;  
  const sessions = sortSessions(prepareSessionsForTable(stateProps.devices, 
                                                        stateProps.data, 
                                                        stateProps.firstname, 
                                                        stateProps.time.granularity,
                                                        ownProps.intl
                                                       ),
                                stateProps.sortFilter, 
                                stateProps.sortOrder
                               );

  const sessionFields = stateProps.activeDeviceType === 'METER' ? 
    meterSessionSchema
      :
    amphiroSessionSchema;
    
  const csvData = stateProps.activeDeviceType === 'METER' ? 
    meterSessionsToCSV(sessions) 
    : 
    deviceSessionsToCSV(sessions);

  let deviceTypes = [{
    id: 'METER', 
    title: 'Water meter', 
    image: 'water-meter.svg',
  }, {
    id: 'AMPHIRO', 
    title: 'Shower devices', 
    image: 'amphiro_small.svg',
  }];

  const amphiros = getAvailableDevices(stateProps.devices); 
  const meterCount = getMeterCount(stateProps.devices);
  const deviceCount = getDeviceCount(stateProps.devices);

  if (meterCount === 0) {
    deviceTypes = deviceTypes.filter(x => x.id !== 'METER');
  }
  
  if (deviceCount === 0) {
    deviceTypes = deviceTypes.filter(x => x.id !== 'AMPHIRO');
  }

  const metrics = devType === 'AMPHIRO' ? DEV_METRICS : METER_METRICS;

  const periods = devType === 'AMPHIRO' ? DEV_PERIODS : METER_PERIODS;
  
  const sortOptions = devType === 'AMPHIRO' ? DEV_SORT : METER_SORT;

  const comparisons = stateProps.timeFilter !== 'custom' && devType !== 'AMPHIRO' ?
  [{
    id: 'last', 
    title: timeUtil.getComparisonPeriod(stateProps.time.startDate, 
                                        stateProps.time.granularity, 
                                        ownProps.intl
                                       ),
  }]
  : [];

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    nextPeriod: stateProps.time ? timeUtil.getNextPeriod(stateProps.timeFilter, 
                                                         stateProps.time.startDate
                                                        ) : {}, 
    previousPeriod: stateProps.time ? timeUtil.getPreviousPeriod(stateProps.timeFilter, 
                                                                 stateProps.time.endDate
                                                                ) : {},
    amphiros,
    periods,
    metrics,
    comparisons,
    sortOptions,
    sessions,
    sessionFields,
    deviceTypes,
    csvData,
    reducedMetric: `${reduceMetric(stateProps.devices, stateProps.data, stateProps.filter)} ${getMetricMu(stateProps.filter)}`,
    hasShowersAfter: () => hasShowersAfter(stateProps.showerIndex),
    hasShowersBefore: () => hasShowersBefore(stateProps.data),

  };
}

const HistoryData = injectIntl(connect(mapStateToProps, 
                                       mapDispatchToProps, 
                                       mergeProps
                                      )(History));
module.exports = HistoryData;
