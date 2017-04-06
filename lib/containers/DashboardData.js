'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _require = require('react-intl'),
    injectIntl = _require.injectIntl;

var _require2 = require('redux'),
    bindActionCreators = _require2.bindActionCreators;

var _require3 = require('react-redux'),
    connect = _require3.connect;

var DashboardActions = require('../actions/DashboardActions');

var _require4 = require('../actions/HistoryActions'),
    linkToHistory = _require4.linkToHistory;

var _require5 = require('../actions/UserActions'),
    saveConfiguration = _require5.saveConfiguration;

var _require6 = require('../actions/FormActions'),
    setForm = _require6.setForm;

var Dashboard = require('../components/sections/Dashboard');

var _require7 = require('../utils/device'),
    getDeviceCount = _require7.getDeviceCount,
    getMeterCount = _require7.getMeterCount;

var prepareWidget = require('../utils/widgets');

var _require8 = require('../utils/general'),
    filterObj = _require8.filterObj,
    formatMessage = _require8.formatMessage;

var _require9 = require('../constants/HomeConstants'),
    WIDGET_TYPES = _require9.WIDGET_TYPES;

function mapStateToProps(state) {
  return {
    firstname: state.user.profile.firstname,
    devices: state.user.profile.devices,
    layout: state.section.dashboard.layout,
    mode: state.section.dashboard.mode,
    dirty: state.section.dashboard.dirty,
    widgets: state.section.dashboard.widgets,
    widgetToAdd: state.forms.widgetToAdd,
    activeDeviceType: state.section.dashboard.widgetDeviceType,
    width: state.viewport.width
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(_extends({}, DashboardActions, {
    linkToHistory: linkToHistory,
    saveConfiguration: saveConfiguration,
    setForm: setForm
  }), dispatch);
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  var deviceTypes = [{
    id: 'AMPHIRO',
    title: 'Shower'
  }, {
    id: 'METER',
    title: 'Smart Water Meter'
  }];

  var meterCount = getMeterCount(stateProps.devices);
  var deviceCount = getDeviceCount(stateProps.devices);

  if (meterCount === 0) {
    deviceTypes = deviceTypes.filter(function (x) {
      return x.id !== 'METER';
    });
  }

  if (deviceCount === 0) {
    deviceTypes = deviceTypes.filter(function (x) {
      return x.id !== 'AMPHIRO';
    });
  }

  var newWidgetState = {
    widgets: stateProps.widgets.map(function (widget) {
      return filterObj(widget, ['id', 'deviceType', 'display', 'metric', 'period', 'periodIndex', 'title', 'type']);
    }),
    layout: stateProps.layout
  };

  if (stateProps.activeDeviceType !== 'AMPHIRO' && stateProps.activeDeviceType !== 'METER') {
    console.error('Oops, wrong device type', stateProps.activeDeviceType);
  }
  var widgetTypes = WIDGET_TYPES[stateProps.activeDeviceType].map(function (w) {
    return _extends({}, w, {
      deviceType: stateProps.activeDeviceType
    });
  });

  var setWidgetToAdd = function setWidgetToAdd(data) {
    return dispatchProps.setForm('widgetToAdd', data);
  };

  return _extends({}, stateProps, dispatchProps, ownProps, {
    widgets: stateProps.widgets.map(function (widget) {
      return prepareWidget(widget, stateProps.devices, ownProps.intl);
    }),
    deviceCount: getDeviceCount(stateProps.devices),
    meterCount: getMeterCount(stateProps.devices),
    saveToProfile: function saveToProfile() {
      return dispatchProps.saveConfiguration(newWidgetState);
    },
    deviceTypes: deviceTypes,
    widgetTypes: widgetTypes,
    setWidgetToAdd: setWidgetToAdd,
    _t: formatMessage(ownProps.intl)
  });
}

var DashboardData = injectIntl(connect(mapStateToProps, mapDispatchToProps, mergeProps)(Dashboard));
module.exports = DashboardData;