'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var bs = require('react-bootstrap');

var _require = require('react-intl'),
    FormattedMessage = _require.FormattedMessage,
    FormattedDate = _require.FormattedDate;

var Table = require('../../helpers/Table');

var _require2 = require('../../schemas/commons'),
    commonsSchema = _require2.commons,
    allCommonsSchema = _require2.allCommons,
    membersSchema = _require2.members;

var _require3 = require('../../../utils/general'),
    debounce = _require3.debounce;

var _require4 = require('../../../constants/HomeConstants'),
    COMMONS_MEMBERS_PAGE = _require4.COMMONS_MEMBERS_PAGE,
    COMMONS_USER_SORT = _require4.COMMONS_USER_SORT;

function MembersArea(props) {
  var _t = props._t,
      handleSortSelect = props.handleSortSelect,
      searchFilter = props.searchFilter,
      members = props.members,
      actions = props.actions;
  var selectedMembers = members.selected,
      activeMembers = members.active,
      sortFilter = members.sortFilter,
      sortOrder = members.sortOrder,
      memberCount = members.count,
      pagingIndex = members.pagingIndex;
  var setDataQueryAndFetch = actions.setDataQueryAndFetch,
      setSearchFilter = actions.setSearchFilter,
      addMemberToChart = actions.addMemberToChart,
      removeMemberFromChart = actions.removeMemberFromChart,
      setMemberSortFilter = actions.setMemberSortFilter,
      setMemberSortOrder = actions.setMemberSortOrder,
      setMemberSearchFilter = actions.setMemberSearchFilter,
      searchCommonMembers = actions.searchCommonMembers,
      setMemberQueryAndFetch = actions.setMemberQueryAndFetch,
      fetchData = actions.fetchData;


  return React.createElement(
    'div',
    { className: 'commons-members-area' },
    React.createElement(
      'div',
      { style: { marginTop: 20, marginBottom: 0, marginLeft: 20 } },
      React.createElement(
        'h5',
        null,
        React.createElement(FormattedMessage, { id: 'commons.members' })
      )
    ),
    React.createElement(
      'div',
      { className: 'members-search', style: { float: 'left', marginLeft: 20 } },
      React.createElement(
        'form',
        {
          className: 'search-field',
          onSubmit: function onSubmit(e) {
            e.preventDefault();
            setMemberQueryAndFetch({ index: 0 });
          }
        },
        React.createElement('input', {
          type: 'text',
          placeholder: _t('commons.placeholder-search-members'),
          onChange: function onChange(e) {
            setMemberSearchFilter(e.target.value);
            debounce(function () {
              setMemberQueryAndFetch({ index: 0 });
            }, 300)();
          },
          value: searchFilter
        }),
        React.createElement('button', {
          className: 'clear-button',
          type: 'reset',
          onClick: function onClick(e) {
            setMemberQueryAndFetch({ index: 0, name: '' });
          }
        })
      )
    ),
    React.createElement(
      'div',
      { className: 'members-sort', style: { float: 'right', marginRight: 10 } },
      React.createElement(
        'h5',
        { style: { float: 'left', marginTop: 5 } },
        React.createElement(FormattedMessage, { id: 'common.sortby' })
      ),
      React.createElement(
        'div',
        {
          className: 'sort-options',
          style: { float: 'right', marginLeft: 10, textAlign: 'right' }
        },
        React.createElement(
          bs.DropdownButton,
          {
            title: COMMONS_USER_SORT.find(function (sort) {
              return sort.id === sortFilter;
            }) ? _t(COMMONS_USER_SORT.find(function (sort) {
              return sort.id === sortFilter;
            }).title) : _t('profile.lastname'),
            id: 'sort-by',
            defaultValue: sortFilter,
            onSelect: handleSortSelect
          },
          COMMONS_USER_SORT.map(function (sort) {
            return React.createElement(
              bs.MenuItem,
              {
                key: sort.id,
                eventKey: sort.id,
                value: sort.id
              },
              _t(sort.title)
            );
          })
        ),
        React.createElement(
          'div',
          { style: { float: 'right', marginLeft: 20 } },
          sortOrder === 'asc' ? React.createElement(
            'button',
            {
              className: 'btn-a',
              onClick: function onClick() {
                return setMemberQueryAndFetch({ sortOrder: 'desc' });
              }
            },
            React.createElement('i', { className: 'fa fa-arrow-up' })
          ) : React.createElement(
            'button',
            {
              className: 'btn-a',
              onClick: function onClick() {
                return setMemberQueryAndFetch({ sortOrder: 'asc' });
              }
            },
            React.createElement('i', { className: 'fa fa-arrow-down' })
          )
        )
      )
    ),
    React.createElement('br', null),
    React.createElement(
      'div',
      null,
      React.createElement(
        'p',
        { style: { marginLeft: 20 } },
        React.createElement(
          'b',
          null,
          React.createElement(FormattedMessage, { id: 'common.found' }),
          ':'
        ),
        ' ',
        memberCount
      ),
      React.createElement(
        'p',
        { style: { marginLeft: 20 } },
        React.createElement('i', { className: 'fa fa-info-circle' }),
        '\xA0',
        React.createElement(
          'i',
          null,
          React.createElement(FormattedMessage, { id: 'commons.select-info' })
        )
      )
    ),
    React.createElement(Table, {
      className: 'session-list',
      rowClassName: function rowClassName(row) {
        return selectedMembers.find(function (m) {
          return m.key === row.key;
        }) ? 'session-list-item selected' : 'session-list-item';
      },
      fields: membersSchema,
      data: activeMembers,
      pagination: {
        total: Math.ceil(memberCount / COMMONS_MEMBERS_PAGE),
        active: pagingIndex,
        onPageClick: function onPageClick(page) {
          setMemberQueryAndFetch({ index: page - 1 });
        }
      },
      onRowClick: function onRowClick(row) {
        if (selectedMembers.map(function (u) {
          return u.key;
        }).includes(row.key)) {
          removeMemberFromChart(row);
        } else if (selectedMembers.length < 3) {
          addMemberToChart(_extends({}, row, { selected: selectedMembers.length + 1 }));
        }
      }
    })
  );
}

module.exports = MembersArea;