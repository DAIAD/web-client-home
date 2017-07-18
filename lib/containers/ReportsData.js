'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');

var _require = require('redux'),
    bindActionCreators = _require.bindActionCreators;

var _require2 = require('react-redux'),
    connect = _require2.connect;

var _require3 = require('react-intl'),
    injectIntl = _require3.injectIntl;

var _require4 = require('react-router-redux'),
    push = _require4.push;

var moment = require('moment');

var Reports = require('../components/sections/reports/');

var ReportsActions = require('../actions-ga/ReportsActions');

var _require5 = require('../utils/general'),
    formatMessage = _require5.formatMessage,
    formatBytes = _require5.formatBytes;

var timeUtil = require('../utils/time');

var _require6 = require('../constants/HomeConstants'),
    PERIODS = _require6.PERIODS;

function mapStateToProps(state) {
  return _extends({}, state.section.reports);
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(_extends({}, ReportsActions), dispatch);
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  return _extends({}, stateProps, {
    actions: _extends({}, dispatchProps)
  }, ownProps, {
    reports: stateProps.reports.map(function (report) {
      return _extends({}, report, {
        period: ownProps.intl.formatDate(moment({ month: report.month - 1, year: report.year }).valueOf(), { month: 'long', year: 'numeric' }),
        size: formatBytes(report.size, 0),
        onDownloadReport: dispatchProps.onDownloadReport
      });
    }),
    previousPeriod: timeUtil.getPreviousPeriod(stateProps.timeFilter, stateProps.time.endDate),
    nextPeriod: timeUtil.getNextPeriod(stateProps.timeFilter, stateProps.time.endDate),
    isAfterToday: stateProps.time.endDate > moment().subtract(1, 'month').valueOf(),
    _t: formatMessage(ownProps.intl)
  });
}

var ReportsData = connect(mapStateToProps, mapDispatchToProps, mergeProps)(Reports);
module.exports = injectIntl(ReportsData);