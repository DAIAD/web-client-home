/**
 * History Actions module.
 * Action creators for History section
 * 
 * @module HistoryActions
 */

const types = require('../constants/ActionTypes');
const { push } = require('react-router-redux');

const QueryActions = require('./QueryActions');

const reportsAPI = require('../api/reports');
const { throwServerError } = require('../utils/general');

const { PERIODS } = require('../constants/HomeConstants');

/**
 * Sets time/period filter for history section. 
 *
 * @param {String} filter - time/period filter 
 */
const setTimeFilter = function (filter) {
  return {
    type: types.REPORTS_SET_TIME_FILTER,
    filter,
  };
};

const onDownloadReport = function (month) {
  return {
    type: types.REPORTS_DOWNLOAD,
    month,
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

const setTime = function (time) {
  return {
    type: types.REPORTS_SET_TIME,
    time,
  };
};

const setReports = function (reports) {
  return {
    type: types.REPORTS_SET,
    reports,
  };
};

const getReportsStatus = function () {
  return function (dispatch, getState) {
    const { time } = getState().section.reports;
    
    const data = {
      year: new Date(time.startDate).getFullYear(),
      csrf: getState().user.csrf,
    };
    
    dispatch(QueryActions.requestedQuery());
    return reportsAPI.status(data)
    .then((response) => {
      dispatch(QueryActions.receivedQuery());

      if (!response || !response.success) {
        throwServerError(response);  
      }

      return response.reports;
    })
    .then(reports => dispatch(setReports(reports)))
    .catch((error) => {
      dispatch(QueryActions.setError(error));
      console.error('caught error on get reports status', error);
    });
  };
};

const setQuery = function (query) {
  return function (dispatch, getState) {
    const { time, timeFilter } = query;

    if (time) dispatch(setTime(time));
    if (timeFilter) dispatch(setTimeFilter(timeFilter));
  };
};

const setQueryAndFetch = function (query) {
  return function (dispatch, getState) {
    dispatch(setQuery(query));
    dispatch(getReportsStatus());
  };
};

module.exports = {
  setTime,
  setTimeFilter,
  setQueryAndFetch,
  getReportsStatus,
  onDownloadReport,
};
