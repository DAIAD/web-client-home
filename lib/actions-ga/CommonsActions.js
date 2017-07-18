'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var ReactGA = require('react-ga');
var moment = require('moment');

var Actions = require('../actions/CommonsActions');

var setMemberQueryAndFetch = function setMemberQueryAndFetch(query) {
  var name = query.name,
      index = query.index,
      sortBy = query.sortBy,
      sortOrder = query.sortOrder;


  if (name != null) {
    ReactGA.event({
      category: 'commons',
      action: 'set member search filter',
      label: name.toString()
    });
  }

  if (index != null) {
    ReactGA.event({
      category: 'commons',
      action: 'set member page',
      label: index.toString()
    });
  }

  if (sortBy != null) {
    ReactGA.event({
      category: 'commons',
      action: 'set member sort filter',
      label: sortBy.toString()
    });
  }

  if (sortOrder != null) {
    ReactGA.event({
      category: 'commons',
      action: 'set member sort order',
      label: sortOrder.toString()
    });
  }

  return Actions.setMemberQueryAndFetch(query);
};

var setQuery = function setQuery(query) {
  return function (dispatch, getState) {
    var period = query.period,
        time = query.time,
        deviceType = query.deviceType,
        active = query.active,
        members = query.members;


    if (period != null) {
      ReactGA.event({
        category: 'commons',
        action: 'set time filter',
        label: period
      });
    }
    if (time != null) {
      var timeFilter = period || getState().section.commons.timeFilter;

      ReactGA.event({
        category: 'commons',
        action: 'time change',
        label: timeFilter + ': ' + moment(time.startDate).format('DD/MM/YYYY') + '-' + moment(time.endDate).format('DD/MM/YYYY')
      });
    }
    if (deviceType != null) {
      ReactGA.event({
        category: 'commons',
        action: 'set device type',
        label: deviceType
      });
    }
    if (active != null) {
      ReactGA.event({
        category: 'commons',
        action: 'set active common'
      });
    }

    return dispatch(Actions.setQuery(query));
  };
};

var setDataQueryAndFetch = function setDataQueryAndFetch(query) {
  return function (dispatch, getState) {
    dispatch(setQuery(query));
    dispatch(Actions.fetchData());
  };
};

var addMemberToChart = function addMemberToChart(member) {
  ReactGA.event({
    category: 'commons',
    action: 'added member to chart',
    label: member.name
  });
  return Actions.addMemberToChart(member);
};

var removeMemberFromChart = function removeMemberFromChart(member) {
  ReactGA.event({
    category: 'commons',
    action: 'removed member from chart',
    label: member.name
  });

  return Actions.removeMemberFromChart(member);
};

module.exports = _extends({}, Actions, {
  setMemberQueryAndFetch: setMemberQueryAndFetch,
  setQuery: setQuery,
  setDataQueryAndFetch: setDataQueryAndFetch,
  addMemberToChart: addMemberToChart,
  removeMemberFromChart: removeMemberFromChart
});