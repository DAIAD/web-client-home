'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _require = require('react-intl'),
    injectIntl = _require.injectIntl;

var _require2 = require('redux'),
    bindActionCreators = _require2.bindActionCreators;

var _require3 = require('react-redux'),
    connect = _require3.connect;

var DashboardActions = require('../actions-ga/DashboardActions');

var _require4 = require('../actions-ga/UserActions'),
    saveConfiguration = _require4.saveConfiguration;

var _require5 = require('../actions-ga/FormActions'),
    setForm = _require5.setForm,
    resetForm = _require5.resetForm;

var _require6 = require('../actions-ga/InitActions'),
    linkToSection = _require6.linkToSection;

var Dashboard = require('../components/sections/dashboard/');

var _require7 = require('../utils/device'),
    getDeviceCount = _require7.getDeviceCount,
    getMeterCount = _require7.getMeterCount;

var prepareWidget = require('../utils/widgets');

var _require8 = require('../utils/general'),
    filterObj = _require8.filterObj,
    formatMessage = _require8.formatMessage;

var _require9 = require('../constants/HomeConstants'),
    DEVICE_TYPES = _require9.DEVICE_TYPES,
    WIDGET_TYPES = _require9.WIDGET_TYPES;

function mapStateToProps(state) {
  return {
    firstname: state.user.profile.firstname,
    devices: state.user.profile.devices,
    unit: state.user.profile.unit,
    layout: state.section.dashboard.layout,
    mode: state.section.dashboard.mode,
    dirty: state.section.dashboard.dirty,
    widgets: state.section.dashboard.widgets,
    widgetToAdd: state.forms.widgetToAdd,
    brackets: state.section.history.priceBrackets,
    breakdown: state.section.history.waterBreakdown,
    tips: state.section.messages.tips,
    activeDeviceType: state.section.dashboard.widgetDeviceType,
    width: state.viewport.width
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(_extends({}, DashboardActions, {
    saveConfiguration: saveConfiguration,
    setForm: setForm,
    resetForm: resetForm,
    linkToSection: linkToSection
  }), dispatch);
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  var _t = formatMessage(ownProps.intl);
  var deviceTypes = DEVICE_TYPES;

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
      return filterObj(widget, ['widgetId', 'id', 'deviceType', 'display', 'metric', 'period', 'periodIndex', 'type']);
    }),
    layout: stateProps.layout
  };

  if (stateProps.activeDeviceType !== 'AMPHIRO' && stateProps.activeDeviceType !== 'METER') {
    console.error('Oops, wrong device type', stateProps.activeDeviceType);
  }
  var widgetTypes = WIDGET_TYPES[stateProps.activeDeviceType].map(function (w) {
    return _extends({}, w, {
      widgetId: w.id,
      title: _t('widget.titles.' + w.id),
      description: _t('widget.descriptions.' + w.id),
      deviceType: stateProps.activeDeviceType
    });
  });

  var setWidgetToAdd = function setWidgetToAdd(data) {
    return dispatchProps.setForm('widgetToAdd', data);
  };
  var resetWidgetToAdd = function resetWidgetToAdd() {
    return dispatchProps.resetForm('widgetToAdd');
  };

  return _extends({}, stateProps, dispatchProps, ownProps, {
    widgets: stateProps.widgets.map(function (widget) {
      return prepareWidget(_extends({}, widget, {
        devices: stateProps.devices,
        unit: stateProps.unit,
        breakdown: stateProps.breakdown,
        brackets: stateProps.brackets,
        tip: Array.isArray(stateProps.tips) && stateProps.tips.length > 0 && stateProps.tips[0]
      }), ownProps.intl);
    }),
    deviceCount: getDeviceCount(stateProps.devices),
    meterCount: getMeterCount(stateProps.devices),
    saveToProfile: function saveToProfile() {
      return dispatchProps.saveConfiguration(newWidgetState);
    },
    deviceTypes: deviceTypes,
    widgetTypes: widgetTypes,
    setWidgetToAdd: setWidgetToAdd,
    resetWidgetToAdd: resetWidgetToAdd,
    _t: _t
  });
}

var DashboardData = injectIntl(connect(mapStateToProps, mapDispatchToProps, mergeProps)(Dashboard));
module.exports = DashboardData;