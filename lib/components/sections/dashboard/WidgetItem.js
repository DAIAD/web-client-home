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
  filename: 'components/sections/dashboard/WidgetItem.js',
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

var _require = require('../../helpers/Widgets'),
    Widget = _require.Widget;

var _require2 = require('../../../constants/HomeConstants'),
    IMAGES = _require2.IMAGES;

function WidgetErrorDisplay(props) {
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
        linkToSection = _props.linkToSection,
        width = _props.width;
    var id = widget.id,
        widgetId = widget.widgetId,
        icon = widget.icon,
        error = widget.error,
        period = widget.period,
        type = widget.type,
        display = widget.display,
        periods = widget.periods,
        time = widget.time,
        timeDisplay = widget.timeDisplay,
        _widget$linkTo = widget.linkTo,
        linkTo = _widget$linkTo === undefined ? 'history' : _widget$linkTo;

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
            'h5',
            null,
            icon ? React.createElement('img', {
              className: 'widget-header-icon',
              src: icon,
              alt: 'icon'
            }) : React.createElement('i', null),
            widget.title || _t('widget.titles.' + widgetId)
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
                'button',
                {
                  className: 'btn-a widget-period ' + (p.id === period ? 'active' : ''),
                  key: p.id,
                  onClick: function onClick() {
                    return updateWidgetAndFetch(id, { period: p.id });
                  }
                },
                _t(p.title)
              );
            }),
            React.createElement(
              'button',
              {
                className: 'btn-a widget-x',
                onClick: function onClick() {
                  return removeWidget(widget.id);
                }
              },
              React.createElement('i', { className: 'fa fa-times' })
            )
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'widget-body' },
        error ? React.createElement(WidgetErrorDisplay, { errors: error }) : React.createElement(Widget, _extends({}, widget, {
          imgPrefix: IMAGES,
          width: this.state.el ? this.state.el.clientWidth : '100%',
          height: this.state.el ? this.state.el.clientHeight - 90 : null
        }))
      ),
      React.createElement(
        'div',
        { className: 'widget-footer' },
        React.createElement(
          'button',
          {
            className: 'btn-a',
            onClick: function onClick() {
              return linkToSection(linkTo, widget);
            }
          },
          widget.more || _t('widget.explore')
        )
      )
    );
  }
}));

module.exports = WidgetItem;