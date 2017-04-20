'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _require = require('redux'),
    bindActionCreators = _require.bindActionCreators;

var _require2 = require('react-redux'),
    connect = _require2.connect;

var _require3 = require('react-intl'),
    injectIntl = _require3.injectIntl;

var HistoryActions = require('../actions/HistoryActions');

var History = require('../components/sections/history/');

var _require4 = require('../utils/device'),
    getAvailableDevices = _require4.getAvailableDevices,
    getAvailableDeviceTypes = _require4.getAvailableDeviceTypes;

var _require5 = require('../utils/sessions'),
    prepareSessionsForTable = _require5.prepareSessionsForTable,
    reduceMetric = _require5.reduceMetric,
    sortSessions = _require5.sortSessions,
    meterSessionsToCSV = _require5.meterSessionsToCSV,
    deviceSessionsToCSV = _require5.deviceSessionsToCSV,
    _hasShowersBefore = _require5.hasShowersBefore,
    _hasShowersAfter = _require5.hasShowersAfter,
    prepareBreakdownSessions = _require5.prepareBreakdownSessions;

var _require6 = require('../utils/comparisons'),
    getComparisons = _require6.getComparisons,
    getComparisonTitle = _require6.getComparisonTitle;

var timeUtil = require('../utils/time');

var _require7 = require('../utils/general'),
    getMetricMu = _require7.getMetricMu,
    formatMessage = _require7.formatMessage,
    getAllMembers = _require7.getAllMembers,
    tableToCSV = _require7.tableToCSV;

var _require8 = require('../utils/history'),
    getHistoryData = _require8.getHistoryData;

var _require9 = require('../constants/HomeConstants'),
    FILTER_METRICS = _require9.FILTER_METRICS,
    PERIODS = _require9.PERIODS,
    SORT = _require9.SORT,
    MODES = _require9.MODES;

function mapStateToProps(state) {
  return _extends({
    user: state.user.profile,
    devices: state.user.profile.devices,
    myCommons: state.section.commons.myCommons,
    favoriteCommon: state.section.settings.commons.favorite,
    members: state.user.profile.household.members
  }, state.section.history);
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(HistoryActions, dispatch);
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  var _t = formatMessage(ownProps.intl);
  var amphiros = getAvailableDevices(stateProps.devices);

  var devType = stateProps.activeDeviceType;
  var members = getAllMembers(stateProps.members);
  var favoriteCommonName = stateProps.favoriteCommon ? stateProps.myCommons.find(function (c) {
    return c.key === stateProps.favoriteCommon;
  }).name : '';

  var deviceTypes = getAvailableDeviceTypes(stateProps.devices);

  var memberFilters = devType === 'AMPHIRO' ? [{
    id: 'all',
    title: _t('history.member-filter')
  }].concat(_toConsumableArray(members.map(function (member) {
    return {
      id: member.index,
      title: member.name,
      image: member.photo
    };
  }))) : [];

  var availableComparisons = getComparisons(devType, stateProps.memberFilter, members).map(function (c) {
    return {
      id: c,
      title: getComparisonTitle(stateProps.activeDeviceType, c, stateProps.time.startDate, stateProps.timeFilter, favoriteCommonName, members, ownProps.intl)
    };
  });

  var modes = MODES[devType];
  var metrics = FILTER_METRICS[devType];
  var activeMode = modes.find(function (m) {
    return m.id === stateProps.mode;
  });

  var allOptions = {
    periods: PERIODS[devType],
    comparisons: availableComparisons,
    sort: SORT[devType]
  };

  var _map = ['periods', 'comparisons', 'sort'].map(function (x) {
    return activeMode && activeMode[x] ? allOptions[x].filter(function (y) {
      return activeMode[x].includes(y.id);
    }) : allOptions[x];
  }),
      _map2 = _slicedToArray(_map, 3),
      periods = _map2[0],
      compareAgainst = _map2[1],
      sortOptions = _map2[2];

  var _getHistoryData = getHistoryData(_extends({}, stateProps, ownProps, { _t: _t, members: members, favoriteCommonName: favoriteCommonName })),
      sessions = _getHistoryData.sessions,
      sessionFields = _getHistoryData.sessionFields,
      reducedMetric = _getHistoryData.reducedMetric,
      highlight = _getHistoryData.highlight,
      chartType = _getHistoryData.chartType,
      chartData = _getHistoryData.chartData,
      chartCategories = _getHistoryData.chartCategories,
      chartFormatter = _getHistoryData.chartFormatter,
      chartColors = _getHistoryData.chartColors,
      chartYMax = _getHistoryData.chartYMax,
      mu = _getHistoryData.mu;

  var csvData = tableToCSV(sessionFields, sessions);
  return _extends({}, stateProps, dispatchProps, ownProps, {
    nextPeriod: stateProps.time ? timeUtil.getNextPeriod(stateProps.timeFilter, stateProps.time.startDate) : {},
    previousPeriod: stateProps.time ? timeUtil.getPreviousPeriod(stateProps.timeFilter, stateProps.time.endDate) : {},
    amphiros: amphiros,
    periods: periods,
    modes: modes,
    metrics: metrics,
    compareAgainst: compareAgainst,
    memberFilters: memberFilters,
    sortOptions: sortOptions,
    hasShowersAfter: function hasShowersAfter() {
      return _hasShowersAfter(stateProps.showerIndex);
    },
    hasShowersBefore: function hasShowersBefore() {
      return _hasShowersBefore(stateProps.data);
    },
    onSessionClick: function onSessionClick(session) {
      return dispatchProps.setActiveSession(session.device, session.id, session.timestamp);
    },
    _t: _t,
    sessions: sessions,
    //sessionFields: stateProps.mode === 'breakdown' ? breakdownSessionSchema : sessionFields,
    sessionFields: sessionFields,
    deviceTypes: deviceTypes,
    csvData: csvData,
    reducedMetric: highlight,
    mu: mu,
    isAfterToday: stateProps.time.endDate > new Date().valueOf(),
    chart: {
      //chart width = viewport width - main menu - sidebar left - sidebar right - padding
      width: Math.max(stateProps.width - 130 - 160 - 160 - 20, 550),
      chartType: chartType,
      chartData: chartData,
      chartCategories: chartCategories,
      chartColors: chartColors,
      chartFormatter: chartFormatter,
      chartYMax: chartYMax,
      onPointClick: function onPointClick(series, index) {
        var device = chartData[series] ? chartData[series].metadata.device : null;

        var _ref = chartData[series] && chartData[series].metadata.ids ? chartData[series].metadata.ids[index] : [null, null],
            _ref2 = _slicedToArray(_ref, 2),
            id = _ref2[0],
            timestamp = _ref2[1];

        dispatchProps.setActiveSession(device, id, timestamp);
      }
    }
  });
}

var HistoryData = injectIntl(connect(mapStateToProps, mapDispatchToProps, mergeProps)(History));
module.exports = HistoryData;