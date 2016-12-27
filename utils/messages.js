const { last24Hours } = require('./time');

const getTypeByCategory = function (category) {
  if (category === 'alerts') return 'ALERT';
  else if (category === 'announcements') return 'ANNOUNCEMENT';
  else if (category === 'recommendations') return 'RECOMMENDATION_DYNAMIC';
  else if (category === 'tips') return 'RECOMMENDATION_STATIC';
  
  throw new Error('category not supported: ', category);
};

const getInfoboxByAlertType = function (type, timestamp) {
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


module.exports = {
  combineMessages,
  getTypeByCategory,
  getInfoboxByAlertType,
  stripTags,
};
