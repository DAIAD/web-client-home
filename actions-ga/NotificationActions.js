const ReactGA = require('react-ga');

const Actions = require('../actions/NotificationActions');

const { getCategoryByType } = require('../utils/messages');

const setActiveTab = function (category) {
  ReactGA.modalview(`notification/${category}`);
  return Actions.setActiveTab(category);
};

const tweetMessage = function (id) {
  ReactGA.event({
    category: 'notifications',
    action: 'tweet',
    label: id.toString(),
  });
  return Actions.tweetMessage(id);
};

const setActiveMessage = function (id, type) {
  const category = getCategoryByType(type);
  ReactGA.event({
    category: 'notifications',
    action: 'read',
    label: `${category}/${id}`
  });
  return Actions.setActiveMessage(id, type);  
};

module.exports = {
  ...Actions,
  setActiveTab,
  setActiveMessage,
  tweetMessage,
};
