/**
 * Notification Actions module.
 * Action creators for Messages section
 * 
 * @module NotificationActions
 */

const { push } = require('react-router-redux');

const QueryActions = require('./QueryActions');

const messageAPI = require('../api/message');

const { getTypeByCategory, getCategoryByType, getWidgetByAlertType, getAllMessageTypes } = require('../utils/messages');
const { throwServerError } = require('../utils/general');

const { MESSAGE_TYPES, MESSAGES_PAGE } = require('../constants/HomeConstants');
const types = require('../constants/ActionTypes');


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
      throw new Error('Not sufficient data provided for message acknowledgement.' +
                      'Requires id, type, timestamp');
    }
    const message = getState().section.messages[category].find(x => x.id === id);
    
    if (message && message.acknowledgedOn != null) {
      return Promise.resolve();
    }
    dispatch(QueryActions.requestedQuery());

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
      dispatch(QueryActions.receivedQuery());

      if (!response || !response.success) {
        throwServerError(response);  
      }
      
      dispatch(setMessageRead(id, category, timestamp));
      
      return response;
    })
    .catch((error) => {
      dispatch(QueryActions.setError(error));
      return error;
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
  if (!Object.keys(MESSAGE_TYPES).includes(category)) {
    throw new Error('Tab needs to be one of ' + 
                    Object.keys(MESSAGE_TYPES).join(', ') + 
                    'Provided ' + category);
  }
  const tab = category === 'announcements' ? 'alerts' : category; 
  return {
    type: types.MESSAGES_SET_ACTIVE_TAB,
    category: tab,
  };
};

const setActiveMessageId = function (id) {
  return {
    type: types.MESSAGES_SET_ACTIVE,
    id,
  };
};

/**
 * Set active message id and acknowledge
 * Important! the message category must have been set otherwise
 *
 * @param {Number} id - The message id
 * @param {String} type - The message type
 */
const setActiveMessage = function (id, type) {
  return function (dispatch, getState) {
    if (!id || !type) {
      throw new Error('Not sufficient data provided for selecting message, missing id and/or message type');
    }
    const category = getCategoryByType(type);
    
    dispatch(setActiveTab(category));
    dispatch(setActiveMessageId(id));

    dispatch(acknowledge(id, category, new Date().getTime()));

    const activeMessage = getState().section.messages[category]
    .find(m => m.id === id);

    if (category === 'alerts') {
      const widget = getWidgetByAlertType(activeMessage.alertType, activeMessage.createdOn);
      if (!widget) return;

      dispatch(QueryActions.fetchWidgetData(widget)) 
      .then(data => dispatch(setMessageExtra(id, category, { ...widget, ...data })))
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
const linkToNotification = function (query) {
  return function (dispatch, getState) {
    const { notificationId, notificationType } = query;
    dispatch(setActiveMessage(notificationId, notificationType));
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

    dispatch(QueryActions.requestedQuery());

    const data = {
      messages: options,
      csrf: getState().user.csrf,
    };

    return messageAPI.fetch(data)
    .then((response) => {
      dispatch(QueryActions.receivedQuery());

      if (!response || !response.success) {
        throwServerError(response);  
      }

      // make sure announcements have description field like other message types
      const announcements = response.announcements.map(m => ({
        ...m,
        description: m.content,
      }));

      return {
        ...response,
        announcements,
      };
    })
    .catch((error) => {
      console.error('Caught error in messages fetch:', error); 
      dispatch(QueryActions.setError(error));
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
  linkToNotification,
  fetch,
  fetchInitial,
  fetchMoreAll,
  fetchMoreSingle,
  acknowledge,
  setActiveTab,
  setActiveMessage,
  appendMessages,
};
