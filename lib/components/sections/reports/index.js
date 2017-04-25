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
  filename: 'components/sections/reports/index.js',
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

var MainSection = require('../../layout/MainSection');
var Topbar = require('../../layout/Topbar');

var _require3 = require('../../layout/Sidebars'),
    SidebarRight = _require3.SidebarRight;

var Table = require('../../helpers/Table');

var _require4 = require('../../helpers/Navigators'),
    TimeNavigator = _require4.TimeNavigator;

var _require5 = require('../../../schemas/reports'),
    reportsFields = _require5.reports;

var _require6 = require('../../../constants/HomeConstants'),
    IMAGES = _require6.IMAGES;

var Reports = _wrapComponent('_component')(React.createClass({
  displayName: 'Reports',

  componentWillMount: function componentWillMount() {
    this.props.actions.getReportsStatus();
  },
  handlePeriodSelect: function handlePeriodSelect(val) {
    this.props.actions.setQueryAndFetch({
      time: {
        startDate: val,
        endDate: moment(val).endOf('year').valueOf()
      }
    });
  },
  handlePrevious: function handlePrevious() {
    this.props.actions.setQueryAndFetch({ time: this.props.previousPeriod });
  },
  handleNext: function handleNext() {
    this.props.actions.setQueryAndFetch({ time: this.props.nextPeriod });
  },
  render: function render() {
    var reports = this.props.reports;
    // TODO: for pdf preview check
    // http://stackoverflow.com/questions/17784037/how-to-display-pdf-file-in-html

    return React.createElement(
      MainSection,
      { id: 'section.reports' },
      React.createElement(
        'div',
        { className: 'section-row-container' },
        React.createElement(
          'div',
          { className: 'primary' },
          React.createElement('div', { style: { marginTop: 50 } }),
          React.createElement(TimeNavigator, {
            handlePrevious: this.handlePrevious,
            handleNext: this.handleNext,
            hasNext: !this.props.isAfterToday,
            time: this.props.time,
            formatter: { year: 'numeric', month: 'numeric' }
          }),
          React.createElement('div', { style: { marginTop: 50 } }),
          React.createElement(Table, {
            className: 'session-list',
            rowClassName: 'reports-list-item',
            fields: reportsFields,
            data: reports,
            empty: React.createElement(
              'h5',
              { style: { textAlign: 'center' } },
              React.createElement(FormattedMessage, { id: 'reports.empty' })
            )
          })
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