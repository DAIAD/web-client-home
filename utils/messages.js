const { last24Hours } = require('./time');
const { MESSAGE_TYPES } = require('../constants/HomeConstants');

const getTypeByCategory = function (category) {
  return MESSAGE_TYPES[category];
};

const getWidgetByAlertType = function (type, timestamp) {
  switch (type) {
    case 'WATER_LEAK':
      return {
        type: 'total',
        display: 'chart',
        period: 'day',
        time: last24Hours(timestamp),
        deviceType: 'METER',
        metric: 'difference',
        data: [],
      };

    case 'WATER_QUALITY':
      return {
        type: 'total',
        display: 'chart',
        period: 'ten',
        deviceType: 'AMPHIRO',
        metric: 'temperature',
        data: [],
      };
    default:
      return null;
  }
};

const stripTags = function (message) {
  let title = message.title;
  let description = message.description;
  const strings = ['<h1>', '</h1>', '<h2>', '</h2>', '<h3>', '</h3>'];

  strings.forEach((s) => {
    title = title.replace(new RegExp(s, 'g'), '');
    description = description.replace(new RegExp(s, 'g'), '');
  });
  
  return {
    ...message, 
    title, 
    description,
  };
};

// TODO: type label already present in messages
// remove extra maps
// TODO: fix sort
const combineMessages = function (categories) {
  return categories.map(cat => 
                       cat.values.map(msg => ({ ...stripTags(msg), category: cat.name })))
                       .reduce(((prev, curr) => prev.concat(curr)), [])
                       .sort((a, b) => b.createdOn - a.createdOn);
};

const getAllMessageTypes = function () {
  return Object.keys(MESSAGE_TYPES)
  .map((type => MESSAGE_TYPES[type]));
};

module.exports = {
  combineMessages,
  getTypeByCategory,
  getWidgetByAlertType,
  stripTags,
  getAllMessageTypes,
};
