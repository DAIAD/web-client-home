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
  filename: 'components/sections/dashboard/index.js',
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

var _require2 = require('react-router'),
    Link = _require2.Link;

var MainSection = require('../../layout/MainSection');
var AddWidgetModal = require('./AddWidget');
var WidgetPanel = require('./WidgetPanel');
var SayHello = require('./SayHello');

var _require3 = require('../../../constants/HomeConstants'),
    IMAGES = _require3.IMAGES;

var Dashboard = _wrapComponent('_component')(React.createClass({
  displayName: 'Dashboard',

  //mixins: [ PureRenderMixin ],

  componentWillMount: function componentWillMount() {
    var _this = this;

    this.props.widgets.forEach(function (widget) {
      if (widget.synced === false) {
        _this.props.fetchWidgetData(widget.id);
      }
    });
  },

  render: function render() {
    var _props = this.props,
        firstname = _props.firstname,
        mode = _props.mode,
        dirty = _props.dirty,
        switchMode = _props.switchMode,
        addWidget = _props.addWidget,
        saveToProfile = _props.saveToProfile,
        setDirty = _props.setDirty,
        resetDirty = _props.resetDirty,
        deviceCount = _props.deviceCount,
        meterCount = _props.meterCount,
        metrics = _props.metrics,
        widgetTypes = _props.widgetTypes,
        deviceTypes = _props.deviceTypes,
        widgetToAdd = _props.widgetToAdd,
        setForm = _props.setForm,
        activeDeviceType = _props.activeDeviceType,
        setDeviceType = _props.setDeviceType,
        setWidgetToAdd = _props.setWidgetToAdd,
        resetWidgetToAdd = _props.resetWidgetToAdd,
        _t = _props._t;

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
            setWidgetToAdd: setWidgetToAdd,
            resetWidgetToAdd: resetWidgetToAdd,
            _t: _t
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
                function () {
                  if (deviceCount > 1) {
                    return React.createElement(
                      'span',
                      null,
                      React.createElement('img', { src: IMAGES + '/amphiro_small.svg', alt: 'devices' }),
                      deviceCount,
                      ' ',
                      React.createElement(FormattedMessage, { id: 'devices.amphiros' })
                    );
                  } else if (deviceCount === 1) {
                    return React.createElement(
                      'span',
                      null,
                      React.createElement('img', { src: IMAGES + '/amphiro_small.svg', alt: 'devices' }),
                      '1 ',
                      React.createElement(FormattedMessage, { id: 'devices.amphiro' })
                    );
                  }
                  return React.createElement('span', null);
                }()
              )
            ),
            React.createElement(
              Link,
              { to: '/settings/devices' },
              React.createElement(
                'h6',
                null,
                function () {
                  if (meterCount > 1) {
                    return React.createElement(
                      'span',
                      null,
                      React.createElement('img', { src: IMAGES + '/water-meter.svg', alt: 'meters' }),
                      meterCount,
                      ' ',
                      React.createElement(FormattedMessage, { id: 'devices.meters' })
                    );
                  } else if (meterCount === 1) {
                    return React.createElement(
                      'span',
                      null,
                      React.createElement('img', { src: IMAGES + '/water-meter.svg', alt: 'meters' }),
                      '1 ',
                      React.createElement(FormattedMessage, { id: 'devices.meter' })
                    );
                  }
                  return React.createElement('span', null);
                }()
              )
            )
          ),
          React.createElement(
            'div',
            { className: 'dashboard-button-toolbar' },
            React.createElement(
              'button',
              {
                className: 'btn dashboard-add-btn',
                onClick: function onClick() {
                  return switchMode('add');
                },
                active: false
              },
              React.createElement(FormattedMessage, { id: 'dashboard.add' })
            ),
            dirty ? React.createElement(
              'div',
              { className: 'dashboard-save' },
              React.createElement('img', { src: IMAGES + '/info.svg', alt: 'info', style: { float: 'left', width: 22 } }),
              React.createElement(
                'h6',
                null,
                React.createElement(FormattedMessage, { id: 'dashboard.save' })
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
                  React.createElement(FormattedMessage, { id: 'forms.yes' })
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
                  React.createElement(FormattedMessage, { id: 'forms.no' })
                )
              )
            ) : React.createElement('div', null)
          )
        )
      )
    );
  }
}));

module.exports = Dashboard;