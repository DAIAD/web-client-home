const { injectIntl } = require('react-intl');
const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');

const Notifications = require('../components/sections/Notifications');

const MessageActions = require('../actions/MessageActions');

const prepareWidget = require('../utils/widgets');
const { stripTags } = require('../utils/messages');
const { formatMessage } = require('../utils/general');

function mapStateToProps(state) {
  return {
    devices: state.user.profile.devices,
    activeTab: state.section.messages.activeTab,
    activeIndex: state.section.messages.activeIndex,
    activeMessageId: state.section.messages.activeMessageId,
    alerts: state.section.messages.alerts,
    announcements: state.section.messages.announcements,
    recommendations: state.section.messages.recommendations,
    tips: state.section.messages.tips,
    total: state.section.messages.total,
    loading: state.query.isLoading,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(MessageActions, dispatch);
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  // joint alerts & announcements
  const alertments = [...stateProps.alerts, ...stateProps.announcements];

  let messages = [];
  if (stateProps.activeTab === 'alerts') messages = alertments;
  else if (stateProps.activeTab === 'recommendations') messages = stateProps.recommendations;
  else if (stateProps.activeTab === 'tips') messages = stateProps.tips;

  // strip tags
  messages = messages.map(message => stripTags(message));

  const categories = [{
    id: 'alerts', 
    title: 'notifications.alerts', 
    unread: alertments
    .reduce((prev, curr) => (!curr.acknowledgedOn ? prev + 1 : prev), 0),
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

  const activeMessage = stateProps.activeMessageId ? 
    messages.find(x => x.id === stateProps.activeMessageId) 
  : null;

  const activeMessageIndex = messages.findIndex(m => m.id === stateProps.activeMessageId);

  const widget = activeMessage && activeMessage.extra ? 
    prepareWidget(activeMessage.extra, 
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
    widget,
    messages,
    activeMessage,
    fetchMoreActive: () => {
      if (stateProps.activeTab === 'alerts') {
        dispatchProps.fetchMoreSingle('alerts');
        dispatchProps.fetchMoreSingle('announcements');
      } else {
        dispatchProps.fetchMoreSingle(stateProps.activeTab);
      }
    },
    totalInCategory: stateProps.total[stateProps.activeTab],
    _t: formatMessage(ownProps.intl),
  };
}

const MessageData = injectIntl(connect(mapStateToProps, 
                                       mapDispatchToProps, 
                                       mergeProps
                                      )(Notifications));
module.exports = MessageData;
