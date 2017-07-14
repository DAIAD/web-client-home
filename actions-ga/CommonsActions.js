const ReactGA = require('react-ga');
const moment = require('moment');

const Actions = require('../actions/CommonsActions');

const setMemberQueryAndFetch = function (query) {
  const { name, index, sortBy, sortOrder } = query;
  
  if (name != null) {
    ReactGA.event({
      category: 'commons',
      action: 'set member search filter',
      label: name.toString(),
    });
  }
  
  if (index != null) {
    ReactGA.event({
      category: 'commons',
      action: 'set member page',
      label: index.toString(),
    });
  }
  
  if (sortBy != null) {
    ReactGA.event({
      category: 'commons',
      action: 'set member sort filter',
      label: sortBy.toString(),
    });
  }

  if (sortOrder != null) {
    ReactGA.event({
      category: 'commons',
      action: 'set member sort order',
      label: sortOrder.toString(),
    });
  }

  return Actions.setMemberQueryAndFetch(query); 
};


const setQuery = function (query) {
  return function (dispatch, getState) {
    const { period, time, deviceType, active, members } = query;
    
    if (period != null) {
      ReactGA.event({
        category: 'commons',
        action: 'set time filter',
        label: period,
      });
    }
    if (time != null) {
      const timeFilter = period || getState().section.commons.timeFilter;
      
      ReactGA.event({
        category: 'commons',
        action: 'time change',
        label: `${timeFilter}: ${moment(time.startDate).format('DD/MM/YYYY')}-${moment(time.endDate).format('DD/MM/YYYY')}`,
      });
    }
    if (deviceType != null) {
      ReactGA.event({
        category: 'commons',
        action: 'set device type',
        label: deviceType,
      });
    }
    if (active != null) {
      ReactGA.event({
        category: 'commons',
        action: 'set active common',
      });
    }

    return dispatch(Actions.setQuery(query));
  };
};

const setDataQueryAndFetch = function (query) {
  return function (dispatch, getState) {
    dispatch(setQuery(query));
    dispatch(Actions.fetchData());
  };
};


const addMemberToChart = function (member) {
  ReactGA.event({
    category: 'commons',
    action: 'added member to chart',
    label: member.name
  });
  return Actions.addMemberToChart(member);
};

const removeMemberFromChart = function (member) {
  ReactGA.event({
    category: 'commons',
    action: 'removed member from chart',
    label: member.name
  });

 return Actions.removeMemberFromChart(member); 
};

module.exports = {
  ...Actions,
  setMemberQueryAndFetch,
  setQuery,
  setDataQueryAndFetch,
  addMemberToChart,
  removeMemberFromChart,
};
