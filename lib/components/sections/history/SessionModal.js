'use strict';

var _react2 = require('react');

var _react3 = _interopRequireDefault(_react2);

var _babelTransform = require('livereactload/babel-transform');

var _babelTransform2 = _interopRequireDefault(_babelTransform);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _components = {
  _component: {}
};

var _livereactloadBabelTransform2 = (0, _babelTransform2.default)({
  filename: 'components/sections/history/SessionModal.js',
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

var _require = require('react-intl'),
    FormattedMessage = _require.FormattedMessage;

var _require2 = require('react-echarts'),
    LineChart = _require2.LineChart;

var SessionDetails = require('./SessionDetails');

var theme = require('../../chart/themes/session');

var _require3 = require('../../../constants/HomeConstants'),
    IMAGES = _require3.IMAGES;

function BetterOrWorse(props) {
  var better = props.better,
      percentDifference = props.percentDifference,
      period = props.period,
      _t = props._t;

  var betterStr = better ? 'better' : 'worse';
  if (better === null) {
    return React.createElement(
      'div',
      null,
      _t('comparisons.no-data')
    );
  } else if (better) {
    return React.createElement(
      'div',
      null,
      React.createElement('img', {
        src: IMAGES + '/better.svg',
        style: { height: 25, marginRight: 10 },
        alt: 'better'
      }),
      _t('comparisons.' + betterStr, {
        percent: percentDifference,
        period: period
      })
    );
  }
  return React.createElement(
    'div',
    null,
    React.createElement('img', {
      src: IMAGES + '/worse.svg',
      style: { height: 25, marginRight: 10 },
      alt: 'worse'
    }),
    _t('comparisons.' + betterStr, {
      percent: percentDifference,
      period: period
    })
  );
}

function Session(props) {
  var _t = props._t,
      data = props.data,
      chartData = props.chartData,
      chartCategories = props.chartCategories,
      chartFormatter = props.chartFormatter,
      setSessionFilter = props.setSessionFilter,
      activeDeviceType = props.activeDeviceType,
      activeSessionFilter = props.activeSessionFilter,
      sessionFilters = props.sessionFilters,
      width = props.width,
      period = props.period,
      members = props.members;


  if (!data) return React.createElement('div', null);
  var devType = data.devType,
      history = data.history,
      id = data.id,
      min = data.min,
      max = data.max,
      date = data.date,
      device = data.device,
      measurements = data.measurements;


  var better = data.percentDiff != null ? data.percentDiff < 0 : null;
  var betterStr = better ? 'better' : 'worse';

  var percentDifference = data.percentDiff != null ? Math.abs(data.percentDiff) : '';

  if (devType === 'AMPHIRO' && (history === true || !measurements || Array.isArray(measurements) && measurements.length === 0)) {
    return React.createElement(
      'div',
      { className: 'shower-container' },
      React.createElement(
        'div',
        { className: 'shower-chart-area' },
        React.createElement(
          'div',
          { className: 'limited-data-text' },
          React.createElement(
            'h3',
            null,
            React.createElement(FormattedMessage, { id: 'history.limitedData' })
          ),
          React.createElement(
            'h5',
            null,
            React.createElement(BetterOrWorse, {
              better: better,
              percentDifference: percentDifference,
              period: _t('section.shower').toLowerCase(),
              _t: _t
            })
          )
        )
      ),
      React.createElement(SessionDetails, props)
    );
  } else if (devType === 'AMPHIRO') {
    return React.createElement(
      'div',
      { className: 'shower-container' },
      React.createElement(
        'div',
        { className: 'shower-chart-area' },
        React.createElement(
          bs.Tabs,
          {
            position: 'top',
            tabWidth: 10,
            activeKey: activeSessionFilter,
            onSelect: function onSelect(val) {
              setSessionFilter(val);
            }
          },
          sessionFilters.map(function (metric) {
            return React.createElement(bs.Tab, {
              key: metric.id,
              eventKey: metric.id,
              title: _t(metric.title)
            });
          })
        ),
        React.createElement(LineChart, {
          height: 300,
          width: width,
          theme: theme,
          xAxis: {
            data: chartCategories,
            boundaryGap: true
          },
          yAxis: {
            min: 0,
            formatter: chartFormatter
          },
          series: [{
            name: _t('section.shower') + ' ' + id,
            data: chartData,
            fill: 0.55
          }]
        })
      ),
      React.createElement(SessionDetails, props)
    );
  }
  return React.createElement(
    'div',
    { className: 'shower-container' },
    React.createElement(
      'div',
      { className: 'meter-chart-area' },
      React.createElement(
        'div',
        { className: 'limited-data-text' },
        React.createElement(
          'h4',
          null,
          React.createElement(
            'div',
            null,
            min ? React.createElement(
              'h5',
              null,
              React.createElement('i', { className: 'fa fa-check green ' }),
              '\xA0\xA0',
              React.createElement(FormattedMessage, {
                id: 'history.consumption-min',
                values: { period: _t('periods.' + period).toLowerCase() }
              })
            ) : React.createElement('span', null),
            max ? React.createElement(
              'h5',
              null,
              React.createElement('img', { src: IMAGES + '/warning.svg', alt: 'warn' }),
              '\xA0\xA0',
              React.createElement(FormattedMessage, {
                id: 'history.consumption-max',
                values: { period: _t('periods.' + period).toLowerCase() }
              })
            ) : React.createElement('span', null)
          ),
          React.createElement('br', null),
          React.createElement(BetterOrWorse, {
            better: better,
            percentDifference: percentDifference,
            period: period,
            _t: _t
          })
        )
      )
    ),
    React.createElement(SessionDetails, props)
  );
}

var SessionModal = _wrapComponent('_component')(React.createClass({
  displayName: 'SessionModal',

  onClose: function onClose() {
    this.props.resetActiveSession();
    this.props.disableEditShower();
  },
  onNext: function onNext() {
    var _props$data$next = _slicedToArray(this.props.data.next, 3),
        device = _props$data$next[0],
        id = _props$data$next[1],
        timestamp = _props$data$next[2];

    this.props.setActiveSession(device, id, timestamp);
  },
  onPrevious: function onPrevious() {
    var _props$data$prev = _slicedToArray(this.props.data.prev, 3),
        device = _props$data$prev[0],
        id = _props$data$prev[1],
        timestamp = _props$data$prev[2];

    this.props.setActiveSession(device, id, timestamp);
  },
  render: function render() {
    var _this = this;

    var _props = this.props,
        data = _props.data,
        activeDeviceType = _props.activeDeviceType;

    if (!data) return React.createElement('div', null);
    var next = data.next,
        prev = data.prev;

    var disabledNext = !Array.isArray(next);
    var disabledPrevious = !Array.isArray(prev);
    return React.createElement(
      bs.Modal,
      {
        animation: false,
        show: this.props.showModal,
        onHide: this.onClose,
        dialogClassName: activeDeviceType === 'AMPHIRO' ? 'shower-modal' : 'session-modal',
        bsSize: 'large',
        onKeyDown: function onKeyDown(e) {
          if (e.keyCode === 39 && !disabledNext) {
            _this.onNext();
          } else if (e.keyCode === 37 && !disabledPrevious) {
            _this.onPrevious();
          }
        }
      },
      React.createElement(
        bs.Modal.Header,
        { closeButton: true },
        React.createElement(
          bs.Modal.Title,
          null,
          data.id ? React.createElement(
            'span',
            null,
            React.createElement(
              'div',
              null,
              React.createElement('img', { src: IMAGES + '/shower.svg', alt: 'shower' }),
              '\xA0\xA0',
              React.createElement(FormattedMessage, { id: 'section.shower' }),
              React.createElement(
                'span',
                null,
                ' #' + data.id
              )
            )
          ) : React.createElement(FormattedMessage, { id: 'section.shower-aggregated' })
        )
      ),
      React.createElement(
        bs.Modal.Body,
        null,
        React.createElement(
          'div',
          { ref: function ref(el) {
              _this.el = el;
            } },
          React.createElement(Session, _extends({}, this.props, { width: this.el ? this.el.clientWidth : '100%' }))
        )
      ),
      React.createElement(
        bs.Modal.Footer,
        null,
        disabledPrevious ? React.createElement('span', null) : React.createElement(
          'button',
          {
            className: 'btn-a pull-left',
            onClick: this.onPrevious
          },
          React.createElement(FormattedMessage, { id: 'forms.previous' })
        ),
        disabledNext ? React.createElement('span', null) : React.createElement(
          'button',
          {
            className: 'btn-a pull-right',
            onClick: this.onNext
          },
          React.createElement(FormattedMessage, { id: 'forms.next' })
        )
      )
    );
  }
}));

module.exports = SessionModal;