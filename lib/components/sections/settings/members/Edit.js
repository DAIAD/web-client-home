'use strict';

var React = require('react');
var bs = require('react-bootstrap');

var _require = require('react-intl'),
    FormattedMessage = _require.FormattedMessage;

var MainSection = require('../../../layout/MainSection');
var FormFields = require('./FormFields');

var _require2 = require('../../../../constants/HomeConstants'),
    PNG_IMAGES = _require2.PNG_IMAGES,
    BASE64 = _require2.BASE64;

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
                member.name || _t('forms.noname')
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
                  React.createElement(
                    'button',
                    {
                      type: 'submit',
                      className: 'btn',
                      style: { float: 'right', marginRight: 10 }
                    },
                    React.createElement(FormattedMessage, { id: 'forms.update' })
                  ),
                  member.index !== 0 ? React.createElement(
                    'button',
                    {
                      style: { float: 'right', marginRight: 10 },
                      className: 'btn',
                      bsStyle: 'danger',
                      onClick: function onClick(e) {
                        e.preventDefault();
                        confirmDeleteMember(memberForm);
                      }
                    },
                    React.createElement(FormattedMessage, { id: 'forms.delete' })
                  ) : React.createElement('span', null)
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