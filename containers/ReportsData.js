const React = require('react');
const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');
const { injectIntl } = require('react-intl');
const { push } = require('react-router-redux');

const Reports = require('../components/sections/Reports');

const ReportsActions = require('../actions/ReportsActions');

const { formatMessage } = require('../utils/general');
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
      //goToManage: () => push('/settings/commons'),
      //goToJoin: () => push('/settings/commons/join'),
    }, dispatch);
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...stateProps,
    actions: {
      ...dispatchProps,
    },
    ...ownProps,
    previousPeriod: timeUtil.getPreviousPeriod(stateProps.timeFilter, stateProps.time.endDate),
    nextPeriod: timeUtil.getNextPeriod(stateProps.timeFilter, stateProps.time.endDate),
    isAfterToday: stateProps.time.endDate > new Date().valueOf(),  
    _t: formatMessage(ownProps.intl),
  };
}

const ReportsData = connect(mapStateToProps, mapDispatchToProps, mergeProps)(Reports);
module.exports = injectIntl(ReportsData);
