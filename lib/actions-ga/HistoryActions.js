'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var ReactGA = require('react-ga');
var moment = require('moment');

var Actions = require('../actions/HistoryActions');

var onExportData = function onExportData() {
  ReactGA.event({
    category: 'history',
    action: 'download data'
  });
  return Actions.onExportData();
};

var setSortFilter = function setSortFilter(filter) {
  ReactGA.event({
    category: 'history',
    action: 'set sort filter',
    label: filter.toString()
  });
  return Actions.setSortFilter(filter);
};

var setSortOrder = function setSortOrder(order) {
  ReactGA.event({
    category: 'history',
    action: 'set sort order',
    label: order
  });
  return Actions.setSortOrder(order);
};

var setQuery = function setQuery(query) {
  return function (dispatch, getState) {
    var active = query.active,
        showerId = query.showerId,
        device = query.device,
        deviceType = query.deviceType,
        metric = query.metric,
        sessionMetric = query.sessionMetric,
        period = query.period,
        time = query.time,
        increaseIndex = query.increaseShowerIndex,
        decreaseIndex = query.decreaseShowerIndex,
        comparisons = query.comparisons,
        clearComparisons = query.clearComparisons,
        data = query.data,
        forecastData = query.forecastData,
        comparisonData = query.comparisonData,
        waterIQData = query.waterIQData,
        memberFilter = query.memberFilter,
        mode = query.mode;

    if (mode) {
      ReactGA.modalview(mode);
    }
    if (deviceType) {
      ReactGA.event({
        category: 'history',
        action: 'set device type',
        label: deviceType.toString()
      });
    }
    if (device) {
      ReactGA.event({
        category: 'history',
        action: 'set device'
      });
    }
    if (metric) {
      ReactGA.event({
        category: 'history',
        action: 'set metric filter',
        label: metric.toString()
      });
    }
    if (sessionMetric) {
      ReactGA.event({
        category: 'history',
        action: 'set session filter',
        label: sessionMetric.toString()
      });
    }
    if (period) {
      ReactGA.event({
        category: 'history',
        action: 'set time filter',
        label: period.toString()
      });
    }
    if (time) {
      var timeFilter = period || getState().section.history.timeFilter;
      ReactGA.event({
        category: 'history',
        action: 'time change',
        label: timeFilter + ': ' + moment(time.startDate).format('DD/MM/YYYY') + '-' + moment(time.endDate).format('DD/MM/YYYY')
      });
    }
    if (increaseIndex === true) {
      ReactGA.event({
        category: 'history',
        action: 'increase shower index'
      });
    }
    if (decreaseIndex === true) {
      ReactGA.event({
        category: 'history',
        action: 'decrease shower index'
      });
    }

    if (memberFilter != null) {
      ReactGA.event({
        category: 'history',
        action: 'member filter',
        label: memberFilter.toString()
      });
    }

    if (Array.isArray(comparisons)) {
      comparisons.forEach(function (comparison) {
        if (getState().section.history.comparisons.find(function (c) {
          return c.id === comparison;
        })) {
          ReactGA.event({
            category: 'history',
            action: 'remove comparison',
            label: comparison.toString()
          });
        } else if (comparison != null) {
          ReactGA.event({
            category: 'history',
            action: 'add comparison',
            label: comparison.toString()
          });
        }
      });
    } else if (clearComparisons) {
      ReactGA.event({
        category: 'history',
        action: 'reset comparisons'
      });
    }

    if (Array.isArray(active) && active.length === 2 && active[0] != null && active[1] != null) {
      //dispatch(setActiveSession(Array.isArray(device) ? device[0] : device, showerId)); 

      ReactGA.modalview(getState().section.history.activeDeviceType === 'AMPHIRO' ? 'shower' : 'meter-agg');
      ReactGA.event({
        category: 'history',
        action: 'set active session'
      });
    }
    return dispatch(Actions.setQuery(query));
  };
};

var setQueryAndFetch = function setQueryAndFetch(query) {
  return function (dispatch, getState) {
    dispatch(setQuery(query));
    dispatch(Actions.fetchData());
  };
};

var fetchAndSetQuery = function fetchAndSetQuery(query) {
  return function (dispatch, getState) {
    dispatch(Actions.fetchData()).then(function () {
      return dispatch(setQuery(query));
    });
  };
};

module.exports = _extends({}, Actions, {
  onExportData: onExportData,
  setSortOrder: setSortOrder,
  setSortFilter: setSortFilter,
  setQuery: setQuery,
  setQueryAndFetch: setQueryAndFetch,
  fetchAndSetQuery: fetchAndSetQuery
});