const types = require('../constants/ActionTypes');

const initialState = {
  allCommons: [],
  synced: false,
  pagingIndex: 0,
  searchFilter: '',
  count: 0,
  confirm: null, 
};
 
const commons = function (state = initialState, action) {
  switch (action.type) {
    case types.COMMONS_SET_ALL:
      return {
        ...state,
        allCommons: action.commons,
      };

    case types.COMMONS_SET_ALL_SYNCED:
      return {
        ...state,
        synced: true,
      };

    case types.COMMONS_SET_ALL_UNSYNCED:
      return {
        ...state,
        synced: false,
      };

    case types.COMMONS_SET_CONFIRM: 
      return {
        ...state,
        confirm: [action.mode, action.common],
      };

    case types.COMMONS_RESET_CONFIRM:
      return {
        ...state,
        confirm: null,
      };

    case types.COMMONS_SET_SEARCH_FILTER:
      return {
        ...state,
        searchFilter: action.filter,
      };

    case types.COMMONS_SET_SEARCH_PAGING_INDEX:
      return {
        ...state,
        pagingIndex: action.index,
      };

    case types.COMMONS_SET_SEARCH_COUNT:
      return {
        ...state,
        count: action.count,
      };

    case types.USER_RECEIVED_LOGOUT:
      return { ...initialState };

    default:
      return state;
  }
};

module.exports = commons;

