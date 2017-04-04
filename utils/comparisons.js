const { getComparisonPeriod } = require('./time');

const getMeterComparisonTitle = function (comparison, start, period, favCommon, _t) {
  let extra = '';
  if (comparison === 'last') {
    extra = getComparisonPeriod(start, period, _t);
  } else if (comparison === 'common') {
    extra = favCommon;
  }
  return _t(`comparisons.${comparison}`, { comparison: extra });
};

const getAmphiroComparisonTitle = function (comparison, members, _t) {
  const member = members.find(m => String(m.index) === comparison);
  return _t('comparisons.member', { comparison: member ? member.name : '' });
};

const getComparisonTitle = function (devType, comparison, start, period, favCommon, members, _t) {
  if (devType === 'METER') {
    return getMeterComparisonTitle(comparison, start, period, favCommon, _t);
  } else if (devType === 'AMPHIRO') {
    return getAmphiroComparisonTitle(comparison, members, _t);
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

