const ReactGA = require('react-ga');
const moment = require('moment');

const Actions = require('../actions/HistoryActions');

const onExportData = function () {
  ReactGA.event({
    category: 'history',
    action: 'download data',
  });
  return Actions.onExportData();
};


const setSortFilter = function (filter) {
  ReactGA.event({
    category: 'history',
    action: 'set sort filter',
    label: filter.toString(),
  });
  return Actions.setSortFilter(filter);
};

const setSortOrder = function (order) {
  ReactGA.event({
    category: 'history',
    action: 'set sort order',
    label: order
  });
  return Actions.setSortOrder(order);
};

const setQuery = function (query) {
  return function (dispatch, getState) {
    const { active, showerId, device, deviceType, metric, sessionMetric, period, time, increaseShowerIndex: increaseIndex, decreaseShowerIndex: decreaseIndex, comparisons, clearComparisons, data, forecastData, comparisonData, waterIQData, memberFilter, mode } = query;
    if (mode) {
      ReactGA.modalview(mode);
    }
    if (deviceType) {
      ReactGA.event({
        category: 'history',
        action: 'set device type',
        label: deviceType.toString(),
      });
    }
    if (device) {
      ReactGA.event({
        category: 'history',
        action: 'set device',
      });
    }
    if (metric) {
      ReactGA.event({
        category: 'history',
        action: 'set metric filter',
        label: metric.toString(),
      });
    }
    if (sessionMetric) {
      ReactGA.event({
        category: 'history',
        action: 'set session filter',
        label: sessionMetric.toString(),
      });
    }
    if (period) {
      ReactGA.event({
        category: 'history',
        action: 'set time filter',
        label: period.toString(),
      });
    }
    if (time) {
      const timeFilter = period || getState().section.history.timeFilter;
      ReactGA.event({
        category: 'history',
        action: 'time change',
        label: `${timeFilter}: ${moment(time.startDate).format('DD/MM/YYYY')}-${moment(time.endDate).format('DD/MM/YYYY')}`,
      });
    }
    if (increaseIndex === true) {
      ReactGA.event({
        category: 'history',
        action: 'increase shower index',
      });
    }
    if (decreaseIndex === true) {
      ReactGA.event({
        category: 'history',
        action: 'decrease shower index',
      });
    }

    if (memberFilter != null) {
      ReactGA.event({
        category: 'history',
        action: 'member filter',
        label: memberFilter.toString(),
      });
    }

    if (Array.isArray(comparisons)) {
      comparisons.forEach((comparison) => {
        if (getState().section.history.comparisons.find(c => c.id === comparison)) {
          ReactGA.event({
            category: 'history',
            action: 'remove comparison',
            label: comparison.toString(),
          });
        } else if (comparison != null) {
          ReactGA.event({
            category: 'history',
            action: 'add comparison',
            label: comparison.toString(),
          });
        }
      });
    } else if (clearComparisons) {
      ReactGA.event({
        category: 'history',
        action: 'reset comparisons',
      });
    }
    
    if (Array.isArray(active) && active.length === 2 && active[0] != null && active[1] != null) { 
      //dispatch(setActiveSession(Array.isArray(device) ? device[0] : device, showerId)); 
      
      ReactGA.modalview(getState().section.history.activeDeviceType === 'AMPHIRO' ? 'shower' : 'meter-agg');
      ReactGA.event({
        category: 'history',
        action: 'set active session',
      });
    } 
    return dispatch(Actions.setQuery(query));
  };
};

const setQueryAndFetch = function (query) {
  return function (dispatch, getState) {
    dispatch(setQuery(query));
    dispatch(Actions.fetchData());
  };
};

const fetchAndSetQuery = function (query) {
  return function (dispatch, getState) {
    dispatch(Actions.fetchData())
    .then(() => dispatch(setQuery(query)));
  };
};

module.exports = {
  ...Actions,
  onExportData,
  setSortOrder,
  setSortFilter,
  setQuery,
  setQueryAndFetch,
  fetchAndSetQuery,
};
