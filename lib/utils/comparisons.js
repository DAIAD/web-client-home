'use strict';

var _require = require('./time'),
    getComparisonPeriod = _require.getComparisonPeriod;

var getMeterComparisonTitle = function getMeterComparisonTitle(comparison, start, period, favCommon, intl) {
  var extra = '';
  if (comparison === 'last') {
    extra = getComparisonPeriod(start, period, intl);
  } else if (comparison === 'common') {
    extra = favCommon;
  }
  return intl.formatMessage({ id: 'comparisons.' + comparison }, { comparison: extra });
};

var getAmphiroComparisonTitle = function getAmphiroComparisonTitle(comparison, members, intl) {
  var member = members.find(function (m) {
    return String(m.index) === comparison;
  });
  return intl.formatMessage({ id: 'comparisons.member' }, { comparison: member ? member.name : '' });
};

var getComparisonTitle = function getComparisonTitle(devType, comparison, start, period, favCommon, members, intl) {
  if (devType === 'METER') {
    return getMeterComparisonTitle(comparison, start, period, favCommon, intl);
  } else if (devType === 'AMPHIRO') {
    return getAmphiroComparisonTitle(comparison, members, intl);
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