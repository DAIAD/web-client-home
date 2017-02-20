/**
 * Message Actions module.
 * Action creators for Messages section
 * 
 * @module MessageActions
 */

const { push } = require('react-router-redux');

const QueryActions = require('./QueryActions');

const messageAPI = require('../api/message');

const { getTypeByCategory, getWidgetByAlertType, getAllMessageTypes } = require('../utils/messages');
const { throwServerError } = require('../utils/general');

const { MESSAGE_TYPES, MESSAGES_PAGE } = require('../constants/HomeConstants');
const types = require('../constants/ActionTypes');


const requestedMessages = function () {
  return {
    type: types.MESSAGES_REQUEST_START,
  };
};

const receivedMessages = function (success, errors) {
  return {
    type: types.MESSAGES_REQUEST_END,
    success,
    errors,
  };
};

const requestedMessageAck = function () {
  return {
    type: types.MESSAGES_ACK_REQUEST_START,
  };
};

const receivedMessageAck = function (success, errors) {
  return {
    type: types.MESSAGES_ACK_REQUEST_END,
    success,
    errors,
  };
};

const setMessageExtra = function (id, category, extra) {
  return {
    type: types.MESSAGE_SET_EXTRA,
    id,
    category,
    extra,
  };
};

const setMessageRead = function (id, category, timestamp) {
  return {
    type: types.MESSAGE_SET_READ,
    id,
    category,
    timestamp,
  };
};

const setMessages = function (messages) {
  return {
    type: types.MESSAGES_SET,
    messages,
  };
};

const appendMessages = function (category, messages) {
  return {
    type: types.MESSAGES_APPEND,
    category,
    messages,
  };
};

/**
 * Acknowledge message
 *
 * @param {Number} id - Message id 
 * @param {String} category - The message category, a friendlier name for type 
 *                                One of alerts, tips, recommendations, announcements for  
 *                                        ALERT, RECOMMENDATION_STATIC, 
 *                                        RECOMMENDATION_DYNAMIC, ANNOUNCEMENT
 * @param {Number} timestamp - The timestamp of the time of acknowledgement
 */
const acknowledge = function (id, category, timestamp) {
  return function (dispatch, getState) {
    if (!id || !category || !timestamp) {
      throw new Error(`Not sufficient data provided for message acknowledgement. (id, type, timestamp): ${id}, ${category}, ${timestamp}`);
    }
    const message = getState().section.messages[category].find(x => x.id === id);
    
    if (message && message.acknowledgedOn != null) {
      return Promise.resolve();
    }
    dispatch(requestedMessageAck());

    const type = getTypeByCategory(category);

    const data = {
      messages: [{ 
        id, 
        type, 
        timestamp,
      }], 
      csrf: getState().user.csrf,
    };

    return messageAPI.acknowledge(data)
    .then((response) => {
      if (!response || !response.success) {
        throwServerError(response);  
      }
      
      dispatch(receivedMessageAck(response.success, response.errors));
      dispatch(QueryActions.resetSuccess());

      dispatch(setMessageRead(id, category, timestamp));
      
      return response;
    })
    .catch((error) => {
      dispatch(receivedMessageAck(false, error));
      throw error;
    });
  };
};

const increaseActiveIndex = function (category, step) {
  return {
    type: types.MESSAGES_INCREASE_ACTIVE_INDEX,
    category,
    step,
  };
};

/**
 * Set active message category 
 *
 * @param {String} category - The message category, a friendlier name for type 
 *                                One of alerts, tips, recommendations, announcements for  
 *                                        ALERT, RECOMMENDATION_STATIC, 
 *                                        RECOMMENDATION_DYNAMIC, ANNOUNCEMENT
 */
const setActiveTab = function (category) {
  if (!(category === 'alerts' 
        || category === 'announcements' 
        || category === 'recommendations' 
        || category === 'tips')) {
    throw new Error('Tab needs to be one of alerts, announcements, recommendations, tips. Provided: ', category);
  }

  return {
    type: types.MESSAGES_SET_ACTIVE_TAB,
    category,
  };
};

/**
 * Set active message id and acknowledge
 * Important! the message category must have been set otherwise
 *
 * @param {Number} id - The message id
 */
const setActiveMessageId = function (id) {
  return function (dispatch, getState) {
    if (!id) throw new Error('Not sufficient data provided for selecting message, missing id');

    dispatch({
      type: types.MESSAGES_SET_ACTIVE,
      id,
    });

    const category = getState().section.messages.activeTab;
    const activeMessageIndex = getState().section.messages[category].findIndex(x => x.id === id);
    const activeMessage = activeMessageIndex != null ? 
      getState().section.messages[category][activeMessageIndex] 
      : {};

    dispatch(acknowledge(id, category, new Date().getTime()));

    if (category === 'alerts') {
      const widget = getWidgetByAlertType(activeMessage.alertType, activeMessage.createdOn);
      if (!widget) return;

      dispatch(QueryActions.fetchWidgetData(widget)) 
      .then(data => dispatch(setMessageExtra(id, category, { extra: { ...widget, ...data } })))
      .catch((error) => {
        console.error('Oops, sth went wrong in setting message extra data', error);
      });
    }
  };
};

/**
 * Updates all message options provided and switches to message section
 *
 * @param {Object} options - Contains messages section options to set active message (id, category)
 * @param {String} options.id - Message id to set active 
 * @param {Array} options.category - Message category to set active 
 */
const linkToMessage = function (options) {
  return function (dispatch, getState) {
    const { id, category } = options;

    if (category) dispatch(setActiveTab(category));
    if (id) dispatch(setActiveMessageId(id));

    dispatch(push('/notifications'));
  };
};

/**
 * Fetch messages with the given options 
 *
 * @param {Object[]} options - Fetch messages options array of objects
 * @param {String} options.type - The message type to fetch. 
 *                                One of ALERT, RECOMMENDATION_STATIC, 
 *                                RECOMMENDATION_DYNAMIC, ANNOUNCEMENT
 */
const fetch = function (options) {
  return function (dispatch, getState) {
    if (!Array.isArray(options)) throw new Error('Fetch requires array of options:', options);

    dispatch(requestedMessages());

    const data = {
      messages: options,
      csrf: getState().user.csrf,
    };

    return messageAPI.fetch(data)
    .then((response) => {
      if (!response || !response.success) {
        throwServerError(response);  
      }
      dispatch(receivedMessages(response.success, null));
      dispatch(QueryActions.resetSuccess());

      return response;
    })
    .catch((error) => {
      console.error('Caught error in messages fetch:', error); 
      dispatch(receivedMessages(false, error));
    });
  };
};

const fetchAndAppend = function (categories) {
  return function (dispatch, getState) {
    const data = categories.map(category => ({
      type: MESSAGE_TYPES[category],
      pagination: {
        ascending: false,
        size: MESSAGES_PAGE,
        offset: getState().section.messages.activeIndex[category],
      },
    }));

    dispatch(fetch(data))
    .then((response) => {
      categories.forEach((category) => {
        dispatch(appendMessages(category, response[category]));
      });
    });
  };
};

const fetchMoreSingle = function (category) {
  return function (dispatch, getState) {
    const { activeIndex, total } = getState().section.messages;
    
    if (activeIndex[category] + MESSAGES_PAGE >= total[category]) {
      return;
    }
    dispatch(increaseActiveIndex(category, MESSAGES_PAGE));
    dispatch(fetchAndAppend([category]));
  };
};

const fetchMoreAll = function () {
  return function (dispatch, getState) {
    const { activeIndex, total } = getState().section.messages;
    
    const categories = Object.keys(MESSAGE_TYPES)
    .map((category) => {
      if (activeIndex[category] + MESSAGES_PAGE >= total[category]) {
        return null;
      }
      dispatch(increaseActiveIndex(category, MESSAGES_PAGE));
      return category;
    })
    .filter(x => x != null);

    dispatch(fetchAndAppend(categories));
  };
};


/**
 * Fetch all messages in descending order (most recent first)
 */
const fetchInitial = function () {
  return function (dispatch, getState) {
    const data = getAllMessageTypes().map(type => ({ 
      type,
      pagination: {
        ascending: false,
        size: MESSAGES_PAGE,
        offset: 0,
      },
    }));
    dispatch(fetch(data))
    .then((response) => {
      if (!response) return;

      const messages = {
        alerts: response.alerts,
        announcements: response.announcements,
        recommendations: response.recommendations,
        tips: response.tips,
        total: {
          alerts: response.totalAlerts,
          announcements: response.totalAnnouncements,
          recommendations: response.totalRecommendations,
          tips: response.totalTips,
        },
      };
      
      dispatch(setMessages(messages));
    });
  };
};

module.exports = {
  linkToMessage,
  fetch,
  fetchInitial,
  fetchMoreAll,
  fetchMoreSingle,
  acknowledge,
  setActiveTab,
  setActiveMessageId,
  appendMessages,
};
