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
  filename: 'components/sections/settings/members/Create.js',
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

var bs = require('react-bootstrap');
var MemberFormFields = require('./FormFields');

var AddMember = _wrapComponent('_component')(React.createClass({
  displayName: 'AddMember',

  componentWillMount: function componentWillMount() {
    this.props.actions.clearMemberForm();
  },
  submit: function submit(e) {
    e.preventDefault();
    this.props.actions.confirmAddMember(this.props.memberForm);
  },
  render: function render() {
    var _props = this.props,
        _t = _props._t,
        errors = _props.errors,
        memberForm = _props.memberForm,
        actions = _props.actions;
    var addMember = actions.addMember,
        updateMemberForm = actions.updateMemberForm,
        fetchProfile = actions.fetchProfile,
        setError = actions.setError,
        dismissError = actions.dismissError,
        switchModeMember = actions.switchModeMember;

    return React.createElement(
      'form',
      {
        id: 'form-add-member',
        onSubmit: this.submit,
        style: { width: '50%', minWidth: 200 }
      },
      React.createElement(MemberFormFields, {
        _t: _t,
        errors: errors,
        member: memberForm,
        updateMemberForm: updateMemberForm,
        setError: setError,
        dismissError: dismissError
      }),
      React.createElement(
        bs.Button,
        {
          type: 'submit',
          onClick: this.submit,
          style: { float: 'right' }
        },
        React.createElement(FormattedMessage, { id: 'forms.create' })
      )
    );
  }
}));

module.exports = AddMember;