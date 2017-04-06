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
  filename: 'components/sections/404.js',
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

var _require2 = require('react-router'),
    Link = _require2.Link;

var MainSection = require('../layout/MainSection');

var _require3 = require('../../constants/HomeConstants'),
    IMAGES = _require3.IMAGES;

var NUM = 10;
var RATE = 800;

var NotFound = _wrapComponent('_component')(React.createClass({
  displayName: 'NotFound',

  render: function render() {
    return React.createElement(
      MainSection,
      { id: 'section.login' },
      React.createElement(
        'div',
        { className: 'form-login-container' },
        React.createElement(
          'div',
          null,
          React.createElement(
            'h3',
            null,
            'Nothing to see here'
          ),
          React.createElement(
            'div',
            { className: 'link-reset' },
            React.createElement(
              Link,
              { to: '/' },
              'Move along'
            )
          )
        )
      )
    );
  }
}));

module.exports = NotFound;