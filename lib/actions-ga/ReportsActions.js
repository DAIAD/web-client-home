'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var ReactGA = require('react-ga');

var Actions = require('../actions/ReportsActions');

var onDownloadReport = function onDownloadReport(month) {
  ReactGA.event({
    category: 'reports',
    action: 'download report',
    label: month.toString()
  });
  return Actions.onDownloadReport(month);
};

var setTime = function setTime(time) {
  ReactGA.event({
    category: 'reports',
    action: 'change-time',
    label: time.startDate + '-' + time.endDate
  });
  return Actions.setTime(time);
};

module.exports = _extends({}, Actions, {
  setTime: setTime,
  onDownloadReport: onDownloadReport
});