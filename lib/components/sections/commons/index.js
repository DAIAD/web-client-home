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
  filename: 'components/sections/commons/index.js',
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

var MainSection = require('../../layout/MainSection');
var Topbar = require('../../layout/Topbar');

var _require3 = require('../../layout/Sidebars'),
    SidebarRight = _require3.SidebarRight;

var CommonsChart = require('./CommonsChart');
var MembersArea = require('./MembersArea');

var timeUtil = require('../../../utils/time');

var _require4 = require('../../../constants/HomeConstants'),
    IMAGES = _require4.IMAGES,
    BASE64 = _require4.BASE64;

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
    if (time) this.props.actions.setDataQueryAndFetch({ period: key, time: time });
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
              React.createElement(CommonsChart, _extends({
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
                React.createElement(FormattedMessage, { id: 'commons.myCommons' })
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
                React.createElement(FormattedMessage, { id: 'commons.noCommons' }),
                React.createElement(
                  'button',
                  {
                    className: 'btn',
                    style: { width: '100%', marginTop: 20 },
                    onClick: goToJoin
                  },
                  React.createElement(FormattedMessage, { id: 'forms.join' })
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
                    title: active ? active.name : _t('forms.select'),
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
                      common.name || _t('forms.noname')
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
                  )
                ) : React.createElement('span', null)
              )
            )
          )
        )
      )
    );
  }
}));

module.exports = Commons;