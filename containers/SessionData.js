const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');
const { injectIntl } = require('react-intl');
const moment = require('moment');

//const { getChartTimeData } = require('../utils/chart');

const Session = require('../components/sections/history/SessionModal');
const HistoryActions = require('../actions/HistoryActions');
const { setWidgetTypeUnsynced } = require('../actions/DashboardActions');
const { ignoreShower, assignToMember, setShowerReal } = require('../actions/ShowerActions');
const { setForm } = require('../actions/FormActions');

const { getChartAmphiroData } = require('../utils/chart');
const { getMetricMu, getShowerMetricMu, getAllMembers, formatMessage } = require('../utils/general');
const { convertGranularityToPeriod, getLowerGranularityPeriod } = require('../utils/time');
const { METRICS } = require('../constants/HomeConstants');

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
    showerTime: state.forms.shower.time,
    width: state.viewport.width,
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...HistoryActions,
    setWidgetTypeUnsynced,
    assignToMember,
    ignoreShower,
    setShowerReal,
    setForm,
  }, dispatch);
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  const data = ownProps.sessions && Array.isArray(ownProps.sessions) && stateProps.activeSession != null ?
    ownProps.sessions.find(s => s.device === stateProps.activeSession[0] 
                                && (s.id === stateProps.activeSession[1] 
                                || s.timestamp === stateProps.activeSession[1]))
   : {};

  const mu = getMetricMu(stateProps.activeSessionFilter);   
  const chartFormatter = y => `${y} ${mu}`;
  const measurements = data && data.measurements ? data.measurements : [];

  const chartCategories = measurements.map(measurement => moment(measurement.timestamp).format('hh:mm:ss'));
  const chartData = getChartAmphiroData(measurements, chartCategories, stateProps.activeSessionFilter);

  const nextReal = Array.isArray(ownProps.sessions) ? ownProps.sessions.sort((a, b) => { 
      if (a.id < b.id) return -1; 
      else if (a.id > b.id) return 1; 
      return 0; 
    })
    .find(s => s && data && s.device === data.device 
          && s.id > data.id 
          && s.history === false
         )
         : null;

  const metrics = METRICS[stateProps.activeDeviceType];
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    metrics,
    data,
    chartFormatter,
    members: getAllMembers(stateProps.members, stateProps.user.firstname),
    chartCategories,
    chartData,
    showModal: stateProps.activeSession != null,
    sessionFilters: METRICS.AMPHIRO
      .filter(m => m.id === 'volume' || m.id === 'temperature' || m.id === 'energy'),
    period: stateProps.activeDeviceType === 'METER' ? getLowerGranularityPeriod(stateProps.timeFilter) : '',
    setShowerTimeForm: time => dispatchProps.setForm('shower', { time }),
    nextReal,
    assignToMember: x => dispatchProps.assignToMember(x)
    .then(() => dispatchProps.setWidgetTypeUnsynced('ranking')),
    _t: formatMessage(ownProps.intl),
  };
}

const SessionData = injectIntl(connect(mapStateToProps, 
                                       mapDispatchToProps, 
                                       mergeProps
                                      )(Session));
module.exports = SessionData;
