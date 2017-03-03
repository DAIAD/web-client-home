const React = require('react');
const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');
const { injectIntl } = require('react-intl');
const { push } = require('react-router-redux');

const Commons = require('../components/sections/Commons');

const CommonsActions = require('../actions/CommonsActions');
const timeUtil = require('../utils/time');
const { getLastShowerIdFromMultiple } = require('../utils/sessions');
const { getChartMeterData, getChartMeterCategories, getChartMeterCategoryLabels, getChartAmphiroCategories } = require('../utils/chart');


function mapStateToProps(state) {
  return {
    ...state.section.commons,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ 
      ...CommonsActions,
      goToManage: () => push('/settings/commons'),
    }, dispatch);
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  const active = stateProps.myCommons.find(common => common.key === stateProps.activeKey);

  const members = active ? active.members : [];
  
  const xCategories = stateProps.activeDeviceType === 'METER' ? 
    getChartMeterCategories(stateProps.time) : 
      getChartAmphiroCategories(stateProps.timeFilter, getLastShowerIdFromMultiple(stateProps.data));
      
  const xCategoryLabels = stateProps.activeDeviceType === 'METER' ?
    getChartMeterCategoryLabels(xCategories, stateProps.time, ownProps.intl)
     : xCategories;

  const chartData = stateProps.data.map((data, i) => ({
    name: data.label || '', 
    data: getChartMeterData(data.sessions,
                            xCategories, 
                            stateProps.time
                           ).map(x => x && x[stateProps.filter] ? 
                             x[stateProps.filter] 
                             : null) || [],
  }));

  return {
    ...stateProps,
    actions: {
      ...dispatchProps,
    },
    ...ownProps,
    active,
    members: {
      ...stateProps.members,
      pagingIndex: stateProps.members.pagingIndex + 1, // table index is 1-based
    },
    previousPeriod: timeUtil.getPreviousPeriod(stateProps.timeFilter, stateProps.time.endDate),
    nextPeriod: timeUtil.getNextPeriod(stateProps.timeFilter, stateProps.time.endDate),
    chartData,
    chartCategories: xCategoryLabels,
  };
}

const CommonsData = connect(mapStateToProps, mapDispatchToProps, mergeProps)(Commons);
module.exports = injectIntl(CommonsData);
