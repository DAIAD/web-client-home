const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');
const { injectIntl } = require('react-intl');
const moment = require('moment');

//const { getChartTimeData } = require('../utils/chart');

const SessionModal = require('../components/sections/Session');
const HistoryActions = require('../actions/HistoryActions');
const { ignoreShower, assignToMember, setShowerReal } = require('../actions/QueryActions');
const { setForm } = require('../actions/FormActions');

const { getShowerMetricMu, formatMessage } = require('../utils/general');
const { getLowerGranularityPeriod } = require('../utils/time');
const { SHOWER_METRICS } = require('../constants/HomeConstants');

function mapStateToProps(state) {
  return {
    activeDeviceType: state.section.history.activeDeviceType,
    data: state.section.history.data,
    activeSessionFilter: state.section.history.activeSessionFilter,
    activeSession: state.section.history.activeSession,
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
    assignToMember,
    ignoreShower,
    setShowerReal,
    setForm,
  }, dispatch);
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  const data = ownProps.sessions && stateProps.activeSession != null ?
    ownProps.sessions.find(s => s.device === stateProps.activeSession[0] 
                                && (s.id === stateProps.activeSession[1] 
                                || s.timestamp === stateProps.activeSession[1]))
   : {};
      
  const chartFormatter = t => moment(t).format('hh:mm');
  const measurements = data && data.measurements ? data.measurements : [];

  const nextReal = ownProps.sessions.sort((a, b) => { 
      if (a.id < b.id) return -1; 
      else if (a.id > b.id) return 1; 
      return 0; 
    })
    .find(s => s.device === data.device 
          && s.id > data.id 
          && s.history === false
         ); 
         
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
    period: stateProps.activeDeviceType === 'METER' ? getLowerGranularityPeriod(stateProps.timeFilter) : '',
    setShowerTimeForm: time => dispatchProps.setForm('shower', { time }),
    nextReal,
    _t: formatMessage(ownProps.intl),
  };
}

const SessionData = injectIntl(connect(mapStateToProps, 
                                       mapDispatchToProps, 
                                       mergeProps
                                      )(SessionModal));
module.exports = SessionData;
