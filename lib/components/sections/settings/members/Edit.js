'use strict';

var React = require('react');
var bs = require('react-bootstrap');

var _require = require('react-intl'),
    FormattedMessage = _require.FormattedMessage;

var _require2 = require('react-router'),
    Link = _require2.Link;

var MainSection = require('../../../layout/MainSection');
var FormFields = require('./FormFields');
var LocaleSwitcher = require('../../../LocaleSwitcher');

var _require3 = require('../../../../constants/HomeConstants'),
    PNG_IMAGES = _require3.PNG_IMAGES,
    BASE64 = _require3.BASE64;

function EditMembers(props) {
  var _t = props._t,
      location = props.location,
      errors = props.errors,
      members = props.members,
      memberForm = props.memberForm,
      activeMemberIndex = props.active,
      mode = props.mode,
      actions = props.actions;
  var fetchProfile = actions.fetchProfile,
      updateMemberForm = actions.updateMemberForm,
      clearMemberForm = actions.clearMemberForm,
      setError = actions.setError,
      dismissError = actions.dismissError,
      confirmEditMember = actions.confirmEditMember,
      confirmDeleteMember = actions.confirmDeleteMember;

  return React.createElement(
    MainSection,
    { id: 'section.members' },
    React.createElement(
      'div',
      null,
      React.createElement(
        bs.Accordion,
        {
          className: 'col-md-10',
          animation: false,
          expanded: true,
          onSelect: function onSelect(val) {
            updateMemberForm(members.find(function (member) {
              return member.index === val;
            }));
          }
        },
        members.map(function (member) {
          return React.createElement(
            bs.Panel,
            {
              key: member.index,
              eventKey: member.index,
              header: React.createElement(
                'h3',
                null,
                member.photo ? React.createElement('img', {
                  style: {
                    height: 30,
                    width: 30,
                    marginRight: 10,
                    border: '1px #2D3580 solid'
                  },
                  src: '' + BASE64 + member.photo,
                  alt: 'member'
                }) : React.createElement('img', {
                  style: {
                    height: 30,
                    width: 30,
                    marginRight: 10,
                    border: '1px #2D3580 solid'
                  },
                  src: PNG_IMAGES + '/daiad-consumer.png',
                  alt: 'member'
                }),
                member.name || 'No name'
              )
            },
            React.createElement(
              'div',
              null,
              React.createElement(
                'form',
                {
                  id: 'form-edit-member',
                  onSubmit: function onSubmit(e) {
                    e.preventDefault();
                    confirmEditMember(memberForm);
                  }
                },
                React.createElement(FormFields, {
                  _t: _t,
                  errors: errors,
                  member: memberForm,
                  updateMemberForm: updateMemberForm,
                  fetchProfile: fetchProfile,
                  setError: setError,
                  dismissError: dismissError
                }),
                React.createElement(
                  'div',
                  null,
                  React.createElement(bs.ButtonInput, {
                    type: 'submit',
                    style: { float: 'right', marginRight: 10 },
                    value: _t('forms.submit')
                  }),
                  React.createElement(
                    bs.Button,
                    {
                      style: { float: 'right', marginRight: 10 },
                      bsStyle: 'danger',
                      onClick: function onClick() {
                        confirmDeleteMember(memberForm);
                      }
                    },
                    'Delete'
                  )
                )
              )
            )
          );
        })
      )
    )
  );
}

module.exports = EditMembers;