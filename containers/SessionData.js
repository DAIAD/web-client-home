const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');
const { injectIntl } = require('react-intl');
const moment = require('moment');

//const { getChartTimeData } = require('../utils/chart');

const SessionModal = require('../components/sections/Session');
const HistoryActions = require('../actions/HistoryActions');
const { ignoreShower, assignToMember } = require('../actions/QueryActions');
const { getShowerMetricMu, formatMessage } = require('../utils/general');
const { convertGranularityToPeriod, getLowerGranularityPeriod } = require('../utils/time');
const { SHOWER_METRICS } = require('../constants/HomeConstants');

function mapStateToProps(state) {
  return {
    activeDeviceType: state.section.history.activeDeviceType,
    data: state.section.history.data,
    activeSessionFilter: state.section.history.activeSessionFilter,
    activeSession: state.section.history.activeSession,
    time: state.section.history.time,
    timeFilter: state.section.history.timeFilter,
    user: state.user.profile,
    memberFilter: state.section.history.memberFilter, 
    members: state.user.profile.household.members,
    editShower: state.section.history.editShower,
    width: state.viewport.width,
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...HistoryActions,
    assignToMember,
    ignoreShower,
  }, dispatch);
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  const data = ownProps.sessions && Array.isArray(ownProps.sessions) && stateProps.activeSession != null ?
    ownProps.sessions.find(s => s.device === stateProps.activeSession[0] 
                                && (s.id === stateProps.activeSession[1] 
                                || s.timestamp === stateProps.activeSession[1]))
   : {};
      
  const chartFormatter = t => moment(t).format('hh:mm');
  const measurements = data && data.measurements ? data.measurements : [];

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    data,
    chartFormatter,
    members: [{ 
      id: 'default', 
      index: 0, 
      name: stateProps.user.firstname 
    }, 
    ...stateProps.members.filter(member => member.active)
    ],
    chartCategories: measurements.map(measurement => moment(measurement.timestamp).format('hh:mm:ss')),
    chartData: measurements.map(measurement => measurement ? 
                                measurement[stateProps.activeSessionFilter]
                                  : null),
    showModal: stateProps.activeSession != null,
    sessionFilters: SHOWER_METRICS
      .filter(m => m.id === 'volume' || m.id === 'temperature' || m.id === 'energy'),
    mu: getShowerMetricMu(stateProps.activeSessionFilter),
    period: stateProps.activeDeviceType === 'METER' ? getLowerGranularityPeriod(convertGranularityToPeriod(stateProps.time.granularity)) : '',
    _t: formatMessage(ownProps.intl),
  };
}

const SessionData = injectIntl(connect(mapStateToProps, 
                                       mapDispatchToProps, 
                                       mergeProps
                                      )(SessionModal));
module.exports = SessionData;
