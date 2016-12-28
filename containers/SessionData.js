const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');
const { injectIntl } = require('react-intl');

//const { getChartTimeData } = require('../utils/chart');

const SessionModal = require('../components/Session');

const HistoryActions = require('../actions/HistoryActions');
const moment = require('moment');

function mapStateToProps(state) {
  return {
    activeDeviceType: state.section.history.activeDeviceType,
    data: state.section.history.data,
    activeSessionFilter: state.section.history.activeSessionFilter,
    activeSession: state.section.history.activeSession,
    width: state.viewport.width,
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(HistoryActions, dispatch);
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  const data = ownProps.sessions && stateProps.activeSession != null ?
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
    chartCategories: measurements.map(measurement => moment(measurement.timestamp).format('hh:mm:ss')),
    chartData: measurements.map(measurement => measurement ? 
                                measurement[stateProps.activeSessionFilter]
                                : null),
    showModal: stateProps.activeSession != null,
  };
}

const SessionData = injectIntl(connect(mapStateToProps, 
                                       mapDispatchToProps, 
                                       mergeProps,
                                      )(SessionModal));
module.exports = SessionData;
