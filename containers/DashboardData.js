const { injectIntl } = require('react-intl');
const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');

const DashboardActions = require('../actions/DashboardActions');
const { linkToHistory } = require('../actions/HistoryActions');
const { saveConfiguration } = require('../actions/UserActions');
const { setForm } = require('../actions/FormActions');

const Dashboard = require('../components/sections/Dashboard');

const { getDeviceCount, getMeterCount } = require('../utils/device');
const prepareWidget = require('../utils/widgets');
const { filterObj, formatMessage } = require('../utils/general');

const { AMPHIRO_WIDGET_TYPES, METER_WIDGET_TYPES } = require('../constants/HomeConstants');


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
    width: state.viewport.width,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ 
    ...DashboardActions, 
    linkToHistory, 
    saveConfiguration, 
    setForm, 
  }, dispatch);
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  let deviceTypes = [{
    id: 'AMPHIRO', 
    title: 'Shower',
  }, {
    id: 'METER', 
    title: 'Smart Water Meter',
  }];
  
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
      'id',
      'deviceType',
      'display',
      'metric',
      'period',
      'periodIndex',
      'title',
      'type',
    ])),
    layout: stateProps.layout,
  };

  if (stateProps.activeDeviceType !== 'AMPHIRO' &&
      stateProps.activeDeviceType !== 'METER') {
        console.error('Oops, wrong device type', stateProps.activeDeviceType);
      }
  const widgetTypes = stateProps.activeDeviceType === 'AMPHIRO' ? 
    AMPHIRO_WIDGET_TYPES.map(w => ({ 
      ...w, 
      deviceType: 'AMPHIRO',
    }))
    :
    METER_WIDGET_TYPES.map(w => ({ 
      ...w, 
      deviceType: 'METER', 
    }));

  const setWidgetToAdd = data => dispatchProps.setForm('widgetToAdd', data);

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    widgets: stateProps.widgets.map(widget => 
      prepareWidget(widget, stateProps.devices, ownProps.intl)),   
    deviceCount: getDeviceCount(stateProps.devices),
    meterCount: getMeterCount(stateProps.devices),
    saveToProfile: () => dispatchProps.saveConfiguration(newWidgetState),
    deviceTypes,
    widgetTypes,
    setWidgetToAdd,
    _t: formatMessage(ownProps.intl),
  };
}

const DashboardData = injectIntl(connect(mapStateToProps, 
                                         mapDispatchToProps, 
                                         mergeProps
                                        )(Dashboard));
module.exports = DashboardData;
