const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');
const { injectIntl } = require('react-intl');

const HistoryActions = require('../actions/HistoryActions');

const History = require('../components/sections/History');

const { getAvailableDevices, getDeviceCount, getMeterCount } = require('../utils/device');
const { prepareSessionsForTable, reduceMetric, sortSessions, meterSessionsToCSV, deviceSessionsToCSV, hasShowersBefore, hasShowersAfter, getComparisons, getComparisonTitle, getAllMembers, prepareBreakdownSessions } = require('../utils/sessions');
const timeUtil = require('../utils/time');
const { getMetricMu, formatMessage } = require('../utils/general');
const { getHistoryData } = require('../utils/history');


const { DEV_METRICS, METER_METRICS, DEV_PERIODS, METER_PERIODS, DEV_SORT, METER_SORT } = require('../constants/HomeConstants');

function mapStateToProps(state) {
  return {
    user: state.user.profile,
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
  const members = getAllMembers(stateProps.members, stateProps.user.firstname); 
  const favoriteCommonName = stateProps.favoriteCommon ? stateProps.myCommons.find(c => c.key === stateProps.favoriteCommon).name : '';
 
  let deviceTypes = [{
    id: 'METER', 
    title: 'Water meter', 
  }, {
    id: 'AMPHIRO', 
    title: 'Shower devices', 
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

  const availableSortOptions = devType === 'AMPHIRO' ? DEV_SORT : METER_SORT;


  const availableComparisons = getComparisons(devType, stateProps.memberFilter, members)
  .map(c => ({
    id: c,
    title: getComparisonTitle(stateProps.activeDeviceType,
                              c, 
                              stateProps.time.startDate, 
                              stateProps.timeFilter, 
                              favoriteCommonName, 
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

  const AMPHIRO_MODES = [{ 
    id: 'stats', 
    title: 'Statistics',
    periods: DEV_PERIODS, 
    comparisons: availableComparisons,
    sort: availableSortOptions,
  }];
  const METER_MODES = [{ 
    id: 'stats', 
    title: 'Statistics',
    periods: METER_PERIODS,
    comparisons: availableComparisons.filter(c => stateProps.timeFilter === 'custom' ? c.id !== 'last' : true),
    sort: availableSortOptions,
  },
  {
    id: 'forecasting',
    title: 'Forecasting',
    periods: METER_PERIODS,
    comparisons: availableComparisons,
    sort: availableSortOptions,
  },
  {
    id: 'pricing',
    title: 'Pricing',
    periods: METER_PERIODS.filter(p => p.id === 'month'),
    comparisons: availableComparisons,
    sort: availableSortOptions,
  },
  {
    id: 'breakdown',
    title: 'Breakdown',
    periods: METER_PERIODS.filter(p => p.id !== 'day' && p.id !== 'custom'),
    comparisons: availableComparisons.filter(p => p.id === 'last'),
    sort: availableSortOptions.filter(x => x.id !== 'timestamp'),
  },
  {
    id: 'wateriq',
    title: 'Water IQ',
    periods: METER_PERIODS.filter(p => p.id === 'year'),
    comparisons: availableComparisons.filter(p => p.id !== 'last' && p.id !== 'common'),
    sort: availableSortOptions,
  },
  ];

  const modes = devType === 'AMPHIRO' ? AMPHIRO_MODES : METER_MODES;
  const activeMode = modes.find(m => m.id === stateProps.mode);
  const periods = activeMode ? activeMode.periods : [];
  const compareAgainst = activeMode ? activeMode.comparisons : [];
  const sortOptions = activeMode ? activeMode.sort : [];

  const { 
    sessions,
    sessionFields,
    csvData,
    reducedMetric,
    highlight,
    chartType,
    chartData,
    chartCategories,
    chartFormatter,
    chartColors,
    chartYMax,
    mu,
  } = getHistoryData({ ...stateProps, ...ownProps, _t, members, favoriteCommonName });
  
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
    hasShowersAfter: () => hasShowersAfter(stateProps.showerIndex),
    hasShowersBefore: () => hasShowersBefore(stateProps.data), 
    onSessionClick: session => dispatchProps.setActiveSession(session.device, session.id, session.timestamp),
    _t,
    sessions,
    //sessionFields: stateProps.mode === 'breakdown' ? breakdownSessionSchema : sessionFields,
    sessionFields,
    deviceTypes,
    csvData,
    reducedMetric: highlight,
    mu,
    chart: {
      //chart width = viewport width - main menu - sidebar left - sidebar right - padding
      width: Math.max(stateProps.width - 130 - 160 - 160 - 20, 550),
      chartType,
      chartData,
      chartCategories,
      chartColors,
      chartFormatter,
      chartYMax,
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
    },
  };
}

const HistoryData = injectIntl(connect(mapStateToProps, 
                                       mapDispatchToProps, 
                                       mergeProps
                                      )(History));
module.exports = HistoryData;
