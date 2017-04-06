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

var _require2 = require('../constants/HomeConstants'),
    PERIODS = _require2.PERIODS;

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

module.exports = {
  setTime: setTime,
  setTimeFilter: setTimeFilter
};