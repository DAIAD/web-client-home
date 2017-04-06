'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/*
/**
 * Dashboard Actions module.
 * Action creators for Dashboard section
 * 
 * @module DashboardActions
 */

var types = require('../constants/ActionTypes');

var _require = require('../utils/time'),
    getTimeByPeriod = _require.getTimeByPeriod,
    getPreviousPeriodSoFar = _require.getPreviousPeriodSoFar;

var _require2 = require('../utils/device'),
    getDeviceKeysByType = _require2.getDeviceKeysByType;

var QueryActions = require('./QueryActions');

// TODO: commented out unused action
/*
const setLastSession = function (session) {
  return {
    type: types.DASHBOARD_SET_LAST_SESSION,
    session
  };
};
*/

var createWidget = function createWidget(data) {
  return {
    type: types.DASHBOARD_ADD_WIDGET,
    data: data
  };
};

var appendLayout = function appendLayout(id, display, type) {
  var layout = { x: 0, y: 0, w: 1, h: 1, static: false, i: id };

  if (display === 'stat') {
    layout = _extends({}, layout, { w: 2, minW: 2, minH: 1, maxH: 1 });
  } else if (display === 'chart' || display === 'hybrid') {
    layout = _extends({}, layout, { w: 2, h: 2, minW: 2, minH: 2 });
  }
  return {
    type: types.DASHBOARD_APPEND_LAYOUT,
    layout: layout
  };
};

/**
 * Sets dirty mode for dashboard in order to prompt for save 
 * 
 */
var setDirty = function setDirty() {
  return {
    type: types.DASHBOARD_SET_DIRTY
  };
};

/**
 * Resets mode to clean after save or user dismiss 
 * 
 */

var resetDirty = function resetDirty() {
  return {
    type: types.DASHBOARD_RESET_DIRTY
  };
};

/**
 * Switches dashboard section mode 
 * @param {String} mode - Mode to switch to - default mode is normal 
 * 
 */
var switchMode = function switchMode(mode) {
  return {
    type: types.DASHBOARD_SWITCH_MODE,
    mode: mode
  };
};

/**
 * Updates layout for react-grid-layout
 * @param {Object} layout - layout object produced by react-grid-layout
 * 
 */
var updateLayout = function updateLayout(layout) {
  var dirty = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  return function (dispatch, getState) {
    if (dirty) {
      dispatch(setDirty());
    }
    dispatch({
      type: types.DASHBOARD_UPDATE_LAYOUT,
      layout: layout
    });
  };
};

/**
 * Updates layout item dimensions based on display
 * 
 * @param {String} id - The id of the widget appearence to update
 * @param {String} display - One of stat, display
 * 
 */
var updateLayoutItem = function updateLayoutItem(id, display, type) {
  return function (dispatch, getState) {
    if (display == null) return;

    var layout = getState().section.dashboard.layout.slice();
    var layoutItemIdx = layout.findIndex(function (i) {
      return i.i === id;
    });
    if (layoutItemIdx === -1) return;
    if (display === 'stat' || display === 'chart' && type === 'budget') {
      layout[layoutItemIdx] = _extends({}, layout[layoutItemIdx], { w: 2, h: 1 });
    } else if (display === 'chart') {
      layout[layoutItemIdx] = _extends({}, layout[layoutItemIdx], { w: 2, h: 2 });
    }
    dispatch(updateLayout(layout));
  };
};

/**
 * Sets widgets 
 * 
 * @param {Object[]} widgets - array of objects containing widget options as specified 
 *  in {@link fetchWidgetData}.  
 */
var setWidgets = function setWidgets(widgets) {
  return {
    type: types.DASHBOARD_SET_WIDGETS,
    widgets: widgets
  };
};

/**
 * Updates an existing widget with data.
 * Important: This action only sets the data returned by asynchronous fetch action and 
 * does not trigger data fetch
 * 
 * @param {String} id - The id of the widget to update 
 * @param {Object} data - Contains data options to be saved to widget state
 * 
 */
var setWidgetData = function setWidgetData(id, update) {
  return {
    type: types.DASHBOARD_UPDATE_WIDGET,
    id: id,
    update: _extends({}, update, {
      synced: true
    })
  };
};

var setWidgetTypeUnsynced = function setWidgetTypeUnsynced(widgetType) {
  return {
    type: types.DASHBOARD_SET_WIDGET_TYPE_UNSYNCED,
    widgetType: widgetType
  };
};

/**
 * Updates an existing widget with provided options.
 * Important: This action triggers data fetch 
 * 
 * @param {String} id - The id of the widget to update 
 * @param {Object} update - Contains update options to be saved to widget state 
 * (previous options are overriden), no check is performed
 * 
 */
var updateWidget = function updateWidget(id, update) {
  return {
    type: types.DASHBOARD_UPDATE_WIDGET,
    id: id,
    update: update
  };
};

var fetchWidgetData = function fetchWidgetData(id) {
  return function (dispatch, getState) {
    var widget = getState().section.dashboard.widgets.find(function (i) {
      return i.id === id;
    });

    var userKey = getState().user.profile.key;
    var members = getState().user.profile.household.members;
    var brackets = getState().section.history.priceBrackets;
    var breakdown = getState().section.history.waterBreakdown;

    return dispatch(QueryActions.fetchWidgetData(_extends({}, widget, {
      userKey: userKey,
      members: members,
      brackets: brackets,
      breakdown: breakdown
    }))).then(function (res) {
      return dispatch(setWidgetData(id, res));
    }).catch(function (error) {
      console.error('Caught error in widget data fetch:', error);
      dispatch(setWidgetData(id, { data: [], error: 'Oops sth went wrong, please refresh the page.' }));
    });
  };
};

var updateWidgetAndFetch = function updateWidgetAndFetch(id, update) {
  return function (dispatch, getState) {
    dispatch(setDirty());
    dispatch(updateWidget(id, update));
    return dispatch(fetchWidgetData(id));
  };
};

/**
 * Adds new widget to dashboard with provided data 
 * @param {Object} data - Contains all needed options to be saved to widget state, 
 * no check is performed
 * @return {String} id - The id of the added widget 
 * 
 */
var addWidget = function addWidget(options) {
  return function (dispatch, getState) {
    var widgets = getState().section.dashboard.widgets;

    // find last id and increase by one
    var lastId = widgets.length ? Math.max.apply(Math, _toConsumableArray(widgets.map(function (widget) {
      return parseInt(widget.id, NaN);
    }))) : 0;
    if (isNaN(lastId)) {
      console.error('last id NaN');
      return dispatch(QueryActions.setError(new Error('unknownError')));
    }
    var id = (lastId + 1).toString();
    var display = options.display,
        type = options.type;


    var newWidget = _extends({
      data: []
    }, options, getState().forms.widgetToAdd, {
      id: id
    });

    dispatch(setDirty());
    dispatch(createWidget(newWidget));
    dispatch(appendLayout(id, display, type));

    dispatch(fetchWidgetData(id));
    return id;
  };
};

/**
 * Removes an existing widget from state
 * 
 * @param {String} id - The id of the widget to remove 
 * 
 */
var removeWidget = function removeWidget(id) {
  return function (dispatch, getState) {
    dispatch(setDirty());
    dispatch({
      type: types.DASHBOARD_REMOVE_WIDGET,
      id: id
    });
  };
};

/**
 * Fetch data for all widgets in state 
 * 
 */
var fetchAllWidgetsData = function fetchAllWidgetsData() {
  return function (dispatch, getState) {
    /*
     * sequential execution to take advantage of cache
     */
    return getState().section.dashboard.widgets.map(function (widget) {
      return fetchWidgetData(widget.id);
    }).reduce(function (prev, curr) {
      return prev.then(function () {
        return dispatch(curr);
      });
    }, Promise.resolve());
  };
};

var setDeviceType = function setDeviceType(deviceType) {
  return {
    type: types.DASHBOARD_SET_WIDGET_DEVICE_TYPE,
    deviceType: deviceType
  };
};

module.exports = {
  resetDirty: resetDirty,
  setDirty: setDirty,
  switchMode: switchMode,
  addWidget: addWidget,
  updateWidget: updateWidget,
  fetchWidgetData: fetchWidgetData,
  updateWidgetAndFetch: updateWidgetAndFetch,
  setWidgetData: setWidgetData,
  setWidgets: setWidgets,
  updateLayoutItem: updateLayoutItem,
  updateLayout: updateLayout,
  removeWidget: removeWidget,
  fetchAllWidgetsData: fetchAllWidgetsData,
  setDeviceType: setDeviceType,
  setWidgetTypeUnsynced: setWidgetTypeUnsynced
};