'use strict';

var _react2 = require('react');

var _react3 = _interopRequireDefault(_react2);

var _babelTransform = require('livereactload/babel-transform');

var _babelTransform2 = _interopRequireDefault(_babelTransform);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _components = {
  _component: {}
};

var _livereactloadBabelTransform2 = (0, _babelTransform2.default)({
  filename: 'components/sections/Reports.js',
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
var moment = require('moment');
var DatetimeInput = require('react-datetime');
var Select = require('react-select');

var _require = require('react-intl'),
    FormattedMessage = _require.FormattedMessage,
    FormattedDate = _require.FormattedDate;

var _require2 = require('react-router'),
    Link = _require2.Link;

var MainSection = require('../layout/MainSection');
var Topbar = require('../layout/Topbar');

var _require3 = require('../layout/Sidebars'),
    SidebarRight = _require3.SidebarRight;

var _require4 = require('../helpers/Navigators'),
    TimeNavigator = _require4.TimeNavigator;

var _require5 = require('../../constants/HomeConstants'),
    IMAGES = _require5.IMAGES;

var Reports = _wrapComponent('_component')(React.createClass({
  displayName: 'Reports',

  componentWillMount: function componentWillMount() {},
  handlePeriodSelect: function handlePeriodSelect(val) {
    this.props.actions.setTime({
      startDate: val,
      endDate: moment(val).endOf('month').valueOf()
    });
  },
  handlePrevious: function handlePrevious() {
    this.props.actions.setTime(this.props.previousPeriod);
  },
  handleNext: function handleNext() {
    this.props.actions.setTime(this.props.nextPeriod);
  },
  render: function render() {
    return React.createElement(
      MainSection,
      { id: 'section.reports' },
      React.createElement(
        'div',
        { className: 'section-row-container' },
        React.createElement(
          'div',
          { className: 'primary' },
          React.createElement(
            'div',
            { style: { margin: '40px 30px', textAlign: 'center' } },
            React.createElement(
              'h3',
              null,
              'Monthly reports'
            ),
            React.createElement(TimeNavigator, {
              handlePrevious: this.handlePrevious,
              handleNext: this.handleNext,
              hasNext: !this.props.isAfterToday,
              time: this.props.time
            }),
            React.createElement(DatetimeInput, {
              closeOnSelect: true,
              className: 'reports-time-selector',
              dateFormat: 'MM/YYYY',
              timeFormat: false,
              inputProps: { size: 18 },
              value: moment(this.props.time.startDate).add(5, 'day').valueOf(),
              isValidDate: function isValidDate(curr) {
                return curr.valueOf() <= moment().endOf('month').valueOf();
              },
              viewMode: 'months',
              onChange: this.handlePeriodSelect
            })
          )
        ),
        React.createElement(
          SidebarRight,
          null,
          React.createElement(
            'div',
            { className: 'commons-right' },
            '\xA0'
          )
        )
      )
    );
  }
}));

module.exports = Reports;