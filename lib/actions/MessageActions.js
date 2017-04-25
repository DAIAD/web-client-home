'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * Message Actions module.
 * Action creators for Messages section
 * 
 * @module MessageActions
 */

var _require = require('react-router-redux'),
    push = _require.push;

var QueryActions = require('./QueryActions');

var messageAPI = require('../api/message');

var _require2 = require('../utils/messages'),
    getTypeByCategory = _require2.getTypeByCategory,
    getCategoryByType = _require2.getCategoryByType,
    getWidgetByAlertType = _require2.getWidgetByAlertType,
    getAllMessageTypes = _require2.getAllMessageTypes;

var _require3 = require('../utils/general'),
    throwServerError = _require3.throwServerError;

var _require4 = require('../constants/HomeConstants'),
    MESSAGE_TYPES = _require4.MESSAGE_TYPES,
    MESSAGES_PAGE = _require4.MESSAGES_PAGE;

var types = require('../constants/ActionTypes');

var setMessageExtra = function setMessageExtra(id, category, extra) {
  return {
    type: types.MESSAGE_SET_EXTRA,
    id: id,
    category: category,
    extra: extra
  };
};

var setMessageRead = function setMessageRead(id, category, timestamp) {
  return {
    type: types.MESSAGE_SET_READ,
    id: id,
    category: category,
    timestamp: timestamp
  };
};

var setMessages = function setMessages(messages) {
  return {
    type: types.MESSAGES_SET,
    messages: messages
  };
};

var appendMessages = function appendMessages(category, messages) {
  return {
    type: types.MESSAGES_APPEND,
    category: category,
    messages: messages
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
var acknowledge = function acknowledge(id, category, timestamp) {
  return function (dispatch, getState) {
    if (!id || !category || !timestamp) {
      throw new Error('Not sufficient data provided for message acknowledgement.' + 'Requires id, type, timestamp');
    }
    var message = getState().section.messages[category].find(function (x) {
      return x.id === id;
    });

    if (message && message.acknowledgedOn != null) {
      return Promise.resolve();
    }
    dispatch(QueryActions.requestedQuery());

    var type = getTypeByCategory(category);

    var data = {
      messages: [{
        id: id,
        type: type,
        timestamp: timestamp
      }],
      csrf: getState().user.csrf
    };

    return messageAPI.acknowledge(data).then(function (response) {
      if (!response || !response.success) {
        throwServerError(response);
      }

      dispatch(QueryActions.receivedQuery(response.success, response.errors));
      dispatch(QueryActions.resetSuccess());

      dispatch(setMessageRead(id, category, timestamp));

      return response;
    }).catch(function (error) {
      dispatch(QueryActions.receivedQuery(false, error));
      throw error;
    });
  };
};

var increaseActiveIndex = function increaseActiveIndex(category, step) {
  return {
    type: types.MESSAGES_INCREASE_ACTIVE_INDEX,
    category: category,
    step: step
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
var setActiveTab = function setActiveTab(category) {
  if (!Object.keys(MESSAGE_TYPES).includes(category)) {
    throw new Error('Tab needs to be one of ' + Object.keys(MESSAGE_TYPES).join(', ') + 'Provided ' + category);
  }
  var tab = category === 'announcements' ? 'alerts' : category;
  return {
    type: types.MESSAGES_SET_ACTIVE_TAB,
    category: tab
  };
};

var setActiveMessageId = function setActiveMessageId(id) {
  return {
    type: types.MESSAGES_SET_ACTIVE,
    id: id
  };
};

/**
 * Set active message id and acknowledge
 * Important! the message category must have been set otherwise
 *
 * @param {Number} id - The message id
 * @param {String} type - The message type
 */
var setActiveMessage = function setActiveMessage(id, type) {
  return function (dispatch, getState) {
    if (!id || !type) {
      throw new Error('Not sufficient data provided for selecting message, missing id and/or message type');
    }
    var category = getCategoryByType(type);

    dispatch(setActiveTab(category));
    dispatch(setActiveMessageId(id));

    dispatch(acknowledge(id, category, new Date().getTime()));

    var activeMessage = getState().section.messages[category].find(function (m) {
      return m.id === id;
    });

    if (category === 'alerts') {
      var _ret = function () {
        var widget = getWidgetByAlertType(activeMessage.alertType, activeMessage.createdOn);
        if (!widget) return {
            v: void 0
          };

        dispatch(QueryActions.fetchWidgetData(widget)).then(function (data) {
          return dispatch(setMessageExtra(id, category, _extends({}, widget, data)));
        }).catch(function (error) {
          console.error('Oops, sth went wrong in setting message extra data', error);
        });
      }();

      if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
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
var linkToMessage = function linkToMessage(id, type) {
  return function (dispatch, getState) {
    dispatch(setActiveMessage(id, type));
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
var fetch = function fetch(options) {
  return function (dispatch, getState) {
    if (!Array.isArray(options)) throw new Error('Fetch requires array of options:', options);

    dispatch(QueryActions.requestedQuery());

    var data = {
      messages: options,
      csrf: getState().user.csrf
    };

    return messageAPI.fetch(data).then(function (response) {
      if (!response || !response.success) {
        throwServerError(response);
      }
      dispatch(QueryActions.receivedQuery(response.success, null));
      dispatch(QueryActions.resetSuccess());

      // make sure announcements have description field like other message types
      var announcements = response.announcements.map(function (m) {
        return _extends({}, m, {
          description: m.content
        });
      });

      return _extends({}, response, {
        announcements: announcements
      });
    }).catch(function (error) {
      console.error('Caught error in messages fetch:', error);
      dispatch(QueryActions.receivedQuery(false, error));
    });
  };
};

var fetchAndAppend = function fetchAndAppend(categories) {
  return function (dispatch, getState) {
    var data = categories.map(function (category) {
      return {
        type: MESSAGE_TYPES[category],
        pagination: {
          ascending: false,
          size: MESSAGES_PAGE,
          offset: getState().section.messages.activeIndex[category]
        }
      };
    });

    dispatch(fetch(data)).then(function (response) {
      categories.forEach(function (category) {
        dispatch(appendMessages(category, response[category]));
      });
    });
  };
};

var fetchMoreSingle = function fetchMoreSingle(category) {
  return function (dispatch, getState) {
    var _getState$section$mes = getState().section.messages,
        activeIndex = _getState$section$mes.activeIndex,
        total = _getState$section$mes.total;


    if (activeIndex[category] + MESSAGES_PAGE >= total[category]) {
      return;
    }
    dispatch(increaseActiveIndex(category, MESSAGES_PAGE));
    dispatch(fetchAndAppend([category]));
  };
};

var fetchMoreAll = function fetchMoreAll() {
  return function (dispatch, getState) {
    var _getState$section$mes2 = getState().section.messages,
        activeIndex = _getState$section$mes2.activeIndex,
        total = _getState$section$mes2.total;


    var categories = Object.keys(MESSAGE_TYPES).map(function (category) {
      if (activeIndex[category] + MESSAGES_PAGE >= total[category]) {
        return null;
      }
      dispatch(increaseActiveIndex(category, MESSAGES_PAGE));
      return category;
    }).filter(function (x) {
      return x != null;
    });

    dispatch(fetchAndAppend(categories));
  };
};

/**
 * Fetch all messages in descending order (most recent first)
 */
var fetchInitial = function fetchInitial() {
  return function (dispatch, getState) {
    var data = getAllMessageTypes().map(function (type) {
      return {
        type: type,
        pagination: {
          ascending: false,
          size: MESSAGES_PAGE,
          offset: 0
        }
      };
    });
    dispatch(fetch(data)).then(function (response) {
      if (!response) return;

      var messages = {
        alerts: response.alerts,
        announcements: response.announcements,
        recommendations: response.recommendations,
        tips: response.tips,
        total: {
          alerts: response.totalAlerts,
          announcements: response.totalAnnouncements,
          recommendations: response.totalRecommendations,
          tips: response.totalTips
        }
      };

      dispatch(setMessages(messages));
    });
  };
};

module.exports = {
  linkToMessage: linkToMessage,
  fetch: fetch,
  fetchInitial: fetchInitial,
  fetchMoreAll: fetchMoreAll,
  fetchMoreSingle: fetchMoreSingle,
  acknowledge: acknowledge,
  setActiveTab: setActiveTab,
  setActiveMessage: setActiveMessage,
  appendMessages: appendMessages
};