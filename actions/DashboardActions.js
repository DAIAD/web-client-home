/*
/**
 * Dashboard Actions module.
 * Action creators for Dashboard section
 * 
 * @module DashboardActions
 */

const types = require('../constants/ActionTypes');
const { getTimeByPeriod, getPreviousPeriodSoFar } = require('../utils/time');
const { getDeviceKeysByType } = require('../utils/device');
const { lastNFilterToLength } = require('../utils/general');
const QueryActions = require('./QueryActions');

// TODO: commented out unused action
/*
const setLastSession = function (session) {
  return {
    type: types.DASHBOARD_SET_LAST_SESSION,
    session
  };
};
*/

const createWidget = function (data) {
  return {
    type: types.DASHBOARD_ADD_WIDGET,
    data,
  };
};

const appendLayout = function (id, display, type) {
  let layout = { x: 0, y: 0, w: 1, h: 1, static: false, i: id };
  
  if (display === 'stat' || (display === 'chart' && type === 'budget')) {
    layout = { ...layout, w: 2, minW: 2, minH: 1, maxH: 1 };
  } else if (display === 'chart') {
    layout = { ...layout, w: 2, h: 2, minW: 2, minH: 2 };
  }
  return {
    type: types.DASHBOARD_APPEND_LAYOUT,
    layout,
  };
};

/**
 * Sets dirty mode for dashboard in order to prompt for save 
 * 
 */
const setDirty = function () {
  return {
    type: types.DASHBOARD_SET_DIRTY,
  };
};

/**
 * Resets mode to clean after save or user dismiss 
 * 
 */

const resetDirty = function () {
  return {
    type: types.DASHBOARD_RESET_DIRTY,
  };
};

/**
 * Switches dashboard section mode 
 * @param {String} mode - Mode to switch to - default mode is normal 
 * 
 */
const switchMode = function (mode) {
  return {
    type: types.DASHBOARD_SWITCH_MODE,
    mode,
  };
};

/**
 * Updates layout for react-grid-layout
 * @param {Object} layout - layout object produced by react-grid-layout
 * 
 */
const updateLayout = function (layout, dirty = true) {
  return function (dispatch, getState) {
    if (dirty) {
      dispatch(setDirty());
    }
    dispatch({
      type: types.DASHBOARD_UPDATE_LAYOUT,
      layout,
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
const updateLayoutItem = function (id, display, type) {
  return function (dispatch, getState) {
    if (display == null) return;
    
    const layout = getState().section.dashboard.layout.slice();
    const layoutItemIdx = layout.findIndex(i => i.i === id);
    if (layoutItemIdx === -1) return;
    if (display === 'stat' || (display === 'chart' && type === 'budget')) {
      layout[layoutItemIdx] = { ...layout[layoutItemIdx], w: 2, h: 1 };
    } else if (display === 'chart') {
      layout[layoutItemIdx] = { ...layout[layoutItemIdx], w: 2, h: 2 };
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
const setWidgets = function (widgets) {
  return {
    type: types.DASHBOARD_SET_WIDGETS,
    widgets,
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
const setWidgetData = function (id, data) {
  return {
    type: types.DASHBOARD_UPDATE_WIDGET,
    id,
    data: {
      ...data,
      synced: true,
    },
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
const updateWidget = function (id, data) {
  return function (dispatch, getState) {
    dispatch({
      type: types.DASHBOARD_UPDATE_WIDGET,
      id,
      data: { ...data, synced: false },
    });


    if (Object.keys(data).length > 0) {
      dispatch(updateLayoutItem(id, data.display, data.type));
      dispatch(setDirty()); 
    }
    
    const widget = getState().section.dashboard.widgets.find(i => i.id === id);
    const { type, deviceType, period } = widget;
    const deviceKey = getDeviceKeysByType(getState().user.profile.devices, deviceType);
    
    widget.time = widget.time ? widget.time : getTimeByPeriod(period);

    if (deviceType === 'METER') {
      widget.query = {
        cache: true,
        deviceKey,
        csrf: getState().user.csrf,
      };

      if (type === 'total') {
        widget.prevTime = getPreviousPeriodSoFar(period);
      }
    } else if (deviceType === 'AMPHIRO') {
      widget.query = {
        cache: true,
        type: 'SLIDING',
        length: lastNFilterToLength(period),
        deviceKey,
        csrf: getState().user.csrf, 
      };
    }

    return dispatch(QueryActions.fetchWidgetData(widget))
    .then(res => dispatch(setWidgetData(id, res)))
    .catch((error) => { 
      console.error('Caught error in widget data fetch:', error); 
      dispatch(setWidgetData(id, { data: [], error: 'Oops sth went wrong, please refresh the page.' })); 
    });
  };
};

/**
 * Adds new widget to dashboard with provided data 
 * @param {Object} data - Contains all needed options to be saved to widget state, 
 * no check is performed
 * @return {String} id - The id of the added widget 
 * 
 */
const addWidget = function (options) {
  return function (dispatch, getState) {
    const widgets = getState().section.dashboard.widgets;

    // find last id and increase by one
    const lastId = widgets.length ? Math.max(...widgets.map(widget => parseInt(widget.id, NaN))) : 0;
    if (isNaN(lastId)) {
      throw new Error('last id NaN');
    }
    const id = (lastId + 1).toString();
    const display = options.display;
    const type = options.type;

    dispatch(createWidget({ ...options, id }));
    dispatch(appendLayout(id, display, type));

    dispatch(setDirty()); 
    dispatch(updateWidget(id, {}));
    return id;
  };
};
    
/**
 * Removes an existing widget from state
 * 
 * @param {String} id - The id of the widget to remove 
 * 
 */
const removeWidget = function (id) {
  return function (dispatch, getState) {
    dispatch(setDirty());
    dispatch({
      type: types.DASHBOARD_REMOVE_WIDGET,
      id,
    });
  };
};

/**
 * Fetch data for all widgets in state 
 * 
 */
const fetchAllWidgetsData = function () {
  return function (dispatch, getState) {
  /*
   * sequential execution to take advantage of cache
   */
    return getState().section.dashboard.widgets
    .map(widget => updateWidget(widget.id, {}))
    .reduce((prev, curr) => prev.then(() => dispatch(curr)), Promise.resolve());
  };
};

const setWidgetToAdd = function (data) {
  return {
    type: types.DASHBOARD_SET_WIDGET_TEMP,
    data,
  };
};

const resetWidgetToAdd = function () {
  return {
    type: types.DASHBOARD_RESET_WIDGET_TEMP,
  };
};

module.exports = {
  resetDirty,
  setDirty,
  switchMode,
  addWidget,
  updateWidget,
  setWidgetData,
  setWidgets,
  updateLayoutItem,
  updateLayout,
  removeWidget,
  fetchAllWidgetsData,
  setWidgetToAdd,
  resetWidgetToAdd,
};

