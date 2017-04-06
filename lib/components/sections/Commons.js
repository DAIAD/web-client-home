'use strict';

var _react2 = require('react');

var _react3 = _interopRequireDefault(_react2);

var _babelTransform = require('livereactload/babel-transform');

var _babelTransform2 = _interopRequireDefault(_babelTransform);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _components = {
  _component: {}
};

var _livereactloadBabelTransform2 = (0, _babelTransform2.default)({
  filename: 'components/sections/Commons.js',
  components: _components,
  locals: [],
  imports: [_react3.default]
});

function _wrapComponent(id) {
  return function (Component) {
    return _livereactloadBabelTransform2(Component, id);
  };
}

var React = require('react');
var bs = require('react-bootstrap');
var Select = require('react-select');

var _require = require('react-intl'),
    FormattedMessage = _require.FormattedMessage,
    FormattedDate = _require.FormattedDate;

var _require2 = require('react-router'),
    Link = _require2.Link;

var _require3 = require('react-echarts'),
    LineChart = _require3.LineChart,
    BarChart = _require3.BarChart;

var MainSection = require('../layout/MainSection');
var Topbar = require('../layout/Topbar');

var Table = require('../helpers/Table');

var _require4 = require('../helpers/Navigators'),
    TimeNavigator = _require4.TimeNavigator,
    CustomTimeNavigator = _require4.CustomTimeNavigator;

var _require5 = require('../layout/Sidebars'),
    SidebarRight = _require5.SidebarRight;

var theme = require('../chart/themes/history');

var _require6 = require('../../schemas/commons'),
    commonsSchema = _require6.commons,
    allCommonsSchema = _require6.allCommons,
    membersSchema = _require6.members;

var timeUtil = require('../../utils/time');

var _require7 = require('../../utils/general'),
    debounce = _require7.debounce;

var _require8 = require('../../constants/HomeConstants'),
    IMAGES = _require8.IMAGES,
    COMMONS_MEMBERS_PAGE = _require8.COMMONS_MEMBERS_PAGE,
    COMMONS_USER_SORT = _require8.COMMONS_USER_SORT,
    BASE64 = _require8.BASE64;

function ChartArea(props) {
  var _t = props._t,
      handlePrevious = props.handlePrevious,
      handleNext = props.handleNext,
      time = props.time,
      timeFilter = props.timeFilter,
      chartData = props.chartData,
      chartCategories = props.chartCategories,
      actions = props.actions;
  var setDataQueryAndFetch = actions.setDataQueryAndFetch;

  var mu = 'lt';
  return React.createElement(
    'div',
    { className: 'history-chart-area' },
    timeFilter === 'custom' ? React.createElement(CustomTimeNavigator, {
      updateTime: function updateTime(newTime) {
        setDataQueryAndFetch({ time: newTime });
      },
      time: time
    }) : React.createElement(TimeNavigator, {
      handlePrevious: handlePrevious,
      handleNext: handleNext,
      time: time
    }),
    React.createElement(LineChart, {
      width: '100%',
      height: 380,
      theme: theme,
      xAxis: {
        data: chartCategories,
        boundaryGap: true
      },
      yAxis: {
        formatter: function formatter(y) {
          return y + ' ' + mu;
        }
      },
      colors: theme.colors,
      series: chartData.map(function (s) {
        return _extends({}, s);
      })
    })
  );
}

function MembersArea(props) {
  var _t = props._t,
      handleSortSelect = props.handleSortSelect,
      searchFilter = props.searchFilter,
      members = props.members,
      actions = props.actions;
  var selectedMembers = members.selected,
      activeMembers = members.active,
      sortFilter = members.sortFilter,
      sortOrder = members.sortOrder,
      memberCount = members.count,
      pagingIndex = members.pagingIndex;
  var setDataQueryAndFetch = actions.setDataQueryAndFetch,
      setSearchFilter = actions.setSearchFilter,
      addMemberToChart = actions.addMemberToChart,
      removeMemberFromChart = actions.removeMemberFromChart,
      setMemberSortFilter = actions.setMemberSortFilter,
      setMemberSortOrder = actions.setMemberSortOrder,
      setMemberSearchFilter = actions.setMemberSearchFilter,
      searchCommonMembers = actions.searchCommonMembers,
      setMemberQueryAndFetch = actions.setMemberQueryAndFetch,
      fetchData = actions.fetchData;


  return React.createElement(
    'div',
    { className: 'commons-members-area' },
    React.createElement(
      'div',
      { style: { marginTop: 20, marginBottom: 0, marginLeft: 20 } },
      React.createElement(
        'h5',
        null,
        React.createElement(FormattedMessage, { id: 'commons.members' })
      )
    ),
    React.createElement(
      'div',
      { className: 'members-search', style: { float: 'left', marginLeft: 20 } },
      React.createElement(
        'form',
        {
          className: 'search-field',
          onSubmit: function onSubmit(e) {
            e.preventDefault();
            setMemberQueryAndFetch({ index: 0 });
          }
        },
        React.createElement('input', {
          type: 'text',
          placeholder: 'Search member...',
          onChange: function onChange(e) {
            setMemberSearchFilter(e.target.value);
            debounce(function () {
              setMemberQueryAndFetch({ index: 0 });
            }, 300)();
          },
          value: searchFilter
        }),
        React.createElement('button', {
          className: 'clear-button',
          type: 'reset',
          onClick: function onClick(e) {
            setMemberQueryAndFetch({ index: 0, name: '' });
          }
        })
      )
    ),
    React.createElement(
      'div',
      { className: 'members-sort', style: { float: 'right', marginRight: 10 } },
      React.createElement(
        'h5',
        { style: { float: 'left', marginTop: 5 } },
        'Sort by:'
      ),
      React.createElement(
        'div',
        {
          className: 'sort-options',
          style: { float: 'right', marginLeft: 10, textAlign: 'right' }
        },
        React.createElement(
          bs.DropdownButton,
          {
            title: COMMONS_USER_SORT.find(function (sort) {
              return sort.id === sortFilter;
            }) ? COMMONS_USER_SORT.find(function (sort) {
              return sort.id === sortFilter;
            }).title : 'Last name',
            id: 'sort-by',
            defaultValue: sortFilter,
            onSelect: handleSortSelect
          },
          COMMONS_USER_SORT.map(function (sort) {
            return React.createElement(
              bs.MenuItem,
              {
                key: sort.id,
                eventKey: sort.id,
                value: sort.id
              },
              sort.title
            );
          })
        ),
        React.createElement(
          'div',
          { style: { float: 'right', marginLeft: 20 } },
          sortOrder === 'asc' ? React.createElement(
            'a',
            { onClick: function onClick() {
                return setMemberQueryAndFetch({ sortOrder: 'desc' });
              } },
            React.createElement('i', { className: 'fa fa-arrow-up' })
          ) : React.createElement(
            'a',
            { onClick: function onClick() {
                return setMemberQueryAndFetch({ sortOrder: 'asc' });
              } },
            React.createElement('i', { className: 'fa fa-arrow-down' })
          )
        )
      )
    ),
    React.createElement('br', null),
    React.createElement(
      'div',
      null,
      React.createElement(
        'p',
        { style: { marginLeft: 20 } },
        React.createElement(
          'b',
          null,
          'Found:'
        ),
        ' ',
        memberCount
      ),
      React.createElement(
        'p',
        { style: { marginLeft: 20 } },
        React.createElement('i', { className: 'fa fa-info-circle' }),
        '\xA0',
        React.createElement(
          'i',
          null,
          'Click on up to 3 members to compare against'
        )
      )
    ),
    React.createElement(Table, {
      className: 'session-list',
      rowClassName: function rowClassName(row) {
        return selectedMembers.find(function (m) {
          return m.key === row.key;
        }) ? 'session-list-item selected' : 'session-list-item';
      },
      fields: membersSchema,
      data: activeMembers,
      pagination: {
        total: Math.ceil(memberCount / COMMONS_MEMBERS_PAGE),
        active: pagingIndex,
        onPageClick: function onPageClick(page) {
          setMemberQueryAndFetch({ index: page - 1 });
        }
      },
      onRowClick: function onRowClick(row) {
        if (selectedMembers.map(function (u) {
          return u.key;
        }).includes(row.key)) {
          removeMemberFromChart(row);
        } else if (selectedMembers.length < 3) {
          addMemberToChart(_extends({}, row, { selected: selectedMembers.length + 1 }));
        }
      }
    })
  );
}

var Commons = _wrapComponent('_component')(React.createClass({
  displayName: 'Commons',

  componentWillMount: function componentWillMount() {
    if (!this.props.synced) {
      this.props.actions.fetchData();
    }
    if (this.props.favorite) {
      this.props.actions.setDataQueryAndFetch({ active: this.props.favorite });
    }

    if (this.props.active) {
      this.props.actions.searchCommonMembers();
    }
  },
  handlePeriodSelect: function handlePeriodSelect(key) {
    var time = timeUtil.getTimeByPeriod(key);
    if (time) this.props.actions.setDataQueryAndFetch({ timeFilter: key, time: time });
  },
  handlePrevious: function handlePrevious() {
    this.props.actions.setDataQueryAndFetch({ time: this.props.previousPeriod });
  },
  handleNext: function handleNext() {
    this.props.actions.setDataQueryAndFetch({ time: this.props.nextPeriod });
  },
  handleSortSelect: function handleSortSelect(e, val) {
    this.props.actions.setMemberQueryAndFetch({ sortBy: val });
  },
  handleDeviceTypeSelect: function handleDeviceTypeSelect(val) {
    this.props.actions.setDataQueryAndFetch({ deviceType: val });
  },
  render: function render() {
    var _props = this.props,
        _t = _props._t,
        activeDeviceType = _props.activeDeviceType,
        deviceTypes = _props.deviceTypes,
        active = _props.active,
        myCommons = _props.myCommons,
        mode = _props.mode,
        searchFilter = _props.searchFilter,
        periods = _props.periods,
        time = _props.time,
        timeFilter = _props.timeFilter,
        chartCategories = _props.chartCategories,
        chartData = _props.chartData,
        members = _props.members,
        actions = _props.actions;
    var selectedMembers = members.selected,
        activeMembers = members.active,
        sortFilter = members.sortFilter,
        sortOrder = members.sortOrder,
        memberCount = members.count,
        pagingIndex = members.pagingIndex;
    var setDataQueryAndFetch = actions.setDataQueryAndFetch,
        setSearchFilter = actions.setSearchFilter,
        resetConfirm = actions.resetConfirm,
        confirm = actions.confirm,
        clickConfirm = actions.clickConfirm,
        goToManage = actions.goToManage,
        goToJoin = actions.goToJoin,
        addMemberToChart = actions.addMemberToChart,
        removeMemberFromChart = actions.removeMemberFromChart,
        setMemberSortFilter = actions.setMemberSortFilter,
        setMemberSortOrder = actions.setMemberSortOrder,
        setMemberSearchFilter = actions.setMemberSearchFilter,
        searchCommonMembers = actions.searchCommonMembers,
        setMemberQueryAndFetch = actions.setMemberQueryAndFetch,
        fetchData = actions.fetchData;


    return React.createElement(
      MainSection,
      { id: 'section.commons' },
      React.createElement(
        Topbar,
        null,
        active ? React.createElement(
          bs.Tabs,
          {
            className: 'history-time-nav',
            position: 'top',
            tabWidth: 3,
            activeKey: timeFilter,
            onSelect: this.handlePeriodSelect
          },
          periods.map(function (period) {
            return React.createElement(bs.Tab, {
              key: period.id,
              eventKey: period.id,
              title: _t(period.title)
            });
          })
        ) : React.createElement('span', null)
      ),
      React.createElement(
        'div',
        { className: 'section-row-container' },
        React.createElement(
          'div',
          { className: 'primary' },
          React.createElement(
            'div',
            { className: 'commons-details' },
            active ? React.createElement(
              'div',
              null,
              React.createElement(ChartArea, _extends({
                handlePrevious: this.handlePrevious,
                handleNext: this.handleNext
              }, this.props)),
              React.createElement(MembersArea, _extends({
                handleSortSelect: this.handleSortSelect
              }, this.props))
            ) : React.createElement(
              'div',
              null,
              React.createElement(
                'h3',
                { style: { marginTop: 20, marginLeft: 40 } },
                'My commons'
              ),
              React.createElement(
                'p',
                { style: { marginLeft: 40 } },
                'Please select a community from the list, or join one in Settings'
              )
            ),
            React.createElement('div', { style: { marginBottom: 50 } })
          )
        ),
        React.createElement(
          SidebarRight,
          null,
          React.createElement(
            'div',
            { className: 'commons-right' },
            React.createElement(
              'div',
              { style: { padding: 20 } },
              active && active.image ? React.createElement('img', {
                style: {
                  marginBottom: 20,
                  height: 120,
                  width: 120,
                  border: '2px #2D3580 solid'
                },
                src: '' + BASE64 + active.image,
                alt: 'commons'
              }) : React.createElement('img', {
                style: {
                  marginBottom: 20,
                  height: 120,
                  width: 120,
                  background: '#2D3580',
                  border: '2px #2D3580 solid'
                },
                src: IMAGES + '/commons-menu.svg',
                alt: 'commons-default'
              }),
              myCommons.length === 0 ? React.createElement(
                'div',
                null,
                React.createElement(
                  'span',
                  null,
                  'Not a member of any commmunities yet'
                ),
                React.createElement(
                  'button',
                  {
                    style: { width: '100%', marginTop: 20 },
                    onClick: goToJoin
                  },
                  'Join'
                )
              ) : React.createElement(
                'div',
                null,
                React.createElement(
                  bs.DropdownButton,
                  {
                    className: 'commons-select-active',
                    style: { width: 120 },
                    pullRight: true,
                    title: active ? active.name : 'Select',
                    id: 'select-commons',
                    value: active ? active.id : null,
                    onSelect: function onSelect(e, val) {
                      setDataQueryAndFetch({ active: val });
                    }
                  },
                  myCommons.map(function (common) {
                    return React.createElement(
                      bs.MenuItem,
                      {
                        key: common.key,
                        eventKey: common.key,
                        value: common.key
                      },
                      common.name || 'No name'
                    );
                  })
                ),
                active ? React.createElement(
                  'p',
                  null,
                  React.createElement(
                    'span',
                    null,
                    React.createElement('i', { className: 'fa fa-info-circle' }),
                    '\xA0 ',
                    active.description
                  ),
                  React.createElement('br', null),
                  React.createElement(
                    'span',
                    null,
                    memberCount + ' members'
                  )
                ) : React.createElement('span', null)
              )
            ),
            active ? React.createElement(
              bs.Tabs,
              {
                position: 'left',
                tabWidth: 20,
                activeKey: activeDeviceType,
                onSelect: this.handleDeviceTypeSelect
              },
              deviceTypes.map(function (devType) {
                return React.createElement(bs.Tab, {
                  key: devType.id,
                  eventKey: devType.id,
                  title: devType.title
                });
              })
            ) : React.createElement('span', null)
          )
        )
      )
    );
  }
}));

module.exports = Commons;