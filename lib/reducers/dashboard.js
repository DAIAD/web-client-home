'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var types = require('../constants/ActionTypes');

var initialState = {
  mode: 'normal',
  dirty: false,
  layout: [],
  widgetDeviceType: 'METER',
  widgets: []
};

var dashboard = function dashboard() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  switch (action.type) {
    case types.DASHBOARD_SWITCH_MODE:
      return Object.assign({}, state, {
        mode: action.mode
      });

    case types.DASHBOARD_SET_WIDGETS:
      {
        return Object.assign({}, state, {
          widgets: action.widgets
        });
      }

    case types.DASHBOARD_ADD_WIDGET:
      {
        var newWidgets = [].concat(_toConsumableArray(state.widgets), [action.data]);

        return Object.assign({}, state, {
          widgets: newWidgets
        });
      }

    case types.DASHBOARD_REMOVE_WIDGET:
      {
        var _newWidgets = state.widgets.filter(function (x) {
          return x.id !== action.id;
        });
        var newLayout = state.layout.filter(function (x) {
          return x.i !== action.id;
        });

        return Object.assign({}, state, {
          widgets: _newWidgets,
          layout: newLayout
        });
      }

    case types.DASHBOARD_UPDATE_WIDGET:
      {
        var _newWidgets2 = [].concat(_toConsumableArray(state.widgets));
        var idx = _newWidgets2.findIndex(function (obj) {
          return obj.id === action.id;
        });

        // make sure id is not overriden
        var update = action.update;
        delete update.id;
        _newWidgets2[idx] = _extends({}, _newWidgets2[idx], action.update);

        return Object.assign({}, state, {
          widgets: _newWidgets2
        });
      }

    case types.DASHBOARD_SET_WIDGET_TYPE_UNSYNCED:
      {
        var _newWidgets3 = state.widgets.map(function (w) {
          return w.type === action.widgetType ? _extends({}, w, {
            error: null,
            synced: false
          }) : w;
        });

        return Object.assign({}, state, {
          widgets: _newWidgets3
        });
      }
    case types.DASHBOARD_UPDATE_LAYOUT:
      {
        return Object.assign({}, state, {
          layout: action.layout
        });
      }

    case types.DASHBOARD_APPEND_LAYOUT:
      {
        var _newLayout = [].concat(_toConsumableArray(state.layout), [action.layout]);
        return Object.assign({}, state, {
          layout: _newLayout
        });
      }

    case types.DASHBOARD_REMOVE_LAYOUT:
      {
        var _idx = state.layout.findIndex(function (x) {
          return x.i === action.id;
        });
        var _newLayout2 = state.layout.splice(_idx, 1);
        return Object.assign({}, state, {
          layout: _newLayout2
        });
      }

    case types.DASHBOARD_SET_WIDGET_DEVICE_TYPE:
      {
        return Object.assign({}, state, {
          widgetDeviceType: action.deviceType
        });
      }

    case types.DASHBOARD_SET_DIRTY:
      {
        return Object.assign({}, state, {
          dirty: true
        });
      }

    case types.DASHBOARD_RESET_DIRTY:
      {
        return Object.assign({}, state, {
          dirty: false
        });
      }

    case types.USER_RECEIVED_LOGOUT:
      return Object.assign({}, initialState);

    default:
      return state;
  }
};

module.exports = dashboard;