const types = require('../constants/ActionTypes');

const initialState = {
  mode: 'normal',
  dirty: false,
  layout: [],
  widgetDeviceType: 'METER',
  widgets: [],
};

const dashboard = function (state = initialState, action) {
  switch (action.type) {
    case types.DASHBOARD_SWITCH_MODE: 
      return Object.assign({}, state, {
        mode: action.mode
      });
      
    case types.DASHBOARD_SET_WIDGETS: {
      return Object.assign({}, state, {
        widgets: action.widgets 
      });
    }

    case types.DASHBOARD_ADD_WIDGET: {
      const newWidgets = [...state.widgets, action.data];
      
      return Object.assign({}, state, {
        widgets: newWidgets
      });
    }
 
    case types.DASHBOARD_REMOVE_WIDGET: {
      const newWidgets = state.widgets.filter(x => x.id !== action.id);
      const newLayout = state.layout.filter(x => x.i !== action.id);

      return Object.assign({}, state, {
        widgets: newWidgets,
        layout: newLayout,
      });
    }

    case types.DASHBOARD_UPDATE_WIDGET: {
      const newWidgets = [...state.widgets];
      const idx = newWidgets.findIndex(obj => obj.id === action.id);

      // make sure id is not overriden
      const update = action.update;
      delete update.id;
      newWidgets[idx] = { ...newWidgets[idx], ...action.update };
      
      return Object.assign({}, state, {
        widgets: newWidgets
      });
    }

    case types.DASHBOARD_SET_WIDGET_TYPE_UNSYNCED: {
      const newWidgets = state.widgets
      .map(w => w.type === action.widgetType ? ({ 
        ...w, 
        error: null,
        synced: false, 
      }) 
      : w);
      
      return Object.assign({}, state, {
        widgets: newWidgets
      });
    }
    case types.DASHBOARD_UPDATE_LAYOUT: {
      return Object.assign({}, state, {
        layout: action.layout
      });
    }

    case types.DASHBOARD_APPEND_LAYOUT: {
      const newLayout = [...state.layout, action.layout];
      return Object.assign({}, state, {
        layout: newLayout 
      });
    }

    case types.DASHBOARD_REMOVE_LAYOUT: {
      const idx = state.layout.findIndex(x => x.i === action.id);
      const newLayout = state.layout.splice(idx, 1);
      return Object.assign({}, state, {
        layout: newLayout 
      });
    }

    case types.DASHBOARD_SET_WIDGET_DEVICE_TYPE: {
      return Object.assign({}, state, {
        widgetDeviceType: action.deviceType, 
      });
    }

    case types.DASHBOARD_SET_DIRTY: {
      return Object.assign({}, state, {
        dirty: true
      });
    }

    case types.DASHBOARD_RESET_DIRTY: {
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

