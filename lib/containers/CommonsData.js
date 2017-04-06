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

var Commons = require('../components/sections/Commons');

var CommonsActions = require('../actions/CommonsActions');
var timeUtil = require('../utils/time');

var _require5 = require('../utils/sessions'),
    getLastShowerIdFromMultiple = _require5.getLastShowerIdFromMultiple;

var _require6 = require('../utils/device'),
    getAvailableDeviceTypes = _require6.getAvailableDeviceTypes,
    getDeviceCount = _require6.getDeviceCount,
    getMeterCount = _require6.getMeterCount;

var _require7 = require('../utils/chart'),
    getChartMeterData = _require7.getChartMeterData,
    getChartMeterCategories = _require7.getChartMeterCategories,
    getChartMeterCategoryLabels = _require7.getChartMeterCategoryLabels,
    getChartAmphiroCategories = _require7.getChartAmphiroCategories;

var _require8 = require('../constants/HomeConstants'),
    PERIODS = _require8.PERIODS;

var _require9 = require('../utils/general'),
    formatMessage = _require9.formatMessage;

function mapStateToProps(state) {
  return _extends({
    devices: state.user.profile.devices,
    favorite: state.section.settings.commons.favorite
  }, state.section.commons);
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(_extends({}, CommonsActions, {
    goToManage: function goToManage() {
      return push('/settings/commons');
    },
    goToJoin: function goToJoin() {
      return push('/settings/commons/join');
    }
  }), dispatch);
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  var deviceTypes = getAvailableDeviceTypes(stateProps.devices);

  var periods = PERIODS.METER.filter(function (period) {
    return period.id !== 'day';
  });

  var active = stateProps.myCommons.find(function (common) {
    return common.key === stateProps.activeKey;
  });

  var members = active ? active.members : [];

  var xCategories = getChartMeterCategories(stateProps.time);

  var xCategoryLabels = getChartMeterCategoryLabels(xCategories, stateProps.time.granularity, stateProps.timeFilter, ownProps.intl);

  var chartData = stateProps.data.map(function (data, i) {
    return {
      name: data.label || '',
      data: getChartMeterData(data.sessions, xCategories, stateProps.time, stateProps.filter)
    };
  });

  return _extends({}, stateProps, {
    actions: _extends({}, dispatchProps)
  }, ownProps, {
    active: active,
    deviceTypes: deviceTypes,
    periods: periods,
    members: _extends({}, stateProps.members, {
      active: stateProps.members.active.map(function (m) {
        return stateProps.members.selected.map(function (s) {
          return s.key;
        }).includes(m.key) ? _extends({}, m, { selected: true }) : m;
      }),
      pagingIndex: stateProps.members.pagingIndex + 1 }),
    previousPeriod: timeUtil.getPreviousPeriod(stateProps.timeFilter, stateProps.time.endDate),
    nextPeriod: timeUtil.getNextPeriod(stateProps.timeFilter, stateProps.time.endDate),
    chartData: chartData,
    chartCategories: xCategoryLabels,
    _t: formatMessage(ownProps.intl)
  });
}

var CommonsData = connect(mapStateToProps, mapDispatchToProps, mergeProps)(Commons);
module.exports = injectIntl(CommonsData);