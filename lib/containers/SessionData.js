'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _require = require('redux'),
    bindActionCreators = _require.bindActionCreators;

var _require2 = require('react-redux'),
    connect = _require2.connect;

var _require3 = require('react-intl'),
    injectIntl = _require3.injectIntl;

var moment = require('moment');

//const { getChartTimeData } = require('../utils/chart');

var SessionModal = require('../components/sections/Session');
var HistoryActions = require('../actions/HistoryActions');

var _require4 = require('../actions/DashboardActions'),
    setWidgetTypeUnsynced = _require4.setWidgetTypeUnsynced;

var _require5 = require('../actions/ShowerActions'),
    ignoreShower = _require5.ignoreShower,
    assignToMember = _require5.assignToMember,
    setShowerReal = _require5.setShowerReal;

var _require6 = require('../actions/FormActions'),
    setForm = _require6.setForm;

var _require7 = require('../utils/chart'),
    getChartAmphiroData = _require7.getChartAmphiroData;

var _require8 = require('../utils/general'),
    getMetricMu = _require8.getMetricMu,
    getShowerMetricMu = _require8.getShowerMetricMu,
    getAllMembers = _require8.getAllMembers,
    formatMessage = _require8.formatMessage;

var _require9 = require('../utils/time'),
    convertGranularityToPeriod = _require9.convertGranularityToPeriod,
    getLowerGranularityPeriod = _require9.getLowerGranularityPeriod;

var _require10 = require('../constants/HomeConstants'),
    METRICS = _require10.METRICS;

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
    width: state.viewport.width
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(_extends({}, HistoryActions, {
    setWidgetTypeUnsynced: setWidgetTypeUnsynced,
    assignToMember: assignToMember,
    ignoreShower: ignoreShower,
    setShowerReal: setShowerReal,
    setForm: setForm
  }), dispatch);
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  var data = ownProps.sessions && Array.isArray(ownProps.sessions) && stateProps.activeSession != null ? ownProps.sessions.find(function (s) {
    return s.device === stateProps.activeSession[0] && (s.id === stateProps.activeSession[1] || s.timestamp === stateProps.activeSession[1]);
  }) : {};

  var mu = getMetricMu(stateProps.activeSessionFilter);
  var chartFormatter = function chartFormatter(y) {
    return y + ' ' + mu;
  };
  var measurements = data && data.measurements ? data.measurements : [];

  var chartCategories = measurements.map(function (measurement) {
    return moment(measurement.timestamp).format('hh:mm:ss');
  });
  var chartData = getChartAmphiroData(measurements, chartCategories, stateProps.activeSessionFilter);

  var nextReal = Array.isArray(ownProps.sessions) ? ownProps.sessions.sort(function (a, b) {
    if (a.id < b.id) return -1;else if (a.id > b.id) return 1;
    return 0;
  }).find(function (s) {
    return s && data && s.device === data.device && s.id > data.id && s.history === false;
  }) : null;

  var metrics = METRICS[stateProps.activeDeviceType];
  return _extends({}, stateProps, dispatchProps, ownProps, {
    metrics: metrics,
    data: data,
    chartFormatter: chartFormatter,
    members: getAllMembers(stateProps.members, stateProps.user.firstname),
    chartCategories: chartCategories,
    chartData: chartData,
    showModal: stateProps.activeSession != null,
    sessionFilters: METRICS.AMPHIRO.filter(function (m) {
      return m.id === 'volume' || m.id === 'temperature' || m.id === 'energy';
    }),
    period: stateProps.activeDeviceType === 'METER' ? getLowerGranularityPeriod(stateProps.timeFilter) : '',
    setShowerTimeForm: function setShowerTimeForm(time) {
      return dispatchProps.setForm('shower', { time: time });
    },
    nextReal: nextReal,
    assignToMember: function assignToMember(x) {
      return dispatchProps.assignToMember(x).then(function () {
        return dispatchProps.setWidgetTypeUnsynced('ranking');
      });
    },
    _t: formatMessage(ownProps.intl)
  });
}

var SessionData = injectIntl(connect(mapStateToProps, mapDispatchToProps, mergeProps)(SessionModal));
module.exports = SessionData;