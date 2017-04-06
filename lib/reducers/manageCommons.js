'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var types = require('../constants/ActionTypes');

var initialState = {
  allCommons: [],
  favorite: null,
  synced: false,
  pagingIndex: 0,
  searchFilter: '',
  count: 0
};

var commons = function commons() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  switch (action.type) {
    case types.COMMONS_SET_ALL:
      return _extends({}, state, {
        allCommons: action.commons
      });

    case types.COMMONS_SET_ALL_SYNCED:
      return _extends({}, state, {
        synced: true
      });

    case types.COMMONS_SET_ALL_UNSYNCED:
      return _extends({}, state, {
        synced: false
      });

    case types.COMMONS_SET_SEARCH_FILTER:
      return _extends({}, state, {
        searchFilter: action.filter
      });

    case types.COMMONS_SET_SEARCH_PAGING_INDEX:
      return _extends({}, state, {
        pagingIndex: action.index
      });

    case types.COMMONS_SET_SEARCH_COUNT:
      return _extends({}, state, {
        count: action.count
      });

    case types.COMMONS_SET_FAVORITE:
      return _extends({}, state, {
        favorite: action.key
      });

    case types.USER_RECEIVED_LOGOUT:
      return _extends({}, initialState);

    default:
      return state;
  }
};

module.exports = commons;