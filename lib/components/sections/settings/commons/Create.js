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
  filename: 'components/sections/settings/commons/Create.js',
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

var CommonFormFields = require('./Form');

var CreateCommons = _wrapComponent('_component')(React.createClass({
  displayName: 'CreateCommons',

  componentWillMount: function componentWillMount() {
    this.props.actions.clearCommonForm();
  },
  render: function render() {
    var _props = this.props,
        commonForm = _props.commonForm,
        actions = _props.actions;
    var confirmCreateCommon = actions.confirmCreateCommon,
        updateCommonForm = actions.updateCommonForm;

    return React.createElement(
      'form',
      {
        id: 'form-common-create',
        style: { width: '50%', minWidth: 200 },
        onSubmit: function onSubmit(e) {
          e.preventDefault();
          confirmCreateCommon();
        }
      },
      React.createElement(CommonFormFields, {
        values: commonForm,
        onChange: updateCommonForm,
        disabled: false
      }),
      React.createElement(
        'button',
        {
          type: 'submit',
          style: { float: 'right' }
        },
        'Create'
      )
    );
  }
}));

module.exports = CreateCommons;