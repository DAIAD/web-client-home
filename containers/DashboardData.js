const { injectIntl } = require('react-intl');
const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');

const DashboardActions = require('../actions/DashboardActions');
const { saveConfiguration } = require('../actions/UserActions');
const { setForm, resetForm } = require('../actions/FormActions');
const { linkToSection } = require('../actions/InitActions');

const Dashboard = require('../components/sections/dashboard/');

const { getDeviceCount, getMeterCount } = require('../utils/device');
const prepareWidget = require('../utils/widgets');
const { filterObj, formatMessage } = require('../utils/general');

const { DEVICE_TYPES, WIDGET_TYPES } = require('../constants/HomeConstants');


function mapStateToProps(state) {
  return {
    firstname: state.user.profile.firstname,
    devices: state.user.profile.devices,
    layout: state.section.dashboard.layout,
    mode: state.section.dashboard.mode,
    dirty: state.section.dashboard.dirty,
    widgets: state.section.dashboard.widgets,
    widgetToAdd: state.forms.widgetToAdd,
    brackets: state.section.history.priceBrackets,
    breakdown: state.section.history.waterBreakdown,
    tips: state.section.messages.tips,
    activeDeviceType: state.section.dashboard.widgetDeviceType,
    width: state.viewport.width,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ 
    ...DashboardActions, 
    saveConfiguration, 
    setForm, 
    resetForm,
    linkToSection,
  }, dispatch);
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  const _t = formatMessage(ownProps.intl);
  let deviceTypes = DEVICE_TYPES;  

  const meterCount = getMeterCount(stateProps.devices);
  const deviceCount = getDeviceCount(stateProps.devices);

  if (meterCount === 0) {
    deviceTypes = deviceTypes.filter(x => x.id !== 'METER');
  }
  
  if (deviceCount === 0) {
    deviceTypes = deviceTypes.filter(x => x.id !== 'AMPHIRO');
  }

  const newWidgetState = {
    widgets: stateProps.widgets.map(widget => filterObj(widget, [
      'widgetId',
      'id',
      'deviceType',
      'display',
      'metric',
      'period',
      'periodIndex',
      'type',
    ])),
    layout: stateProps.layout,
  };

  if (stateProps.activeDeviceType !== 'AMPHIRO' &&
      stateProps.activeDeviceType !== 'METER') {
        console.error('Oops, wrong device type', stateProps.activeDeviceType);
      }
  const widgetTypes = WIDGET_TYPES[stateProps.activeDeviceType].map(w => ({
    ...w,
    widgetId: w.id,
    title: _t(`widget.titles.${w.id}`),
    description: _t(`widget.descriptions.${w.id}`),
    deviceType: stateProps.activeDeviceType,
  }));

  const setWidgetToAdd = data => dispatchProps.setForm('widgetToAdd', data);
  const resetWidgetToAdd = () => dispatchProps.resetForm('widgetToAdd');

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    widgets: stateProps.widgets.map(widget => 
                    prepareWidget({ 
                      ...widget,
                      devices: stateProps.devices,
                      breakdown: stateProps.breakdown,
                      brackets: stateProps.brackets,
                      tips: stateProps.tips,
                    },
                    ownProps.intl)),   
    deviceCount: getDeviceCount(stateProps.devices),
    meterCount: getMeterCount(stateProps.devices),
    saveToProfile: () => dispatchProps.saveConfiguration(newWidgetState),
    deviceTypes,
    widgetTypes,
    setWidgetToAdd,
    resetWidgetToAdd,
    _t,
  };
}

const DashboardData = injectIntl(connect(mapStateToProps, 
                                         mapDispatchToProps, 
                                         mergeProps
                                        )(Dashboard));
module.exports = DashboardData;
