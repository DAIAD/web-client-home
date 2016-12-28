const { injectIntl } = require('react-intl');
const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');

const DashboardActions = require('../actions/DashboardActions');
const { linkToHistory } = require('../actions/HistoryActions');
const { saveToProfile } = require('../actions/UserActions');
const { setForm } = require('../actions/FormActions');

const Dashboard = require('../components/sections/Dashboard');

const { getDeviceCount, getMeterCount } = require('../utils/device');
const { transformInfoboxData } = require('../utils/transformations');

const { WIDGET_TYPES } = require('../constants/HomeConstants');


function mapStateToProps(state) {
  return {
    firstname: state.user.profile.firstname,
    devices: state.user.profile.devices,
    layout: state.section.dashboard.layout,
    mode: state.section.dashboard.mode,
    dirty: state.section.dashboard.dirty,
    infoboxes: state.section.dashboard.infobox,
    infoboxToAdd: state.forms.infoboxToAdd,
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
  const deviceType = (stateProps.infoboxToAdd && stateProps.infoboxToAdd.deviceType) ? 
    stateProps.infoboxToAdd.deviceType 
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

  const saveData = {
    infoboxes: stateProps.infoboxes.map(x => ({ 
      id: x.id, 
      deviceType: x.deviceType, 
      display: x.display, 
      metric: x.metric, 
      period: x.period, 
      title: x.title, 
      type: x.type,
    })), 
    layout: stateProps.layout,
  };

  const types = WIDGET_TYPES
  .filter(x => (deviceType ? stateProps.infoboxToAdd.deviceType === x.devType : null));

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    infoboxes: stateProps.infoboxes.map(infobox => 
      transformInfoboxData(infobox, stateProps.devices, ownProps.intl)),
    addInfobox: () => {
      const type = types.find(x => x.id === stateProps.infoboxToAdd.type);
      // ?  types.find(x => x.id === stateProps.infoboxToAdd.type).data : {}
      return dispatchProps.addInfobox({
        data: [], 
        period: deviceType === 'AMPHIRO' ? 'ten' : 'month', 
        ...stateProps.infoboxToAdd, 
        title: stateProps.infoboxToAdd.title || (type ? type.title : null), 
        ...(type ? type.data : {}),
      });
    },
    deviceCount: getDeviceCount(stateProps.devices),
    meterCount: getMeterCount(stateProps.devices),
    saveToProfile: () => dispatchProps.saveToProfile({ configuration: JSON.stringify(saveData) }),
    deviceTypes,
    types,
  };
}

const DashboardData = injectIntl(connect(mapStateToProps, 
                                         mapDispatchToProps, 
                                         mergeProps,
                                        )(Dashboard));
module.exports = DashboardData;
