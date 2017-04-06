'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var types = require('../constants/ActionTypes');

var _require = require('../utils/time'),
    getMonth = _require.getMonth;

var initialState = {
  filter: 'volume',
  time: getMonth(),
  timeFilter: 'month',
  activeDeviceType: 'METER',
  data: [],
  synced: false,
  activeKey: null,
  members: {
    sortFilter: 'LASTNAME',
    sortOrder: 'desc',
    searchFilter: '',
    pagingIndex: 0,
    count: 0,
    active: [],
    selected: []
  },

  myCommons: []
};

var commons = function commons() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  switch (action.type) {
    case types.COMMONS_SET_SESSIONS:
      return _extends({}, state, {
        data: action.sessions
      });

    case types.COMMONS_APPEND_SESSIONS:
      return _extends({}, state, {
        data: [].concat(_toConsumableArray(state.data), _toConsumableArray(action.sessions))
      });

    case types.COMMONS_SET_MINE:
      return _extends({}, state, {
        myCommons: action.commons
      });

    case types.COMMONS_SET_TIME:
      return _extends({}, state, {
        time: action.time
      });

    case types.COMMONS_SET_ACTIVE_DEVICE_TYPE:
      return _extends({}, state, {
        activeDeviceType: action.deviceType
      });

    case types.COMMONS_SET_FILTER:
      return _extends({}, state, {
        filter: action.filter
      });

    case types.COMMONS_SET_TIME_FILTER:
      return _extends({}, state, {
        timeFilter: action.filter
      });

    case types.COMMONS_SET_DATA_SYNCED:
      return _extends({}, state, {
        synced: true
      });

    case types.COMMONS_SET_DATA_UNSYNCED:
      return _extends({}, state, {
        synced: false
      });

    case types.COMMONS_SET_ACTIVE:
      return _extends({}, state, {
        activeKey: action.key
      });

    case types.COMMONS_SET_ACTIVE_MEMBERS:
      return _extends({}, state, {
        members: _extends({}, state.members, {
          active: action.members
        })
      });

    case types.COMMONS_SET_SELECTED_MEMBERS:
      return _extends({}, state, {
        members: _extends({}, state.members, {
          selected: action.members
        })
      });

    case types.COMMONS_SET_MEMBER_SORT_FILTER:
      return _extends({}, state, {
        members: _extends({}, state.members, {
          sortFilter: action.filter
        })
      });

    case types.COMMONS_SET_MEMBER_SORT_ORDER:
      return _extends({}, state, {
        members: _extends({}, state.members, {
          sortOrder: action.order
        })
      });

    case types.COMMONS_SET_MEMBER_SEARCH_FILTER:
      return _extends({}, state, {
        members: _extends({}, state.members, {
          searchFilter: action.filter
        })
      });

    case types.COMMONS_SET_MEMBER_PAGING_INDEX:
      return _extends({}, state, {
        members: _extends({}, state.members, {
          pagingIndex: action.index
        })
      });

    case types.COMMONS_SET_MEMBER_COUNT:
      return _extends({}, state, {
        members: _extends({}, state.members, {
          count: action.count
        })
      });

    case types.USER_RECEIVED_LOGOUT:
      return _extends({}, initialState);

    default:
      return state;
  }
};

module.exports = commons;