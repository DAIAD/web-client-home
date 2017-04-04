const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');
const { injectIntl } = require('react-intl');

const HistoryActions = require('../actions/HistoryActions');

const History = require('../components/sections/History');

const { getAvailableDevices, getAvailableDeviceTypes } = require('../utils/device');
const { prepareSessionsForTable, reduceMetric, sortSessions, meterSessionsToCSV, deviceSessionsToCSV, hasShowersBefore, hasShowersAfter, prepareBreakdownSessions } = require('../utils/sessions');
const { getComparisons, getComparisonTitle } = require('../utils/comparisons');
const timeUtil = require('../utils/time');
const { getMetricMu, formatMessage, getAllMembers, tableToCSV } = require('../utils/general');
const { getHistoryData } = require('../utils/history');


const { FILTER_METRICS, PERIODS, SORT, MODES } = require('../constants/HomeConstants');

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
  const amphiros = getAvailableDevices(stateProps.devices); 

  const devType = stateProps.activeDeviceType;  
  const members = getAllMembers(stateProps.members); 
  const favoriteCommonName = stateProps.favoriteCommon ? stateProps.myCommons.find(c => c.key === stateProps.favoriteCommon).name : '';
 
  const deviceTypes = getAvailableDeviceTypes(stateProps.devices);

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

  const modes = MODES[devType];
  const metrics = FILTER_METRICS[devType];
  const activeMode = modes.find(m => m.id === stateProps.mode);

  const allOptions = {
    periods: PERIODS[devType],
    comparisons: availableComparisons,
    sort: SORT[devType],
  };

  const [
    periods, 
    compareAgainst, 
    sortOptions] = ['periods', 'comparisons', 'sort']
    .map(x => activeMode[x] ? 
         allOptions[x].filter(y => activeMode[x].includes(y.id)) 
           : allOptions[x]
        );

  const { 
    sessions,
    sessionFields,
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

  const csvData = tableToCSV(sessionFields, sessions);
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
    isAfterToday: stateProps.time.endDate > new Date().valueOf(),  
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
