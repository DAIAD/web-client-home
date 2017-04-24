'use strict';

var _react2 = require('react');

var _react3 = _interopRequireDefault(_react2);

var _babelTransform = require('livereactload/babel-transform');

var _babelTransform2 = _interopRequireDefault(_babelTransform);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _components = {
  _component: {}
};

var _livereactloadBabelTransform2 = (0, _babelTransform2.default)({
  filename: 'components/sections/history/index.js',
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

var _require = require('react-intl'),
    FormattedDate = _require.FormattedDate,
    FormattedMessage = _require.FormattedMessage;

var bs = require('react-bootstrap');

var MainSection = require('../../layout/MainSection');
var Topbar = require('../../layout/Topbar');

var _require2 = require('../../layout/Sidebars'),
    SidebarLeft = _require2.SidebarLeft,
    SidebarRight = _require2.SidebarRight;

var _require3 = require('../../helpers/Navigators'),
    TimeNavigator = _require3.TimeNavigator,
    CustomTimeNavigator = _require3.CustomTimeNavigator,
    ShowerNavigator = _require3.ShowerNavigator;

var _require4 = require('../../helpers/Tabs'),
    Tabs = _require4.Tabs,
    TabsMulti = _require4.TabsMulti,
    Tab = _require4.Tab;

var HistoryChart = require('./HistoryChart');
var SessionsList = require('./SessionsList');
var DisplayMetric = require('../../helpers/DisplayMetric');

//sub-containers
var SessionData = require('../../../containers/SessionData');

//utils
var timeUtil = require('../../../utils/time');

var _require5 = require('../../../constants/HomeConstants'),
    IMAGES = _require5.IMAGES,
    PNG_IMAGES = _require5.PNG_IMAGES,
    BASE64 = _require5.BASE64;

var History = _wrapComponent('_component')(React.createClass({
  displayName: 'History',

  componentWillMount: function componentWillMount() {
    if (!this.props.synced) {
      this.props.fetchData();
    }
  },
  handleTypeSelect: function handleTypeSelect(key) {
    this.props.setMetricFilter(key);
  },
  handlePeriodSelect: function handlePeriodSelect(key) {
    var time = timeUtil.getTimeByPeriod(key);
    this.props.setQueryAndFetch({ period: key, time: time });
  },
  handleTimePrevious: function handleTimePrevious() {
    this.props.setQueryAndFetch({ time: this.props.previousPeriod });
  },
  handleTimeNext: function handleTimeNext() {
    this.props.setQueryAndFetch({ time: this.props.nextPeriod });
  },
  handleShowerPrevious: function handleShowerPrevious() {
    this.props.setQueryAndFetch({ decreaseShowerIndex: true });
  },
  handleShowerNext: function handleShowerNext() {
    this.props.setQueryAndFetch({ increaseShowerIndex: true });
  },
  handleDeviceChange: function handleDeviceChange(val) {
    var keys = val.map(function (d) {
      return d.value;
    });
    this.props.setQueryAndFetch({ device: keys });
  },
  handleDeviceTypeSelect: function handleDeviceTypeSelect(val) {
    this.props.setQueryAndFetch({ deviceType: val });
  },
  handleModeSelect: function handleModeSelect(val) {
    this.props.setQueryAndFetch({ mode: val });
  },
  handleActiveDevicesChanged: function handleActiveDevicesChanged(val) {
    var switchDevType = this.props.activeDeviceType === 'METER' ? { deviceType: 'AMPHIRO' } : {};
    var found = this.props.activeDevice.find(function (d) {
      return d === val;
    });
    var device = found ? this.props.activeDevice.filter(function (d) {
      return d !== val;
    }) : [].concat(_toConsumableArray(this.props.activeDevice), [val]);
    this.props.setQueryAndFetch(_extends({ device: device }, switchDevType));
  },
  handleComparisonSelect: function handleComparisonSelect(val) {
    this.props.setQueryAndFetch({ comparisons: [val] });
  },
  handleSortSelect: function handleSortSelect(e, val) {
    this.props.setSortFilter(val);
  },
  render: function render() {
    var _this = this;

    var _props = this.props,
        _t = _props._t,
        chart = _props.chart,
        mu = _props.mu,
        amphiros = _props.amphiros,
        activeDevice = _props.activeDevice,
        activeDeviceType = _props.activeDeviceType,
        timeFilter = _props.timeFilter,
        time = _props.time,
        metrics = _props.metrics,
        periods = _props.periods,
        comparisons = _props.comparisons,
        deviceTypes = _props.deviceTypes,
        data = _props.data,
        hasShowersBefore = _props.hasShowersBefore,
        hasShowersAfter = _props.hasShowersAfter,
        forecasting = _props.forecasting,
        pricing = _props.pricing;

    return React.createElement(
      MainSection,
      { id: 'section.history' },
      React.createElement(
        Topbar,
        null,
        React.createElement(
          Tabs,
          {
            className: 'history-time-nav',
            position: 'top',
            tabWidth: 3,
            activeKey: timeFilter,
            onSelect: this.handlePeriodSelect
          },
          periods.map(function (period) {
            return React.createElement(Tab, {
              key: period.id,
              eventKey: period.id,
              title: _t(period.title)
            });
          })
        )
      ),
      React.createElement(
        'div',
        { className: 'section-row-container' },
        React.createElement(
          SidebarLeft,
          null,
          this.props.activeDeviceType === 'METER' ? React.createElement(
            Tabs,
            {
              position: 'left',
              tabWidth: 20,
              activeKey: this.props.mode,
              onSelect: this.handleModeSelect
            },
            this.props.modes.map(function (mode) {
              return React.createElement(Tab, {
                key: mode.id,
                eventKey: mode.id,
                image: mode.image ? IMAGES + '/' + mode.image : null,
                title: _t(mode.title)
              });
            })
          ) : React.createElement('span', null),
          this.props.activeDeviceType === 'AMPHIRO' ? React.createElement(
            Tabs,
            {
              activeKey: this.props.filter,
              onSelect: this.handleTypeSelect
            },
            metrics.map(function (metric) {
              return React.createElement(Tab, {
                key: metric.id,
                eventKey: metric.id,
                title: _t(metric.title),
                image: IMAGES + '/' + metric.image
              });
            })
          ) : React.createElement('span', null),
          React.createElement('br', null),
          React.createElement('br', null),
          this.props.memberFilters && this.props.memberFilters.length > 0 ? React.createElement(
            'div',
            null,
            React.createElement(
              Tabs,
              {
                activeKey: this.props.memberFilter,
                onSelect: function onSelect(val) {
                  return _this.props.setQueryAndFetch({ memberFilter: val });
                }
              },
              this.props.memberFilters.map(function (filter) {
                return React.createElement(Tab, {
                  key: filter.id,
                  eventKey: filter.id,
                  title: filter.title,
                  className: 'member-tab',
                  image: filter.image
                });
              })
            )
          ) : React.createElement('div', null)
        ),
        React.createElement(
          SidebarRight,
          null,
          React.createElement(
            Tabs,
            {
              position: 'left',
              tabWidth: 20,
              activeKey: this.props.activeDeviceType,
              onSelect: this.handleDeviceTypeSelect
            },
            deviceTypes.map(function (devType) {
              return React.createElement(Tab, {
                key: devType.id,
                eventKey: devType.id,
                title: _t(devType.title),
                image: IMAGES + '/' + devType.image
              });
            })
          ),
          React.createElement(
            TabsMulti,
            {
              activeKeys: this.props.activeDevice,
              onSelect: this.handleActiveDevicesChanged
            },
            this.props.amphiros.map(function (device) {
              return React.createElement(Tab, {
                key: device.deviceKey,
                eventKey: device.deviceKey,
                title: device.name,
                className: 'amphiro-tab ' + (_this.props.activeDeviceType !== 'AMPHIRO' ? 'blur' : '')
              });
            })
          ),
          React.createElement('br', null),
          this.props.compareAgainst && this.props.compareAgainst.length > 0 ? React.createElement(
            'h5',
            { style: { marginLeft: 20 } },
            React.createElement(FormattedMessage, { id: 'history.compare-against' })
          ) : React.createElement('span', null),
          React.createElement(
            TabsMulti,
            {
              activeKeys: this.props.comparisons.map(function (c) {
                return c.id;
              }),
              onSelect: function onSelect(val) {
                return _this.handleComparisonSelect(val);
              }
            },
            this.props.compareAgainst.map(function (comparison) {
              return React.createElement(Tab, {
                key: comparison.id,
                eventKey: comparison.id,
                image: comparison.image,
                title: comparison.title,
                className: 'compare-tab'
              });
            })
          ),
          this.props.comparisons.length > 0 ? React.createElement(
            'button',
            {
              className: 'btn-a',
              style: { float: 'right', marginTop: 10, marginRight: 20 },
              onClick: function onClick() {
                return _this.props.setQueryAndFetch({ clearComparisons: true });
              }
            },
            React.createElement(FormattedMessage, { id: 'forms.clear' })
          ) : React.createElement('div', null)
        ),
        React.createElement(
          'div',
          { className: 'primary' },
          React.createElement(
            'div',
            { className: 'history-chart-area' },
            React.createElement(
              'h3',
              { style: { textAlign: 'center', margin: '10px 0 0 0' } },
              React.createElement(DisplayMetric, { value: this.props.reducedMetric })
            ),
            function () {
              if (activeDeviceType === 'METER') {
                if (timeFilter === 'custom') {
                  return React.createElement(CustomTimeNavigator, {
                    updateTime: function updateTime(newTime) {
                      return _this.props.setQueryAndFetch({ time: newTime });
                    },
                    time: time
                  });
                }
                return React.createElement(TimeNavigator, {
                  handlePrevious: _this.handleTimePrevious,
                  handleNext: _this.handleTimeNext,
                  hasNext: !_this.props.isAfterToday,
                  time: time
                });
              } else if (timeFilter !== 'all') {
                return React.createElement(ShowerNavigator, {
                  handlePrevious: _this.handleShowerPrevious,
                  handleNext: _this.handleShowerNext,
                  hasNext: hasShowersAfter(),
                  hasPrevious: hasShowersBefore(),
                  showerRanges: data.map(function (s) {
                    return s && s.range ? {
                      first: s.range.first,
                      last: s.range.last,
                      name: s.name
                    } : {};
                  })
                });
              }
              return React.createElement('div', null);
            }(),
            React.createElement(
              'div',
              { className: 'history-chart' },
              React.createElement(HistoryChart, _extends({}, chart))
            )
          ),
          React.createElement('br', null),
          React.createElement(SessionsList, _extends({
            _t: _t,
            handleSortSelect: this.handleSortSelect,
            activeDeviceType: activeDeviceType
          }, this.props))
        )
      ),
      React.createElement(SessionData, {
        sessions: this.props.sessions,
        time: this.props.time
      })
    );
  }
}));

module.exports = History;