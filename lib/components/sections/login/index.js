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
  filename: 'components/sections/login/index.js',
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
    FormattedMessage = _require.FormattedMessage;

var MainSection = require('../../layout/MainSection');

var _require2 = require('../../../constants/HomeConstants'),
    IMAGES = _require2.IMAGES;

var Login = _wrapComponent('_component')(React.createClass({
  displayName: 'Login',

  render: function render() {
    var _props = this.props,
        _t = _props._t,
        intl = _props.intl,
        errors = _props.errors,
        info = _props.info,
        children = _props.children;

    return React.createElement(
      MainSection,
      { id: 'section.login' },
      React.createElement(
        'div',
        { className: 'form-login-container' },
        React.cloneElement(children, this.props),
        React.createElement(
          'div',
          { className: 'login-errors' },
          info ? React.createElement(
            'span',
            null,
            React.createElement('img', { src: IMAGES + '/info.svg', alt: 'info' }),
            React.createElement(FormattedMessage, { id: 'info.' + info })
          ) : React.createElement('div', null),
          errors ? React.createElement(
            'span',
            null,
            React.createElement('img', { src: IMAGES + '/warning.svg', alt: 'error' }),
            React.createElement(FormattedMessage, { id: 'errors.' + errors })
          ) : React.createElement('div', null)
        )
      )
    );
  }
}));

module.exports = Login;