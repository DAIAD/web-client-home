const types = require('../constants/ActionTypes');

const { thisYear } = require('../utils/time');

const initialState = {
  filter: 'volume',
  time: thisYear(),
  timeFilter: 'year',
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
    selected: [],
  },

  myCommons: [],
};
 
const commons = function (state = initialState, action) {
  switch (action.type) {
    case types.COMMONS_SET_SESSIONS:
      return {
        ...state,
        data: action.sessions,
      };

    case types.COMMONS_APPEND_SESSIONS:
      return {
        ...state,
        data: [
          ...state.data,
          ...action.sessions,
        ],
      };


    case types.COMMONS_SET_MINE:
      return {
        ...state,
        myCommons: action.commons,
      };

    case types.COMMONS_SET_TIME:
      return {
        ...state,
        time: action.time,
      };

    case types.COMMONS_SET_ACTIVE_DEVICE_TYPE:
      return {
        ...state,
        activeDeviceType: action.deviceType,
      };
    
    case types.COMMONS_SET_FILTER:
      return {
        ...state,
        filter: action.filter,
      };
    
    case types.COMMONS_SET_TIME_FILTER:
      return {
        ...state,
        timeFilter: action.filter,
      };
    
    case types.COMMONS_SET_DATA_SYNCED:
      return {
        ...state,
        synced: true,
      };
    
    case types.COMMONS_SET_DATA_UNSYNCED:
      return {
        ...state,
        synced: false,
      };

    case types.COMMONS_SET_ACTIVE:
      return {
        ...state,
        activeKey: action.key,
      };

    case types.COMMONS_SET_ACTIVE_MEMBERS:
      return {
        ...state,
        members: {
          ...state.members,
          active: action.members,
        },
      };

    case types.COMMONS_SET_SELECTED_MEMBERS:
      return {
        ...state,
        members: {
          ...state.members,
          selected: action.members,
        },
      };

    case types.COMMONS_SET_MEMBER_SORT_FILTER:
      return {
        ...state,
        members: {
          ...state.members,
          sortFilter: action.filter,
        },
      };
    
    case types.COMMONS_SET_MEMBER_SORT_ORDER:
      return {
        ...state,
        members: {
          ...state.members,
          sortOrder: action.order,
        },
      };

    case types.COMMONS_SET_MEMBER_SEARCH_FILTER:
      return {
        ...state,
        members: {
          ...state.members,
          searchFilter: action.filter,
        },
      };

    case types.COMMONS_SET_MEMBER_PAGING_INDEX:
      return {
        ...state,
        members: {
          ...state.members,
          pagingIndex: action.index,
        },
      };

    case types.COMMONS_SET_MEMBER_COUNT:
      return {
        ...state,
        members: {
          ...state.members,
          count: action.count,
        },
      };

    case types.USER_RECEIVED_LOGOUT:
      return { ...initialState };

    default:
      return state;
  }
};

module.exports = commons;

