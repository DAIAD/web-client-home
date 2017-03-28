const types = require('../constants/ActionTypes');

const initialState = {
  mode: 'normal',
  dirty: false,
  layout: [
    { i: '1', x: 0, y: 0, w: 2, h: 2 },
    { i: '2', x: 2, y: 0, w: 2, h: 2 },
    { i: '3', x: 2, y: 0, w: 2, h: 1 },
    { i: '4', x: 0, y: 0, w: 2, h: 2 },
    { i: '5', x: 0, y: 1, w: 2, h: 1 },
    { i: '6', x: 2, y: 2, w: 2, h: 2 },
    { i: '7', x: 0, y: 2, w: 2, h: 2 },
    { i: '8', x: 2, y: 2, w: 2, h: 2 },
    { i: '9', x: 0, y: 3, w: 2, h: 1 },
  ],
  widgetDeviceType: 'METER',
  widgets: [
    {
    id: '1', 
    title: 'Shower Volume',
    type: 'total',
    display: 'chart',
    period: 'ten',
    deviceType: 'AMPHIRO',
    metric: 'volume',
    data: [],
  }, 
  {
    id: '2', 
    title: 'Last Shower', 
    period: 'ten',
    type: 'last',
    display: 'chart',
    deviceType: 'AMPHIRO',
    metric: 'volume',
    data: [],
  }, 
  /*
  {
    id: '3', 
    title: 'Shower Energy',
    type: 'total',
    display: 'stat',
    period: 'twenty',
    deviceType: 'AMPHIRO',
    metric: 'energy',
    data: [],
  },
  {
    id: '4', 
    title: 'Total Water', 
    type: 'total',
    display: 'chart',
    deviceType: 'METER',
    period: 'year',
    metric: 'difference',
    data: [],
  },
  {
    id: '5', 
    title: 'Shower efficiency',
    type: 'efficiency',
    display: 'stat',
    deviceType: 'AMPHIRO',
    period: 'twenty',
    metric: 'energy',
    data: [],
  },
  {
    id: '6', 
    title: 'Breakdown',
    type: 'breakdown',
    display: 'chart',
    deviceType: 'METER',
    period: 'year',
    metric: 'difference',
    data: [],
    },
  {
    id: '7', 
    title: 'Forecast',
    type: 'forecast',
    display: 'chart',
    deviceType: 'METER',
    period: 'year',
    metric: 'difference',
    data: [],
  },
  {
    id: '8', 
    title: 'Comparison',
    type: 'comparison',
    display: 'chart',
    deviceType: 'METER',
    period: 'year',
    metric: 'difference',
    data: [],
  },
  {
    id: '9', 
    title: 'Daily Budget',
    type: 'budget',
    display: 'chart',
    deviceType: 'METER',
    period: 'day',
    metric: 'difference',
    data: [],
    },
  
  {
    id: '7', 
    title: 'Tip of the day',
    type: 'tip',
    display: 'tip',
    data: [],
    },
    */
  ]
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
      // TODO: had to use let instead of const because of browserify block scope error
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

