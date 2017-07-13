const { getComparisonPeriod } = require('./time');
const { BASE64, IMAGES, PNG_IMAGES } = require('../constants/HomeConstants');

const getMeterComparisonDetails = function (comparison, start, period, favCommon, intl) {
  let extra = '';
  let image = null;
  if (comparison === 'last') {
    extra = getComparisonPeriod(start, period, intl);
    image = `${IMAGES}/challenge-daily.svg`;
  } else if (comparison === 'common' && favCommon) {
    extra = favCommon.name.length > 10 ? `${favCommon.name.substring(0, 7).trim()}...` : favCommon.name;
    image = favCommon.image ? `${BASE64}${favCommon.image}` : `${IMAGES}/family-mode.svg`;
  } else if (comparison === 'all') {
    image = `${IMAGES}/city.svg`;
  } else if (comparison === 'nearest') {
    image = `${IMAGES}/neighbors.svg`;
  } else if (comparison === 'similar') {
    image = `${IMAGES}/account.svg`;
  }
  return {
    title: intl.formatMessage({ id: `comparisons.${comparison}` }, { comparison: extra }),
    image,
  };
};

const getAmphiroComparisonDetails = function (comparison, members, intl) {
  const member = members.find(m => String(m.index) === comparison);
  return {
    title: intl.formatMessage({ id: 'comparisons.member' }, { comparison: member ? member.name : '' }),
    image: member && member.photo ? `${BASE64}${member.photo}` : `${PNG_IMAGES}/daiad-consumer.png`,
  };
};

const getComparisonDetails = function (devType, comparison, start, period, favCommon, members, intl) {
  if (devType === 'METER') {
    return getMeterComparisonDetails(comparison, start, period, favCommon, intl);
  } else if (devType === 'AMPHIRO') {
    return getAmphiroComparisonDetails(comparison, members, intl);
  }
  return '';
};

const getComparisons = function (devType, favCommon, memberFilter, members) {
   if (devType === 'METER') {
     return ['last', 'all', 'common', 'nearest', 'similar']
     .filter(c => favCommon == null ? c !== 'common' : c);
   } else if (devType === 'AMPHIRO') {
     return memberFilter !== 'all' ? 
       members.filter(m => m.index !== memberFilter).map(m => String(m.index))
         : [];
   }
   return [];
};

module.exports = {
  getComparisonDetails,
  getComparisons,
};

