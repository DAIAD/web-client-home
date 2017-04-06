'use strict';

var _react2 = require('react');

var _react3 = _interopRequireDefault(_react2);

var _babelTransform = require('livereactload/babel-transform');

var _babelTransform2 = _interopRequireDefault(_babelTransform);

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _components = {
  _component: {}
};

var _livereactloadBabelTransform2 = (0, _babelTransform2.default)({
  filename: 'components/sections/Session.js',
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
    FormattedMessage = _require.FormattedMessage,
    FormattedTime = _require.FormattedTime,
    FormattedDate = _require.FormattedDate;

var DatetimeInput = require('react-datetime');

var _require2 = require('react-echarts'),
    LineChart = _require2.LineChart;

var theme = require('../chart/themes/session');

var _require3 = require('../../utils/general'),
    volumeToPictures = _require3.volumeToPictures,
    energyToPictures = _require3.energyToPictures,
    getMetricMu = _require3.getMetricMu;

var _require4 = require('../../constants/HomeConstants'),
    IMAGES = _require4.IMAGES;

function Picture(props) {
  var display = props.display,
      items = props.items,
      metric = props.metric,
      remaining = props.remaining,
      _props$iconSuffix = props.iconSuffix,
      iconSuffix = _props$iconSuffix === undefined ? '' : _props$iconSuffix,
      _t = props._t;

  return React.createElement('img', {
    src: IMAGES + '/' + display + iconSuffix + '.svg',
    className: ['picture', display].join(' '),
    title: _t('history.inPicturesHover', {
      number: items,
      metric: _t('common.' + metric),
      scale: _t('history.' + display)
    }),
    alt: display
  });
}

function InPictures(props) {
  var display = props.display,
      items = props.items,
      remaining = props.remaining,
      metric = props.metric;

  return React.createElement(
    'div',
    { className: 'in-pictures' },
    Array.from({ length: items }).map(function (v, i) {
      return React.createElement(Picture, props);
    }),
    function () {
      if (remaining === 0.25) {
        return React.createElement(Picture, _extends({}, props, { iconSuffix: '-25' }));
      } else if (remaining === 0.5) {
        return React.createElement(Picture, _extends({}, props, { iconSuffix: '-50' }));
      } else if (remaining === 0.75) {
        return React.createElement(Picture, _extends({}, props, { iconSuffix: '-75' }));
      }
      return React.createElement('i', null);
    }()
  );
}

function SessionInfoLine(props) {
  var id = props.id,
      name = props.name,
      title = props.title,
      icon = props.icon,
      data = props.data,
      _t = props._t;

  return data == null ? React.createElement('div', null) : React.createElement(
    'li',
    { className: 'session-item' },
    React.createElement(
      'span',
      null,
      React.createElement(
        'h4',
        { style: { float: 'left' } },
        React.createElement('img', {
          style: {
            height: id === 'temperature' ? 30 : 24,
            marginLeft: id === 'temperature' ? 7 : 0,
            marginRight: 20
          },
          src: IMAGES + '/' + icon,
          alt: name
        }),
        React.createElement(FormattedMessage, { id: title })
      ),
      function () {
        if (id === 'difference' || id === 'volume') {
          return React.createElement(InPictures, _extends({}, volumeToPictures(data), { metric: id, _t: _t }));
        } else if (id === 'energy') {
          return React.createElement(InPictures, _extends({}, energyToPictures(data), { metric: id, _t: _t }));
        }
        return React.createElement('span', null);
      }(),
      React.createElement(
        'h4',
        { style: { float: 'right' } },
        data,
        ' ',
        React.createElement(
          'span',
          null,
          getMetricMu(id)
        )
      )
    )
  );
}

function Member(props) {
  var deviceKey = props.deviceKey,
      sessionId = props.sessionId,
      member = props.member,
      memberFilter = props.memberFilter,
      members = props.members,
      assignToMember = props.assignToMember,
      editShower = props.editShower,
      disableEditShower = props.disableEditShower,
      fetchAndSetQuery = props.fetchAndSetQuery;

  return React.createElement(
    'div',
    { className: 'headline-user' },
    React.createElement('i', { className: 'fa fa-user' }),
    editShower ? React.createElement(
      'div',
      { style: { float: 'right' } },
      React.createElement(
        bs.DropdownButton,
        {
          title: member,
          id: 'shower-user-switcher',
          onSelect: function onSelect(e, val) {
            assignToMember({
              deviceKey: deviceKey,
              sessionId: sessionId,
              memberIndex: val
            }).then(function () {
              return fetchAndSetQuery({ active: memberFilter === 'all' ? [deviceKey, sessionId] : null });
            }).then(function () {
              return disableEditShower();
            });
          }
        },
        members.map(function (m) {
          return React.createElement(
            bs.MenuItem,
            {
              key: m.id,
              eventKey: m.index,
              value: m.index
            },
            m.name
          );
        })
      )
    ) : React.createElement(
      'div',
      { style: { float: 'right' } },
      React.createElement(
        'span',
        { style: { margin: '0 15px' } },
        member
      )
    )
  );
}

function SessionInfo(props) {
  var _t = props._t,
      data = props.data,
      activeDeviceType = props.activeDeviceType,
      members = props.members,
      editShower = props.editShower,
      setSessionFilter = props.setSessionFilter,
      assignToMember = props.assignToMember,
      enableEditShower = props.enableEditShower,
      disableEditShower = props.disableEditShower,
      ignoreShower = props.ignoreShower,
      memberFilter = props.memberFilter,
      fetchAndSetQuery = props.fetchAndSetQuery,
      nextReal = props.nextReal,
      setShowerReal = props.setShowerReal,
      setShowerTimeForm = props.setShowerTimeForm,
      showerTime = props.showerTime,
      metrics = props.metrics;
  var deviceKey = data.device,
      sessionId = data.id,
      member = data.member,
      history = data.history;


  return !data ? React.createElement('div', null) : React.createElement(
    'div',
    { className: 'shower-info' },
    activeDeviceType === 'AMPHIRO' && editShower ? React.createElement(
      'div',
      { className: 'ignore-shower' },
      React.createElement(
        'a',
        {
          onClick: function onClick() {
            return ignoreShower({
              deviceKey: deviceKey,
              sessionId: sessionId
            }).then(function () {
              return fetchAndSetQuery({ active: [deviceKey, sessionId] });
            }).then(function () {
              return disableEditShower();
            });
          }
        },
        'Delete shower'
      )
    ) : React.createElement('span', null),
    React.createElement(
      'div',
      { className: 'headline' },
      activeDeviceType === 'AMPHIRO' ? React.createElement(
        'div',
        { className: 'edit-shower-control' },
        editShower ? React.createElement(
          'a',
          { onClick: disableEditShower },
          React.createElement('i', { className: 'fa fa-times' })
        ) : React.createElement(
          'a',
          { onClick: enableEditShower },
          React.createElement('i', { className: 'fa fa-pencil' })
        )
      ) : React.createElement('div', null),
      React.createElement(Member, {
        deviceKey: deviceKey,
        sessionId: sessionId,
        member: member,
        memberFilter: memberFilter,
        members: members,
        assignToMember: assignToMember,
        editShower: editShower,
        enableEditShower: enableEditShower,
        disableEditShower: disableEditShower,
        fetchAndSetQuery: fetchAndSetQuery
      }),
      activeDeviceType === 'AMPHIRO' ? React.createElement(
        'span',
        { className: 'headline-date' },
        React.createElement('i', { className: 'fa fa-calendar' }),
        editShower && history ? React.createElement(
          'span',
          null,
          React.createElement(DatetimeInput, {
            dateFormat: 'DD/MM/YYYY',
            timeFormat: 'HH:mm',
            className: 'headline-date-input',
            inputProps: { size: 18 },
            value: showerTime,
            isValidDate: function isValidDate(curr) {
              return nextReal ? curr.valueOf() <= nextReal.timestamp : curr.valueOf() <= new Date().valueOf();
            },
            isValidTime: function isValidTime(curr) {
              return nextReal ? curr.valueOf() <= nextReal.timestamp : curr.valueOf() <= new Date().valueOf();
            },
            onChange: function onChange(val) {
              setShowerTimeForm(val.valueOf());
            }
          }),
          '\xA0',
          React.createElement(
            'a',
            {
              onClick: function onClick() {
                return setShowerReal({
                  deviceKey: deviceKey,
                  sessionId: sessionId,
                  timestamp: showerTime
                }).then(function () {
                  return fetchAndSetQuery({ active: [deviceKey, sessionId] });
                }).then(function () {
                  return disableEditShower();
                });
              }
            },
            'Set'
          )
        ) : React.createElement(
          'span',
          null,
          React.createElement(FormattedDate, {
            value: new Date(data.timestamp),
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
          }),
          '\xA0',
          React.createElement(FormattedTime, { value: new Date(data.timestamp) })
        )
      ) : React.createElement(
        'span',
        { className: 'headline-date' },
        React.createElement('i', { className: 'fa fa-calendar' }),
        data.date
      )
    ),
    React.createElement('br', null),
    React.createElement(
      'ul',
      { className: 'sessions-list' },
      metrics.map(function (metric) {
        return React.createElement(SessionInfoLine, {
          key: metric.id,
          _t: _t,
          icon: metric.icon,
          title: metric.title,
          id: metric.id,
          data: data[metric.id],
          details: metric.details
        });
      })
    )
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
  var arrowClass = void 0;

  if (better == null) {
    arrowClass = '';
  } else if (better) {
    arrowClass = 'fa fa-arrow-down green';
  } else {
    arrowClass = 'fa fa-arrow-up red';
  }
  var percentDifference = data.percentDiff != null ? ' ' + Math.abs(data.percentDiff) + '%' : '';

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
            React.createElement('i', { className: arrowClass }),
            React.createElement(
              'b',
              null,
              percentDifference
            ),
            React.createElement(
              'span',
              null,
              better != null ? '  ' + betterStr + ' than last shower' : 'No comparison data'
            )
          )
        )
      ),
      React.createElement(SessionInfo, props)
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
          series: [{ name: _t('section.shower') + ' ' + id, data: chartData, fill: 0.55 }]
        })
      ),
      React.createElement(SessionInfo, props)
    );
  }
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
              React.createElement(
                'span',
                null,
                _t('periods.' + period) + ' with minimum consumption. Well done!'
              )
            ) : React.createElement('span', null),
            max ? React.createElement(
              'h5',
              null,
              React.createElement('img', { src: IMAGES + '/warning.svg', alt: 'warn' }),
              '\xA0\xA0',
              React.createElement(
                'span',
                null,
                _t('periods.' + period) + ' with maximum consumption'
              )
            ) : React.createElement('span', null)
          ),
          React.createElement('br', null),
          React.createElement(
            'div',
            null,
            React.createElement('i', { className: arrowClass }),
            React.createElement(
              'b',
              null,
              percentDifference
            ),
            better != null ? '  ' + betterStr + ' than last measurement!' : 'No comparison data'
          )
        )
      )
    ),
    React.createElement(SessionInfo, props)
  );
}

var SessionModal = _wrapComponent('_component')(React.createClass({
  displayName: 'SessionModal',

  onClose: function onClose() {
    this.props.resetActiveSession();
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

    var data = this.props.data;

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
        dialogClassName: 'session-modal',
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
            data.ignored ? React.createElement(
              'span',
              null,
              'Not a shower!'
            ) : React.createElement(
              'div',
              null,
              React.createElement(FormattedMessage, { id: 'section.shower' }),
              React.createElement(
                'span',
                null,
                ' ' + data.id
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
          'a',
          { className: 'pull-left', onClick: this.onPrevious },
          'Previous'
        ),
        disabledNext ? React.createElement('span', null) : React.createElement(
          'a',
          { className: 'pull-right', onClick: this.onNext },
          'Next'
        )
      )
    );
  }
}));

module.exports = SessionModal;