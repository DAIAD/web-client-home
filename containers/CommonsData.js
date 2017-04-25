const React = require('react');
const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');
const { injectIntl } = require('react-intl');
const { push } = require('react-router-redux');

const Commons = require('../components/sections/commons/');

const CommonsActions = require('../actions/CommonsActions');
const timeUtil = require('../utils/time');
const { getLastShowerIdFromMultiple } = require('../utils/sessions');
const { getAvailableDeviceTypes, getDeviceCount, getMeterCount } = require('../utils/device');
const { getChartMeterData, getChartMeterCategories, getChartMeterCategoryLabels, getChartAmphiroCategories } = require('../utils/chart');
const { formatMessage, formatMetric, displayMetric } = require('../utils/general');

const { PERIODS } = require('../constants/HomeConstants');

function mapStateToProps(state) {
  return {
    devices: state.user.profile.devices,
    unit: state.user.profile.unit,
    favorite: state.section.settings.commons.favorite,
    ...state.section.commons,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ 
      ...CommonsActions,
      goToManage: () => push('/settings/commons'),
      goToJoin: () => push('/settings/commons/join'),
    }, dispatch);
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  const _t = formatMessage(ownProps.intl);
  const deviceTypes = getAvailableDeviceTypes(stateProps.devices);
  
  const periods = PERIODS.METER
  .filter(period => period.id !== 'day');

  const active = stateProps.myCommons.find(common => common.key === stateProps.activeKey);

  const members = active ? active.members : [];
  
  const xCategories = getChartMeterCategories(stateProps.time);
      
  const xCategoryLabels = getChartMeterCategoryLabels(xCategories, stateProps.time.granularity, stateProps.timeFilter, ownProps.intl);

  const chartData = stateProps.data.map((data, i) => ({
    name: _t(data.label) || '', 
    data: getChartMeterData(data.sessions,
                            xCategories, 
                            stateProps.time,
                            stateProps.filter
                           ),
  }));

  const chartFormatter = y => displayMetric(formatMetric(y, 'volume', stateProps.unit));
  return {
    ...stateProps,
    actions: {
      ...dispatchProps,
    },
    ...ownProps,
    active,
    deviceTypes,
    periods,
    isAfterToday: stateProps.time.endDate > new Date().valueOf(),  
    members: {
      ...stateProps.members,
      active: stateProps.members.active.map(m => stateProps.members.selected.map(s => s.key).includes(m.key) ? ({ ...m, selected: true }) : m),
      pagingIndex: stateProps.members.pagingIndex + 1, // table index is 1-based
    },
    previousPeriod: timeUtil.getPreviousPeriod(stateProps.timeFilter, stateProps.time.endDate),
    nextPeriod: timeUtil.getNextPeriod(stateProps.timeFilter, stateProps.time.endDate),
    chartData,
    chartCategories: xCategoryLabels,
    chartFormatter,
    _t,
  };
}

const CommonsData = connect(mapStateToProps, mapDispatchToProps, mergeProps)(Commons);
module.exports = injectIntl(CommonsData);
