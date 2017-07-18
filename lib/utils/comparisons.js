'use strict';

var _require = require('./time'),
    getComparisonPeriod = _require.getComparisonPeriod;

var _require2 = require('../constants/HomeConstants'),
    BASE64 = _require2.BASE64,
    IMAGES = _require2.IMAGES,
    PNG_IMAGES = _require2.PNG_IMAGES;

var getMeterComparisonDetails = function getMeterComparisonDetails(comparison, start, period, favCommon, intl) {
  var extra = '';
  var image = null;
  if (comparison === 'last') {
    extra = getComparisonPeriod(start, period, intl);
    image = IMAGES + '/challenge-daily.svg';
  } else if (comparison === 'common' && favCommon) {
    extra = favCommon.name.length > 10 ? favCommon.name.substring(0, 7).trim() + '...' : favCommon.name;
    image = favCommon.image ? '' + BASE64 + favCommon.image : IMAGES + '/family-mode.svg';
  } else if (comparison === 'all') {
    image = IMAGES + '/city.svg';
  } else if (comparison === 'nearest') {
    image = IMAGES + '/neighbors.svg';
  } else if (comparison === 'similar') {
    image = IMAGES + '/account.svg';
  }
  return {
    title: intl.formatMessage({ id: 'comparisons.' + comparison }, { comparison: extra }),
    image: image
  };
};

var getAmphiroComparisonDetails = function getAmphiroComparisonDetails(comparison, members, intl) {
  var member = members.find(function (m) {
    return String(m.index) === comparison;
  });
  return {
    title: intl.formatMessage({ id: 'comparisons.member' }, { comparison: member ? member.name : '' }),
    image: member && member.photo ? '' + BASE64 + member.photo : PNG_IMAGES + '/daiad-consumer.png'
  };
};

var getComparisonDetails = function getComparisonDetails(devType, comparison, start, period, favCommon, members, intl) {
  if (devType === 'METER') {
    return getMeterComparisonDetails(comparison, start, period, favCommon, intl);
  } else if (devType === 'AMPHIRO') {
    return getAmphiroComparisonDetails(comparison, members, intl);
  }
  return '';
};

var getComparisons = function getComparisons(devType, favCommon, memberFilter, members) {
  if (devType === 'METER') {
    return ['last', 'all', 'common', 'nearest', 'similar'].filter(function (c) {
      return favCommon == null ? c !== 'common' : c;
    });
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
  getComparisonDetails: getComparisonDetails,
  getComparisons: getComparisons
};