const types = require('../constants/ActionTypes');

const { thisYear } = require('../utils/time');

const initialState = {
  filter: 'difference',
  timeFilter: 'year',
  sortFilter: 'ranking',
  sortOrder: 'desc',
  activeDeviceType: 'METER',
  synced: false,
  data: [],
  active: 1,
  selectedMembers: [],
  time: thisYear(),
  searchFilter: '',
  memberSearchFilter: '',
  //this should be provided by data API
  myCommons: [
    {
      id: 1,
      name: 'My Friends',
      description: 'A group of my friends',
      joined: true,
      membersCount: 3,
      owned: true, 
      owners: [],
      consumption: 85 + 2000 + 2525,
      members: [
        {
          id: 1,
          ranking: 1,
          name: 'John Doe',
          memberSince: -4701974400000,
          consumption: 85,
          efficiency: 'A+',
        },
        {
          id: 2,
          ranking: 2,
          name: 'Jack Doe',
          memberSince: -4701674400000,
          consumption: 2000,
          efficiency: 'C',
        },
        {
          id: 3,
          ranking: 3,
          name: 'Jane Doe',
          memberSince: -4721974400000,
          consumption: 2525,
          efficiency: 'C-',
        },
      ],
    },
    {
      id: 2,
      name: 'My Enemies',
      description: 'A group of my enemies',
      joined: true,
      owned: true, 
      owners: [],
      membersCount: 0,
      consumption: Math.round(Math.random() * 5000),
      members: [],
    }, 
  ],
  allCommons: [
    {
      id: 4,
      name: 'Pao BC',
      description: 'Pao fans',
      membersCount: 13,
      owners: [],
      consumption: Math.round(Math.random() * 300),
      members: [],
    },

    {
      id: 5,
      name: 'Greenpeace',
      description: 'Make love not war',
      membersCount: 99,
      owners: [],
      consumption: Math.round(Math.random() * 300),
      members: [
        {
          id: 4,
          ranking: 1,
          name: 'Jack Black',
          memberSince: 470197440000,
          consumption: Math.round(Math.random() * 10),
          efficiency: 'B-',
        },
      ]
    },
    {
      id: 6,
      name: 'IPSY',
      description: 'Ipsy employees',
      membersCount: 1,
      consumption: Math.round(Math.random() * 300),
      owners: [],
      members: [
        {
          id: 1,
          ranking: 1,
          name: 'John Doe',
          memberSince: -4701974400000,
          consumption: Math.round(Math.random() * 10),
          efficiency: 'A',
        },
      ]
    },
  ],
  confirm: null, 
};
 
const commons = function (state = initialState, action) {
  switch (action.type) {
    case types.COMMONS_SET_SESSIONS:
      return Object.assign({}, state, {
        data: action.sessions,
      });

    case types.COMMONS_SET_ALL:
      return Object.assign({}, state, {
        allCommons: action.commons,
      });

    case types.COMMONS_SET_MINE:
      return Object.assign({}, state, {
        myCommons: action.commons,
      });  

    case types.COMMONS_SET_TIME:
      return Object.assign({}, state, {
        time: Object.assign({}, state.time, action.time)
      });

    case types.COMMONS_SET_ACTIVE_DEVICE_TYPE:
      return Object.assign({}, state, {
        activeDeviceType: action.deviceType
      });
    
    case types.COMMONS_SET_FILTER:
      return Object.assign({}, state, {
        filter: action.filter
      });
    
    case types.COMMONS_SET_TIME_FILTER:
      return Object.assign({}, state, {
        timeFilter: action.filter
      });

    case types.COMMONS_SET_SORT_FILTER:
      return Object.assign({}, state, {
        sortFilter: action.filter
      });
    
    case types.COMMONS_SET_SORT_ORDER:
      return Object.assign({}, state, {
        sortOrder: action.order
      });
    
    case types.COMMONS_SET_DATA_SYNCED:
      return Object.assign({}, state, {
        synced: true
      });
    
    case types.COMMONS_SET_DATA_UNSYNCED:
      return Object.assign({}, state, {
        synced: false
      });

    case types.COMMONS_SET_ACTIVE:
      return Object.assign({}, state, {
        active: action.id,
      });

    case types.COMMONS_SET_SELECTED_MEMBERS:
      return Object.assign({}, state, {
        selectedMembers: action.members,
      });

    case types.COMMONS_SET_CONFIRM: 
      return Object.assign({}, state, {
        confirm: [action.mode, action.common],
      });

    case types.COMMONS_RESET_CONFIRM:
      return Object.assign({}, state, {
        confirm: null,
      });

    case types.COMMONS_SET_SEARCH_FILTER:
      return Object.assign({}, state, {
        searchFilter: action.search,
      });   

    case types.COMMONS_SET_MEMBER_SEARCH_FILTER:
      return Object.assign({}, state, {
        memberSearchFilter: action.search,
      });

    case types.USER_RECEIVED_LOGOUT:
      return Object.assign({}, initialState);

    default:
      return state;
  }
};

module.exports = commons;

