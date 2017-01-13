const React = require('react');
const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');
const { injectIntl } = require('react-intl');
const { push } = require('react-router-redux');

const Commons = require('../components/sections/Commons');
//const { commons: commonsSchema, allCommons: allCommonsSchema, members: membersSchema } = require('../../schemas/commons');
const CommonsActions = require('../actions/CommonsActions');
const { queryMeterHistoryCache } = require('../actions/QueryActions');
const timeUtil = require('../utils/time');
const { getDeviceKeysByType } = require('../utils/device');

const { getDataSessions, sortSessions } = require('../utils/transformations');
const { getChartMeterData, getChartMeterCategories, getChartMeterCategoryLabels } = require('../utils/chart');
const { COMMONS_USER_SORT } = require('../constants/HomeConstants');

function prepareData(devices, time, filter, data) {
  return data.map((devData) => {
    const sessions = getDataSessions(devices, devData)
    .map(session => ({
      ...session,
      duration: Math.round(100 * (session.duration / 60)) / 100,
      energy: Math.round(session.energy / 10) / 100,
    }));

    const xCategories = getChartMeterCategories(time);
    const xData = getChartMeterData(sessions, xCategories, time);

    return ({
      name: 'Me', 
      data: xData.map(x => x ? x[filter] : null),
    });
  });
}

function generateComparisonData(name, devices, time, filter, data) {
  return data.map((devData) => {
    const sessions = getDataSessions(devices, devData)
    .map(session => ({
      ...session,
      difference: session.difference * Math.round(Math.random() * 2)
    }));
  
    const xCategories = getChartMeterCategories(time);
    const xData = getChartMeterData(sessions, xCategories, time);

    return ({
      name,
      data: xData.map(x => x ? x[filter] : null),
    });
  });
}

function prepareCategories(time, intl) {
  const xCategories = getChartMeterCategories(time);
  return getChartMeterCategoryLabels(xCategories, time, intl);
}

function matches(str1, str2) {
  return str1.toLowerCase().indexOf(str2.toLowerCase()) !== -1;
}

function mapStateToProps(state) {
  return {
    activeId: state.section.commons.active,
    activeDeviceType: state.section.commons.activeDeviceType,
    filter: state.section.commons.filter,
    time: state.section.commons.time,
    timeFilter: state.section.commons.timeFilter,
    sortFilter: state.section.commons.sortFilter,
    sortOrder: state.section.commons.sortOrder,
    data: state.section.commons.data,
    allCommons: state.section.commons.allCommons,
    myCommons: state.section.commons.myCommons,
    favorite: state.section.commons.favorite,
    selectedMembers: state.section.commons.selectedMembers,
    searchFilter: state.section.commons.searchFilter,
    memberSearchFilter: state.section.commons.memberSearchFilter,
    confirmation: state.section.commons.confirm,
    devices: state.user.profile.devices,
  };
}

function mapDispatchToProps(dispatch) {
  return { 
    actions: bindActionCreators({ 
      ...CommonsActions,
      queryMeterHistoryCache,
      goToManage: () => push('/settings/commons'),
    }, dispatch) 
  };
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  //const devices = getDeviceKeysByType(stateProps.devices, stateProps.activeDeviceType); 

  const active = stateProps.myCommons.find(common => common.id === stateProps.activeId);
  const usersData = stateProps.selectedMembers
  .map(user => generateComparisonData(user.name, stateProps.devices, stateProps.time, stateProps.filter, stateProps.data))
  .reduce((p, c) => [...p, ...c], []);

  const chartData = [
    ...prepareData(stateProps.devices, stateProps.time, stateProps.filter, stateProps.data),
    ...(active ? generateComparisonData(active.name, stateProps.devices, stateProps.time, stateProps.filter, stateProps.data) : {}),
    ...usersData,
  ];

  const members = active ? active.members : [];
  const chartCategories = prepareCategories(stateProps.time, ownProps.intl);
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    commons: stateProps.myCommons,
    active: active ? ({
      ...active,
      members: sortSessions(
        stateProps.memberSearchFilter !== '' ? 
          members.filter(m => matches(m.name, stateProps.memberSearchFilter)) 
          : members,
          stateProps.sortFilter, 
          stateProps.sortOrder
      ),
    }) : null,
    previousPeriod: timeUtil.getPreviousPeriod(stateProps.timeFilter, stateProps.time.endDate),
    nextPeriod: timeUtil.getNextPeriod(stateProps.timeFilter, stateProps.time.endDate),
    chartData,
    chartCategories,
    sortOptions: COMMONS_USER_SORT,
  };
}

const CommonsData = connect(mapStateToProps, mapDispatchToProps, mergeProps)(Commons);
module.exports = injectIntl(CommonsData);
