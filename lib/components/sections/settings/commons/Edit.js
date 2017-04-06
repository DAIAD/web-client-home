'use strict';

var React = require('react');
var bs = require('react-bootstrap');

var _require = require('react-intl'),
    FormattedMessage = _require.FormattedMessage,
    FormattedDate = _require.FormattedDate,
    FormattedTime = _require.FormattedTime;

var CommonFormFields = require('./Form');

var _require2 = require('../../../../constants/HomeConstants'),
    IMAGES = _require2.IMAGES,
    BASE64 = _require2.BASE64;

function UpdateCommons(props) {
  var myCommons = props.myCommons,
      commonForm = props.commonForm,
      favorite = props.favorite,
      actions = props.actions;
  var confirmUpdateCommon = actions.confirmUpdateCommon,
      confirmDeleteCommon = actions.confirmDeleteCommon,
      confirmLeaveCommon = actions.confirmLeaveCommon,
      updateCommonForm = actions.updateCommonForm,
      saveFavoriteCommon = actions.saveFavoriteCommon;

  if (myCommons.length === 0) {
    return React.createElement(
      'div',
      { style: { margin: 20 } },
      React.createElement(
        'h5',
        null,
        'No communities joined yet.'
      )
    );
  }
  return React.createElement(
    bs.Accordion,
    {
      className: 'col-md-10',
      animation: false,
      onSelect: function onSelect(val) {
        updateCommonForm(myCommons.find(function (c) {
          return c.key === val;
        }));
      }
    },
    myCommons.map(function (common) {
      return React.createElement(
        bs.Panel,
        {
          key: common.key,
          eventKey: common.key,
          header: React.createElement(
            'h3',
            null,
            common.image ? React.createElement('img', {
              style: {
                height: 30,
                width: 30,
                marginRight: 10,
                border: '1px #2d3580 solid'
              },
              src: '' + BASE64 + common.image,
              alt: 'member'
            }) : React.createElement('img', {
              style: {
                height: 30,
                width: 30,
                marginRight: 10,
                border: '1px #2d3580 solid'
              },
              src: IMAGES + '/commons-menu.svg',
              alt: 'member'
            }),
            common.name || 'No name'
          )
        },
        React.createElement(
          'form',
          {
            id: 'form-common-update-' + common.key,
            style: { width: '100%' },
            onSubmit: function onSubmit(e) {
              e.preventDefault();
              confirmUpdateCommon();
            }
          },
          favorite === common.key ? React.createElement(
            'a',
            {
              title: 'Reset favorite community',
              style: { float: 'right' },
              onClick: function onClick() {
                saveFavoriteCommon(null);
              }
            },
            React.createElement('i', { style: { float: 'right' }, className: 'fa fa-star' })
          ) : React.createElement(
            'a',
            {
              title: 'Set favorite community',
              style: { float: 'right' },
              onClick: function onClick() {
                saveFavoriteCommon(common.key);
              }
            },
            React.createElement('i', { style: { float: 'right' }, className: 'fa fa-star-o' })
          ),
          React.createElement(CommonFormFields, {
            values: commonForm,
            onChange: updateCommonForm,
            disabled: !commonForm.owner
          }),
          React.createElement(
            'label',
            { htmlFor: 'common-size' },
            'Members:'
          ),
          React.createElement(
            'span',
            { id: 'common-size' },
            commonForm.size
          ),
          React.createElement('br', null),
          React.createElement(
            'label',
            { htmlFor: 'common-created' },
            'Created:'
          ),
          React.createElement(
            'span',
            { id: 'common-created' },
            React.createElement(FormattedDate, { value: commonForm.createdOn })
          ),
          React.createElement('br', null),
          React.createElement(
            'label',
            { htmlFor: 'common-updated' },
            'Last updated:'
          ),
          React.createElement(
            'span',
            { id: 'common-updated' },
            React.createElement(FormattedDate, { value: commonForm.updatedOn }),
            '\xA0',
            React.createElement(FormattedTime, { value: commonForm.updatedOn })
          ),
          commonForm.owner ? React.createElement(
            'div',
            null,
            React.createElement(
              bs.Button,
              {
                type: 'submit',
                style: { float: 'right' }
              },
              'Update'
            ),
            React.createElement(
              bs.Button,
              {
                style: { float: 'right', marginRight: 10 },
                bsStyle: 'danger',
                onClick: function onClick() {
                  confirmDeleteCommon();
                }
              },
              'Delete'
            )
          ) : React.createElement(
            'div',
            null,
            React.createElement(
              bs.Button,
              {
                style: { float: 'right', marginRight: 10 },
                bsStyle: 'warning',
                onClick: function onClick() {
                  confirmLeaveCommon();
                }
              },
              'Leave'
            )
          )
        )
      );
    })
  );
}

module.exports = UpdateCommons;