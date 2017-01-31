const { injectIntl } = require('react-intl');
const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');

const DashboardActions = require('../actions/DashboardActions');
const { linkToHistory } = require('../actions/HistoryActions');
const { saveToProfile } = require('../actions/UserActions');
const { setForm } = require('../actions/FormActions');

const Dashboard = require('../components/sections/Dashboard');

const { getDeviceCount, getMeterCount } = require('../utils/device');
const { prepareWidget } = require('../utils/widgets/');
const { filterObj } = require('../utils/general');

const { WIDGET_TYPES } = require('../constants/HomeConstants');


function mapStateToProps(state) {
  return {
    firstname: state.user.profile.firstname,
    devices: state.user.profile.devices,
    layout: state.section.dashboard.layout,
    mode: state.section.dashboard.mode,
    dirty: state.section.dashboard.dirty,
    widgets: state.section.dashboard.widgets,
    widgetToAdd: state.forms.widgetToAdd,
    width: state.viewport.width,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ 
    ...DashboardActions, 
    linkToHistory, 
    saveToProfile, 
    setForm, 
  }, dispatch);
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  const deviceType = (stateProps.widgetToAdd && stateProps.widgetToAdd.deviceType) ? 
    stateProps.widgetToAdd.deviceType 
    : 
    null;

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
      'title',
      'type',
    ])),
    layout: stateProps.layout,
  };

  const types = WIDGET_TYPES
  .filter(x => (deviceType ? stateProps.widgetToAdd.deviceType === x.devType : null));

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    widgets: stateProps.widgets.map(widget => 
      prepareWidget(widget, stateProps.devices, ownProps.intl)),
    addWidget: () => {
      const type = types.find(x => x.id === stateProps.widgetToAdd.type);
      return dispatchProps.addWidget({
        data: [], 
        period: deviceType === 'AMPHIRO' ? 'ten' : 'month', 
        ...stateProps.widgetToAdd, 
        title: stateProps.widgetToAdd.title || type.title, 
        ...type.data,
      });
    },
    deviceCount: getDeviceCount(stateProps.devices),
    meterCount: getMeterCount(stateProps.devices),
    saveToProfile: () => dispatchProps.saveToProfile({ configuration: JSON.stringify(newWidgetState) }),
    deviceTypes,
    types,
  };
}

const DashboardData = injectIntl(connect(mapStateToProps, 
                                         mapDispatchToProps, 
                                         mergeProps
                                        )(Dashboard));
module.exports = DashboardData;
