/**
 * History Actions module.
 * Action creators for History section
 * 
 * @module HistoryActions
 */

const types = require('../constants/ActionTypes');
const { push } = require('react-router-redux');

const QueryActions = require('./QueryActions');

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

module.exports = {
  setTime,
  setTimeFilter,
};
