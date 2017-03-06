const React = require('react');
const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');
const { injectIntl } = require('react-intl');
const { push } = require('react-router-redux');

const Commons = require('../components/sections/Commons');

const CommonsActions = require('../actions/CommonsActions');
const { queryMeterHistoryCache } = require('../actions/QueryActions');
const timeUtil = require('../utils/time');
const { getDeviceKeysByType } = require('../utils/device');

const { getDataSessions, sortSessions, getLastShowerIdFromMultiple } = require('../utils/sessions');
const { getChartMeterData, getChartMeterCategories, getChartMeterCategoryLabels, getChartAmphiroCategories } = require('../utils/chart');
const { formatMessage } = require('../utils/general');

function mapStateToProps(state) {
  return {
    ...state.section.commons,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ 
      ...CommonsActions,
      queryMeterHistoryCache,
      goToManage: () => push('/settings/commons'),
      goToJoin: () => push('/settings/commons/join'),
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

  const chartData = stateProps.data.map(data => ({
    name: data.label, 
    data: getChartMeterData(data.points,
                            xCategories, 
                            stateProps.time
                           ).map(x => x && x[stateProps.filter] ? 
                             x[stateProps.filter].AVERAGE 
                             : null),
   lineType: active && data.label === active.name ? 'dashed' : 'solid',
   color: active && data.label === active.name ? '#2d3480' : null,
   symbol: active && data.label === active.name ? 'emptyRectangle' : null,
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
      active: stateProps.members.active.map(m => stateProps.members.selected.map(s => s.key).includes(m.key) ? ({ ...m, selected: true }) : m),
      pagingIndex: stateProps.members.pagingIndex + 1, // table index is 1-based
    },
    previousPeriod: timeUtil.getPreviousPeriod(stateProps.timeFilter, stateProps.time.endDate),
    nextPeriod: timeUtil.getNextPeriod(stateProps.timeFilter, stateProps.time.endDate),
    chartData,
    chartCategories: xCategoryLabels,
    _t: formatMessage(ownProps.intl),
  };
}

const CommonsData = connect(mapStateToProps, mapDispatchToProps, mergeProps)(Commons);
module.exports = injectIntl(CommonsData);
