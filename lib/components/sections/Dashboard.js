'use strict';

var _react2 = require('react');

var _react3 = _interopRequireDefault(_react2);

var _babelTransform = require('livereactload/babel-transform');

var _babelTransform2 = _interopRequireDefault(_babelTransform);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _components = {
  _component: {},
  _component2: {}
};

var _livereactloadBabelTransform2 = (0, _babelTransform2.default)({
  filename: 'components/sections/Dashboard.js',
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
    FormattedRelative = _require.FormattedRelative;

var _require2 = require('react-grid-layout'),
    Responsive = _require2.Responsive,
    WidthProvider = _require2.WidthProvider;

var _require3 = require('react-router'),
    Link = _require3.Link;

var MainSection = require('../layout/MainSection');

var _require4 = require('../helpers/Widgets'),
    Widget = _require4.Widget;

var _require5 = require('../../constants/HomeConstants'),
    IMAGES = _require5.IMAGES;

var ResponsiveGridLayout = WidthProvider(Responsive);

function ErrorDisplay(props) {
  return props.errors ? React.createElement(
    'div',
    { style: { zIndex: 100 } },
    React.createElement('img', { src: IMAGES + '/alert.svg', alt: 'error' }),
    React.createElement(
      'span',
      { className: 'widget-error' },
      '' + props.errors
    )
  ) : React.createElement('div', null);
}

/* Be Polite, greet user */
function SayHello(props) {
  return React.createElement(
    'div',
    { style: { margin: '40px 30px 20px 30px' } },
    React.createElement(
      'h3',
      null,
      React.createElement(FormattedMessage, {
        id: 'dashboard.hello',
        values: { name: props.firstname }
      })
    )
  );
}

var WidgetItem = _wrapComponent('_component')(React.createClass({
  displayName: 'WidgetItem',

  getInitialState: function getInitialState() {
    return {
      el: null
    };
  },
  render: function render() {
    var _this = this;

    var _props = this.props,
        widget = _props.widget,
        updateWidgetAndFetch = _props.updateWidgetAndFetch,
        removeWidget = _props.removeWidget,
        _t = _props._t,
        linkToHistory = _props.linkToHistory,
        width = _props.width;
    var id = widget.id,
        icon = widget.icon,
        error = widget.error,
        period = widget.period,
        title = widget.title,
        type = widget.type,
        display = widget.display,
        periods = widget.periods,
        time = widget.time,
        timeDisplay = widget.timeDisplay;

    return React.createElement(
      'div',
      {
        className: 'widget',
        ref: function ref(el) {
          if (!_this.state.el) {
            _this.setState({ el: el });
          }
        }
      },
      React.createElement(
        'div',
        { className: 'widget-header' },
        React.createElement(
          'div',
          { className: 'header-left' },
          React.createElement(
            'h4',
            null,
            icon ? React.createElement('img', {
              style: { marginRight: 10, maxHeight: 25 },
              src: IMAGES + '/' + icon,
              alt: 'icon'
            }) : React.createElement('i', null),
            title
          )
        ),
        React.createElement(
          'div',
          { className: 'header-right' },
          React.createElement(
            'div',
            null,
            timeDisplay,
            periods && periods.map(function (p) {
              return React.createElement(
                'a',
                {
                  key: p.id,
                  onClick: function onClick() {
                    return updateWidgetAndFetch(id, { period: p.id });
                  },
                  style: { marginLeft: 5 }
                },
                p.id === period ? React.createElement(
                  'u',
                  null,
                  _t(p.title)
                ) : _t(p.title)
              );
            })
          ),
          React.createElement(
            'a',
            {
              className: 'widget-x',
              style: { float: 'right', marginLeft: 5, marginRight: 5 },
              onClick: function onClick() {
                return removeWidget(widget.id);
              }
            },
            React.createElement('i', { className: 'fa fa-times' })
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'widget-body' },
        error ? React.createElement(ErrorDisplay, { errors: error }) : React.createElement(Widget, _extends({}, widget, {
          width: this.state.el ? this.state.el.clientWidth : '100%',
          height: this.state.el ? this.state.el.clientHeight - 90 : null
        }))
      ),
      React.createElement(
        'div',
        { className: 'widget-footer' },
        React.createElement(
          'a',
          { onClick: function onClick() {
              return linkToHistory(widget);
            } },
          widget.more || 'See more'
        )
      )
    );
  }
}));

function WidgetPanel(props) {
  var _t = props._t,
      mode = props.mode,
      layout = props.layout,
      widgets = props.widgets,
      updateLayout = props.updateLayout,
      updateWidgetAndFetch = props.updateWidgetAndFetch,
      removeWidget = props.removeWidget,
      periods = props.periods,
      linkToHistory = props.linkToHistory,
      width = props.width;

  return React.createElement(
    ResponsiveGridLayout,
    {
      className: 'layout',
      layouts: { lg: layout, md: layout, sm: layout },
      breakpoints: { lg: 1080, md: 650, sm: 200 },
      cols: { lg: 4, md: 4, sm: 2 },
      rowHeight: 160,
      measureBeforeMount: true,
      draggableHandle: '.widget-header',
      resizable: true,
      draggable: true,
      onResizeStop: function onResizeStop(newLayout) {
        updateLayout(newLayout);
      },
      onDragStop: function onDragStop(newLayout) {
        updateLayout(newLayout);
      },
      onLayoutChange: function onLayoutChange(newLayout) {},
      onBreakpointChange: function onBreakpointChange(newBreakpoint) {}
    },
    widgets.map(function (widget) {
      return React.createElement(
        'div',
        { key: widget.id },
        React.createElement(WidgetItem, {
          mode: mode,
          periods: periods,
          widget: widget,
          updateWidgetAndFetch: updateWidgetAndFetch,
          removeWidget: removeWidget,
          _t: _t,
          linkToHistory: linkToHistory,
          width: width
        })
      );
    })
  );
}

function ButtonToolbar(props) {
  var switchMode = props.switchMode,
      resetDirty = props.resetDirty,
      saveToProfile = props.saveToProfile,
      dirty = props.dirty;

  return React.createElement(
    'div',
    { className: 'dashboard-button-toolbar' },
    React.createElement(
      'a',
      {
        className: 'btn dashboard-add-btn',
        onClick: function onClick() {
          return switchMode('add');
        },
        active: false
      },
      'Add Widget'
    ),
    dirty ? React.createElement(
      'div',
      { className: 'dashboard-save' },
      React.createElement(
        'h6',
        null,
        'Save changes?'
      ),
      React.createElement(
        'div',
        { className: 'dashboard-save-prompt' },
        React.createElement(
          'button',
          {
            className: 'btn dashboard-save-btn',
            onClick: function onClick() {
              saveToProfile().then(function () {
                return resetDirty();
              });
            },
            active: false
          },
          'Yes'
        ),
        React.createElement(
          'button',
          {
            className: 'btn dashboard-discard-btn',
            onClick: function onClick() {
              return resetDirty();
            },
            active: false
          },
          'No'
        )
      )
    ) : React.createElement('div', null)
  );
}

function AddWidgetForm(props) {
  var widgetToAdd = props.widgetToAdd,
      widgetTypes = props.widgetTypes,
      deviceTypes = props.deviceTypes,
      setForm = props.setForm,
      activeDeviceType = props.activeDeviceType,
      setDeviceType = props.setDeviceType,
      setWidgetToAdd = props.setWidgetToAdd,
      onSubmit = props.onSubmit;
  var title = widgetToAdd.title,
      description = widgetToAdd.description,
      id = widgetToAdd.id;

  return React.createElement(
    'form',
    { onSubmit: onSubmit },
    React.createElement(
      bs.Tabs,
      {
        className: 'history-time-nav',
        position: 'top',
        tabWidth: 3,
        activeKey: activeDeviceType,
        onSelect: function onSelect(key) {
          return setDeviceType(key);
        }
      },
      deviceTypes.map(function (devType) {
        return React.createElement(bs.Tab, {
          key: devType.id,
          eventKey: devType.id,
          title: devType.title
        });
      })
    ),
    React.createElement(
      'div',
      { className: 'add-widget' },
      React.createElement(
        'div',
        { className: 'add-widget-left' },
        React.createElement(
          'div',
          null,
          React.createElement(
            'ul',
            { className: 'add-widget-types' },
            widgetTypes.map(function (t, idx) {
              return React.createElement(
                'li',
                { key: idx },
                React.createElement(
                  'a',
                  {
                    className: id === t.id ? 'selected' : '',
                    onClick: function onClick() {
                      return setWidgetToAdd(t);
                    },
                    value: t.id
                  },
                  t.title
                )
              );
            })
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'add-widget-right' },
        React.createElement(
          'div',
          { style: { padding: 10 } },
          React.createElement('input', {
            type: 'text',
            placeholder: 'Enter title...',
            readOnly: title == null,
            value: title,
            onChange: function onChange(e) {
              return setWidgetToAdd({ title: e.target.value });
            }
          }),
          React.createElement(
            'p',
            null,
            description
          )
        )
      )
    )
  );
}

function AddWidgetModal(props) {
  var widgetToAdd = props.widgetToAdd,
      showModal = props.showModal,
      switchMode = props.switchMode,
      addWidget = props.addWidget,
      metrics = props.metrics,
      widgetTypes = props.widgetTypes,
      deviceTypes = props.deviceTypes,
      setForm = props.setForm,
      activeDeviceType = props.activeDeviceType,
      setDeviceType = props.setDeviceType,
      setWidgetToAdd = props.setWidgetToAdd;


  var onSubmit = function onSubmit(e) {
    e.preventDefault();
    addWidget(widgetToAdd);
    switchMode('normal');
  };
  return React.createElement(
    bs.Modal,
    {
      animation: false,
      className: 'add-widget-modal',
      show: showModal, onHide: function onHide() {
        return switchMode('normal');
      },
      bsSize: 'large',
      backdrop: 'static'
    },
    React.createElement(
      bs.Modal.Header,
      { closeButton: true },
      React.createElement(
        bs.Modal.Title,
        null,
        React.createElement(FormattedMessage, { id: 'dashboard.add' })
      )
    ),
    React.createElement(
      bs.Modal.Body,
      null,
      React.createElement(AddWidgetForm, {
        metrics: metrics,
        widgetToAdd: widgetToAdd,
        widgetTypes: widgetTypes,
        deviceTypes: deviceTypes,
        setForm: setForm,
        setDeviceType: setDeviceType,
        activeDeviceType: activeDeviceType,
        setWidgetToAdd: setWidgetToAdd,
        onSubmit: onSubmit

      })
    ),
    React.createElement(
      bs.Modal.Footer,
      null,
      React.createElement(
        'a',
        { onClick: function onClick() {
            return switchMode('normal');
          } },
        'Cancel'
      ),
      React.createElement(
        'a',
        {
          style: { marginLeft: 20 },
          onClick: onSubmit
        },
        'Add'
      )
    )
  );
}

var Dashboard = _wrapComponent('_component2')(React.createClass({
  displayName: 'Dashboard',

  //mixins: [ PureRenderMixin ],

  componentWillMount: function componentWillMount() {
    var _this2 = this;

    this.props.widgets.forEach(function (widget) {
      if (widget.synced === false) {
        _this2.props.fetchWidgetData(widget.id);
      }
    });
  },

  render: function render() {
    var _props2 = this.props,
        firstname = _props2.firstname,
        mode = _props2.mode,
        dirty = _props2.dirty,
        switchMode = _props2.switchMode,
        addWidget = _props2.addWidget,
        saveToProfile = _props2.saveToProfile,
        setDirty = _props2.setDirty,
        resetDirty = _props2.resetDirty,
        deviceCount = _props2.deviceCount,
        meterCount = _props2.meterCount,
        metrics = _props2.metrics,
        widgetTypes = _props2.widgetTypes,
        deviceTypes = _props2.deviceTypes,
        widgetToAdd = _props2.widgetToAdd,
        setForm = _props2.setForm,
        activeDeviceType = _props2.activeDeviceType,
        setDeviceType = _props2.setDeviceType,
        setWidgetToAdd = _props2.setWidgetToAdd;

    return React.createElement(
      MainSection,
      { id: 'section.dashboard' },
      React.createElement(
        'div',
        { className: 'dashboard' },
        React.createElement(
          'div',
          { className: 'dashboard-infopanel' },
          React.createElement(SayHello, { firstname: firstname }),
          React.createElement(AddWidgetModal, {
            showModal: mode === 'add',
            switchMode: switchMode,
            addWidget: addWidget,
            widgetToAdd: widgetToAdd,
            metrics: metrics,
            widgetTypes: widgetTypes,
            deviceTypes: deviceTypes,
            setForm: setForm,
            activeDeviceType: activeDeviceType,
            setDeviceType: setDeviceType,
            setWidgetToAdd: setWidgetToAdd
          }),
          React.createElement(WidgetPanel, this.props)
        ),
        React.createElement(
          'div',
          { className: 'dashboard-right' },
          React.createElement(
            'div',
            { className: 'dashboard-device-info' },
            React.createElement(
              Link,
              { to: '/settings/devices' },
              React.createElement(
                'h6',
                null,
                React.createElement('img', { src: IMAGES + '/amphiro_small.svg', alt: 'devices' }),
                React.createElement(
                  'span',
                  null,
                  function () {
                    if (deviceCount > 1) {
                      return deviceCount + ' devices';
                    } else if (deviceCount === 1) {
                      return '1 device';
                    }
                    return 'No devices';
                  }()
                )
              )
            ),
            React.createElement(
              Link,
              { to: '/settings/devices' },
              React.createElement(
                'h6',
                null,
                React.createElement('img', { src: IMAGES + '/water-meter.svg', alt: 'meters' }),
                React.createElement(
                  'span',
                  null,
                  function () {
                    if (meterCount > 1) {
                      return meterCount + ' SWMs';
                    } else if (meterCount === 1) {
                      return '1 SWM';
                    }
                    return 'No SWMs';
                  }()
                )
              )
            )
          ),
          React.createElement(ButtonToolbar, {
            switchMode: switchMode,
            setDirty: setDirty,
            resetDirty: resetDirty,
            saveToProfile: saveToProfile,
            mode: mode,
            dirty: dirty
          })
        )
      )
    );
  }
}));

module.exports = Dashboard;