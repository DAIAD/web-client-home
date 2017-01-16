const { injectIntl } = require('react-intl');
const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');


const Notifications = require('../components/sections/Notifications');

const MessageActions = require('../actions/MessageActions');

const { transformInfoboxData } = require('../utils/transformations');
const { stripTags } = require('../utils/messages');

function mapStateToProps(state) {
  return {
    devices: state.user.profile.devices,
    activeTab: state.section.messages.activeTab,
    activeMessageId: state.section.messages.activeMessageId,
    alerts: state.section.messages.alerts,
    announcements: state.section.messages.announcements,
    recommendations: state.section.messages.recommendations,
    tips: state.section.messages.tips,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(MessageActions, dispatch);
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  // joint alerts & announcements
  const alertments = stateProps.alerts.concat(stateProps.announcements);

  let messages = [];
  if (stateProps.activeTab === 'alerts') messages = alertments;
  else if (stateProps.activeTab === 'recommendations') messages = stateProps.recommendations;
  else if (stateProps.activeTab === 'tips') messages = stateProps.tips;

  messages = messages.map(message => stripTags(message));

  const categories = [{
    id: 'alerts', 
    title: 'notifications.alerts', 
    unread: alertments
    .reduce((prev, curr) => !(curr.acknowledgedOn ? prev + 1 : prev), 0),
  }, 
  {
    id: 'recommendations', 
    title: 'notifications.recommendations', 
    unread: stateProps.recommendations
    .reduce((prev, curr) => (!curr.acknowledgedOn ? prev + 1 : prev), 0),
  }, 
  {
    id: 'tips', 
    title: 'notifications.tips', 
    unread: stateProps.tips
    .reduce((prev, curr) => (!curr.acknowledgedOn ? prev + 1 : prev), 0),
  }, 
  ];

  // const unread = categories.reduce(((prev, curr) => curr.unread+prev), 0); 
  const activeMessageIndex = stateProps.activeMessageId ? 
    messages.findIndex(x => x.id === stateProps.activeMessageId) 
    : null;

  const activeMessage = activeMessageIndex != null ? 
    messages[activeMessageIndex] 
    : null;

  const infobox = activeMessage && activeMessage.extra ? 
    transformInfoboxData(activeMessage.extra, 
                         stateProps.devices, 
                         ownProps.intl
                        ) : {}; 
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    nextMessageId: activeMessageIndex != null && messages[activeMessageIndex + 1] ?
      messages[activeMessageIndex + 1].id
      : null,
    previousMessageId: activeMessageIndex != null && messages[activeMessageIndex - 1] ?
      messages[activeMessageIndex - 1].id
    : null,
    categories,
    infobox,
    messages,
    activeMessage,
  };
}

const MessageData = injectIntl(connect(mapStateToProps, 
                                       mapDispatchToProps, 
                                       mergeProps
                                      )(Notifications));
module.exports = MessageData;
