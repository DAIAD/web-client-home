'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _require = require('./time'),
    last24Hours = _require.last24Hours;

var _require2 = require('../constants/HomeConstants'),
    MESSAGE_TYPES = _require2.MESSAGE_TYPES;

var getTypeByCategory = function getTypeByCategory(category) {
  return MESSAGE_TYPES[category];
};

var getCategoryByType = function getCategoryByType(type) {
  return Object.keys(MESSAGE_TYPES).find(function (msgType) {
    return MESSAGE_TYPES[msgType] === type;
  });
};

var getWidgetByAlertType = function getWidgetByAlertType(type, timestamp) {
  switch (type) {
    case 'WATER_LEAK':
      return {
        type: 'total',
        display: 'chart',
        period: 'day',
        time: last24Hours(timestamp),
        deviceType: 'METER',
        metric: 'volume',
        data: []
      };

    case 'WATER_QUALITY':
      return {
        type: 'total',
        display: 'chart',
        period: 'ten',
        deviceType: 'AMPHIRO',
        metric: 'temperature',
        data: []
      };
    default:
      return null;
  }
};

var stripTags = function stripTags(message) {
  var title = message.title;
  var description = message.description;

  var strings = ['<h1>', '</h1>', '<h2>', '</h2>', '<h3>', '</h3>'];
  strings.forEach(function (s) {
    title = title.replace(new RegExp(s, 'g'), '');
    description = description.replace(new RegExp(s, 'g'), '');
  });

  return _extends({}, message, {
    title: title,
    description: description
  });
};

// TODO: remove extra maps
var combineMessages = function combineMessages(categories) {
  return categories.map(function (cat) {
    return cat.values.map(function (msg) {
      return stripTags(msg);
    });
  }).reduce(function (prev, curr) {
    return prev.concat(curr);
  }, []).sort(function (a, b) {
    return b.createdOn - a.createdOn;
  });
};

var getAllMessageTypes = function getAllMessageTypes() {
  return Object.values(MESSAGE_TYPES);
};

module.exports = {
  combineMessages: combineMessages,
  getTypeByCategory: getTypeByCategory,
  getCategoryByType: getCategoryByType,
  getWidgetByAlertType: getWidgetByAlertType,
  stripTags: stripTags,
  getAllMessageTypes: getAllMessageTypes
};