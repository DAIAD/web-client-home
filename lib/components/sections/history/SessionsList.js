'use strict';

var React = require('react');
var bs = require('react-bootstrap');

var _require = require('react-intl'),
    FormattedMessage = _require.FormattedMessage;

var Table = require('../../helpers/Table');

function SessionsList(props) {
  var _t = props._t,
      sortOptions = props.sortOptions,
      sortFilter = props.sortFilter,
      sortOrder = props.sortOrder,
      handleSortSelect = props.handleSortSelect,
      activeDeviceType = props.activeDeviceType,
      csvData = props.csvData,
      time = props.time,
      sessionFields = props.sessionFields,
      sessions = props.sessions,
      setActiveSession = props.setActiveSession,
      setSortOrder = props.setSortOrder,
      setSortFilter = props.setSortFilter,
      onSessionClick = props.onSessionClick;

  return React.createElement(
    'div',
    { className: 'history-list-area' },
    React.createElement(
      'div',
      { className: 'history-list-header' },
      React.createElement(
        'h3',
        { style: { float: 'left' } },
        React.createElement(FormattedMessage, { id: 'history.in-detail' })
      ),
      csvData ? React.createElement(
        'a',
        {
          style: { float: 'left', marginLeft: 10 },
          className: 'btn',
          href: 'data:application/csv;charset=utf-8, ' + csvData,
          download: 'Data.csv'
        },
        React.createElement(FormattedMessage, { id: 'forms.download' })
      ) : React.createElement('span', null),
      React.createElement(
        'div',
        { style: { float: 'right' } },
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
              title: sortOptions.find(function (sort) {
                return sort.id === sortFilter;
              }) ? _t(sortOptions.find(function (sort) {
                return sort.id === sortFilter;
              }).title) : _t('history.volume'),
              id: 'sort-by',
              defaultValue: sortFilter,
              onSelect: handleSortSelect
            },
            sortOptions.map(function (sort) {
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
            { style: { float: 'right', marginLeft: 10 } },
            sortOrder === 'asc' ? React.createElement(
              'button',
              {
                className: 'btn-a',
                onClick: function onClick() {
                  return setSortOrder('desc');
                }
              },
              React.createElement('i', { className: 'fa fa-arrow-up' })
            ) : React.createElement(
              'button',
              {
                className: 'btn-a',
                onClick: function onClick() {
                  return setSortOrder('asc');
                }
              },
              React.createElement('i', { className: 'fa fa-arrow-down' })
            )
          )
        )
      )
    ),
    React.createElement(Table, {
      className: 'session-list',
      rowClassName: 'session-list-item',
      fields: sessionFields,
      data: sessions,
      onRowClick: onSessionClick
    })
  );
}

module.exports = SessionsList;