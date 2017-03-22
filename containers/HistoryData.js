const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');
const { injectIntl } = require('react-intl');

const HistoryActions = require('../actions/HistoryActions');

const History = require('../components/sections/History');

const { getAvailableDevices, getDeviceCount, getMeterCount } = require('../utils/device');
const { prepareSessionsForTable, reduceMetric, sortSessions, meterSessionsToCSV, deviceSessionsToCSV, hasShowersBefore, hasShowersAfter, getComparisons, getComparisonTitle, getAllMembers, prepareBreakdownSessions } = require('../utils/sessions');
const timeUtil = require('../utils/time');
const { getMetricMu, formatMessage } = require('../utils/general');
const { getTimeLabelByGranularity } = require('../utils/chart');

const { meter: meterSessionSchema, amphiro: amphiroSessionSchema, breakdown: breakdownSessionSchema } = require('../schemas/history');

const { DEV_METRICS, METER_METRICS, DEV_PERIODS, METER_PERIODS, DEV_SORT, METER_SORT } = require('../constants/HomeConstants');

function mapStateToProps(state) {
  return {
    firstname: state.user.profile.firstname,
    devices: state.user.profile.devices,
    myCommons: state.section.commons.myCommons,
    favoriteCommon: state.section.settings.commons.favorite,
    members: state.user.profile.household.members,
    ...state.section.history,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(HistoryActions, dispatch);
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  const _t = formatMessage(ownProps.intl);

  const devType = stateProps.activeDeviceType;  
  const members = getAllMembers(stateProps.members, stateProps.firstname); 

  const sessions = stateProps.mode === 'breakdown' ?
    prepareBreakdownSessions(stateProps.devices,
                             stateProps.data,
                             stateProps.filter,
                             stateProps.waterBreakdown,
                             stateProps.firstname,
                             stateProps.time.startDate,
                             stateProps.time.granularity + 1,
                             ownProps.intl
                            )
    : 
    sortSessions(prepareSessionsForTable(stateProps.devices, 
                                         stateProps.data, 
                                         members,
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

  const sortOptions = devType === 'AMPHIRO' ? DEV_SORT : METER_SORT;

  const favoriteCommon = stateProps.favoriteCommon ? stateProps.myCommons.find(c => c.key === stateProps.favoriteCommon) : {};

  const availableComparisons = getComparisons(devType, stateProps.memberFilter, members)
  .map(c => ({
    id: c,
    title: getComparisonTitle(stateProps.activeDeviceType,
                              c, 
                              stateProps.time.startDate, 
                              stateProps.timeFilter, 
                              favoriteCommon.name, 
                              members, 
                              _t
                             ),
  }));   

  const memberFilters = devType === 'AMPHIRO' ?
    [{
      id: 'all',
      title: 'All',
    },
    ...members.map(member => ({
      id: member.index,
      title: member.name,
    })),
    ]
    :
      [];

  const reducedMetric = reduceMetric(stateProps.devices, stateProps.data, stateProps.filter);

  const AMPHIRO_MODES = [{ 
    id: 'stats', 
    title: 'Statistics',
    periods: DEV_PERIODS, 
    comparisons: availableComparisons,
  }];
  const METER_MODES = [{ 
    id: 'stats', 
    title: 'Statistics',
    periods: METER_PERIODS,
    comparisons: availableComparisons.filter(c => stateProps.timeFilter === 'custom' ? c.id !== 'last' : true),
  },
  {
    id: 'forecasting',
    title: 'Forecasting',
    periods: METER_PERIODS.filter(p => p.id !== 'custom'),
    comparisons: availableComparisons,
  },
  {
    id: 'pricing',
    title: 'Pricing',
    periods: METER_PERIODS.filter(p => p.id === 'month'),
    comparisons: availableComparisons,
  },
  {
    id: 'breakdown',
    title: 'Water breakdown',
    periods: METER_PERIODS.filter(p => p.id !== 'day' && p.id !== 'custom'),
    comparisons: [],
  }
  ];

  const modes = devType === 'AMPHIRO' ? AMPHIRO_MODES : METER_MODES;
  const activeMode = modes.find(m => m.id === stateProps.mode);
  const periods = activeMode ? activeMode.periods : [];
  const compareAgainst = activeMode ? activeMode.comparisons : [];

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
    modes,
    metrics,
    compareAgainst,
    memberFilters,
    sortOptions,
    sessions,
    sessionFields: stateProps.mode === 'breakdown' ? breakdownSessionSchema : sessionFields,
    deviceTypes,
    csvData,
    reducedMetric: `${reducedMetric} ${getMetricMu(stateProps.filter)}`,
    hasShowersAfter: () => hasShowersAfter(stateProps.showerIndex),
    hasShowersBefore: () => hasShowersBefore(stateProps.data),
    _t,
  };
}

const HistoryData = injectIntl(connect(mapStateToProps, 
                                       mapDispatchToProps, 
                                       mergeProps
                                      )(History));
module.exports = HistoryData;
