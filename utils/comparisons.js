const { getComparisonPeriod } = require('./time');

const getMeterComparisonTitle = function (comparison, start, period, favCommon, intl) {
  let extra = '';
  if (comparison === 'last') {
    extra = getComparisonPeriod(start, period, intl);
  } else if (comparison === 'common') {
    extra = favCommon;
  }
  return intl.formatMessage({ id: `comparisons.${comparison}` }, { comparison: extra });
};

const getAmphiroComparisonTitle = function (comparison, members, intl) {
  const member = members.find(m => String(m.index) === comparison);
  return intl.formatMessage({ id: 'comparisons.member' }, { comparison: member ? member.name : '' });
};

const getComparisonTitle = function (devType, comparison, start, period, favCommon, members, intl) {
  if (devType === 'METER') {
    return getMeterComparisonTitle(comparison, start, period, favCommon, intl);
  } else if (devType === 'AMPHIRO') {
    return getAmphiroComparisonTitle(comparison, members, intl);
  }
  return '';
};

const getComparisons = function (devType, memberFilter, members) {
   if (devType === 'METER') {
     return ['last', 'all', 'common', 'nearest', 'similar'];
   } else if (devType === 'AMPHIRO') {
     return memberFilter !== 'all' ? 
       members.filter(m => m.index !== memberFilter).map(m => String(m.index))
         : [];
   }
   return [];
};

module.exports = {
  getComparisonTitle,
  getComparisons,
};

