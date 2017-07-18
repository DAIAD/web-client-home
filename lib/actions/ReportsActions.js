'use strict';

/**
 * History Actions module.
 * Action creators for History section
 * 
 * @module HistoryActions
 */

var types = require('../constants/ActionTypes');

var _require = require('react-router-redux'),
    push = _require.push;

var QueryActions = require('./QueryActions');

var reportsAPI = require('../api/reports');

var _require2 = require('../utils/general'),
    throwServerError = _require2.throwServerError;

var _require3 = require('../constants/HomeConstants'),
    PERIODS = _require3.PERIODS;

/**
 * Sets time/period filter for history section. 
 *
 * @param {String} filter - time/period filter 
 */


var setTimeFilter = function setTimeFilter(filter) {
  return {
    type: types.REPORTS_SET_TIME_FILTER,
    filter: filter
  };
};

var onDownloadReport = function onDownloadReport(month) {
  return {
    type: types.REPORTS_DOWNLOAD,
    month: month
  };
};

/**
 * Sets active time window in history section
 *
 * @param {Object} time - Active time window
 * @param {Number} time.startDate - Start timestamp 
 * @param {Number} time.endDate - End timestamp
 * @param {Number} time.granularity - Granularity for data aggregation. 
 * One of 0: minute, 1: hour, 2: day, 3: week, 4: month
 * @param {Bool} query=true - If true performs query based on active filters to update data
 */

var setTime = function setTime(time) {
  return {
    type: types.REPORTS_SET_TIME,
    time: time
  };
};

var setReports = function setReports(reports) {
  return {
    type: types.REPORTS_SET,
    reports: reports
  };
};

var getReportsStatus = function getReportsStatus() {
  return function (dispatch, getState) {
    var time = getState().section.reports.time;


    var data = {
      year: new Date(time.startDate).getFullYear(),
      csrf: getState().user.csrf
    };

    dispatch(QueryActions.requestedQuery());
    return reportsAPI.status(data).then(function (response) {
      dispatch(QueryActions.receivedQuery());

      if (!response || !response.success) {
        throwServerError(response);
      }

      return response.reports;
    }).then(function (reports) {
      return dispatch(setReports(reports));
    }).catch(function (error) {
      dispatch(QueryActions.setError(error));
      console.error('caught error on get reports status', error);
    });
  };
};

var setQuery = function setQuery(query) {
  return function (dispatch, getState) {
    var time = query.time,
        timeFilter = query.timeFilter;


    if (time) dispatch(setTime(time));
    if (timeFilter) dispatch(setTimeFilter(timeFilter));
  };
};

var setQueryAndFetch = function setQueryAndFetch(query) {
  return function (dispatch, getState) {
    dispatch(setQuery(query));
    dispatch(getReportsStatus());
  };
};

module.exports = {
  setTime: setTime,
  setTimeFilter: setTimeFilter,
  setQueryAndFetch: setQueryAndFetch,
  getReportsStatus: getReportsStatus,
  onDownloadReport: onDownloadReport
};