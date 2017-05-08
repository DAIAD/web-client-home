const React = require('react');
const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');
const { injectIntl } = require('react-intl');
const { push } = require('react-router-redux');
const moment = require('moment');

const Reports = require('../components/sections/reports/');

const ReportsActions = require('../actions/ReportsActions');

const { formatMessage, formatBytes } = require('../utils/general');
const timeUtil = require('../utils/time');

const { PERIODS } = require('../constants/HomeConstants');

function mapStateToProps(state) {
  return {
    ...state.section.reports,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ 
      ...ReportsActions,
    }, dispatch);
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...stateProps,
    actions: {
      ...dispatchProps,
    },
    ...ownProps,
    reports: stateProps.reports.map(report => ({
      ...report,
      period: ownProps.intl.formatDate(moment({ month: report.month - 1, year: report.year }).valueOf(), { month: 'long', year: 'numeric' }),
      size: formatBytes(report.size, 0),
      onDownloadReport: dispatchProps.onDownloadReport,
    })), 
    previousPeriod: timeUtil.getPreviousPeriod(stateProps.timeFilter, stateProps.time.endDate),
    nextPeriod: timeUtil.getNextPeriod(stateProps.timeFilter, stateProps.time.endDate),
    isAfterToday: stateProps.time.endDate > moment().subtract(1, 'month').valueOf(),  
    _t: formatMessage(ownProps.intl),
  };
}

const ReportsData = connect(mapStateToProps, mapDispatchToProps, mergeProps)(Reports);
module.exports = injectIntl(ReportsData);
