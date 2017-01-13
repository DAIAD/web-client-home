/**
 * Message Actions module.
 * Action creators for Messages section
 * 
 * @module MessageActions
 */

const { push } = require('react-router-redux');

const QueryActions = require('./QueryActions');

const messageAPI = require('../api/message');

const { getTypeByCategory, getInfoboxByAlertType } = require('../utils/messages');

const { MESSAGE_TYPES } = require('../constants/HomeConstants');
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

const setMessages = function (response) {
  const messages = {};
  const { alerts, recommendations, tips, announcements } = response;
  if (alerts.length > 0) messages.alerts = alerts;
  if (announcements.length > 0) messages.announcements = announcements;
  if (recommendations.length > 0) messages.recommendations = recommendations;
  if (tips.length > 0) messages.tips = tips;

  return {
    type: types.MESSAGES_SET,
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
      messages: [{ id, type, timestamp }], 
      csrf: getState().user.csrf,
    };

    return messageAPI.acknowledge(data)
    .then((response) => {
      if (!response.success) {
        console.error(response.errors && response.errors.length > 0 ? response.errors[0] : 'unknown');
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
      const infobox = getInfoboxByAlertType(activeMessage.alert, activeMessage.createdOn);
      if (!infobox) return;

      dispatch(QueryActions.fetchInfoboxData(infobox)) 
      .then(data => dispatch(setMessageExtra(id, category, { extra: { ...infobox, ...data } })))
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
      pagination: options,
      csrf: getState().user.csrf,
    };
    return messageAPI.fetch(data)
    .then((response) => {
      if (!response || !response.success) {
        const errorCode = response && response.errors && response.errors.length > 0 ? 
                        response.errors[0].code 
                          : 'unknownError';
        throw new Error(errorCode);
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

/**
 * Fetch all messages in descending order (most recent first)
 */
const fetchAll = function () {
  return function (dispatch, getState) {
    dispatch(fetch(MESSAGE_TYPES.map(x => ({ ...x, ascending: false }))))
    .then(response => (response && response.success ? 
          dispatch(setMessages(response)) 
          : response),
         );
  };
};

module.exports = {
  linkToMessage,
  fetch,
  fetchAll,
  acknowledge,
  setActiveTab,
  setActiveMessageId,
};
