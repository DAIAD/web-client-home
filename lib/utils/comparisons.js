'use strict';

var _require = require('./time'),
    getComparisonPeriod = _require.getComparisonPeriod;

var getMeterComparisonTitle = function getMeterComparisonTitle(comparison, start, period, favCommon, _t) {
  var extra = '';
  if (comparison === 'last') {
    extra = getComparisonPeriod(start, period, _t);
  } else if (comparison === 'common') {
    extra = favCommon;
  }
  return _t('comparisons.' + comparison, { comparison: extra });
};

var getAmphiroComparisonTitle = function getAmphiroComparisonTitle(comparison, members, _t) {
  var member = members.find(function (m) {
    return String(m.index) === comparison;
  });
  return _t('comparisons.member', { comparison: member ? member.name : '' });
};

var getComparisonTitle = function getComparisonTitle(devType, comparison, start, period, favCommon, members, _t) {
  if (devType === 'METER') {
    return getMeterComparisonTitle(comparison, start, period, favCommon, _t);
  } else if (devType === 'AMPHIRO') {
    return getAmphiroComparisonTitle(comparison, members, _t);
  }
  return '';
};

var getComparisons = function getComparisons(devType, memberFilter, members) {
  if (devType === 'METER') {
    return ['last', 'all', 'common', 'nearest', 'similar'];
  } else if (devType === 'AMPHIRO') {
    return memberFilter !== 'all' ? members.filter(function (m) {
      return m.index !== memberFilter;
    }).map(function (m) {
      return String(m.index);
    }) : [];
  }
  return [];
};

module.exports = {
  getComparisonTitle: getComparisonTitle,
  getComparisons: getComparisons
};