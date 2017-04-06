'use strict';

var React = require('react');
var bs = require('react-bootstrap');

var _require = require('../../constants/HomeConstants'),
    IMAGES = _require.IMAGES;

function Table(props) {
  var className = props.className,
      fields = props.fields,
      data = props.data,
      _props$empty = props.empty,
      empty = _props$empty === undefined ? '' : _props$empty;

  if (!Array.isArray(fields)) {
    throw new Error('Fields must be array, check Table render');
  }
  if (!Array.isArray(data)) {
    throw new Error('Data must be array, check Table render');
  }
  if (!data.length) {
    return React.createElement(
      'div',
      { className: [className, 'empty'].join(' ') },
      empty
    );
  }
  return React.createElement(
    'div',
    null,
    React.createElement(
      'table',
      { className: className },
      React.createElement(TableHeader, props),
      React.createElement(TableBody, props)
    ),
    React.createElement(Pagination, props.pagination)
  );
}

function TableHeader(props) {
  var fields = props.fields;

  return React.createElement(
    'thead',
    null,
    React.createElement(
      'tr',
      null,
      fields.map(function (field) {
        return React.createElement(
          'th',
          { key: field.id },
          field.icon ? React.createElement('i', { className: 'fa fa-' + field.icon }) : React.createElement('i', null),
          field.name
        );
      })
    )
  );
}

function TableBody(props) {
  var data = props.data,
      fields = props.fields,
      rowClassName = props.rowClassName,
      onRowClick = props.onRowClick;

  return React.createElement(
    'tbody',
    null,
    data.map(function (row, idx) {
      return React.createElement(TableRow, {
        key: idx,
        className: typeof rowClassName === 'function' ? rowClassName(row, idx) : rowClassName,
        onRowClick: onRowClick,
        fields: fields,
        row: row,
        idx: idx
      });
    })
  );
}

function Pagination(props) {
  var total = props.total,
      active = props.active,
      onPageClick = props.onPageClick;

  return React.createElement(
    'div',
    { className: 'pagination', style: { width: '100%', textAlign: 'center' } },
    React.createElement(
      'div',
      { className: 'navigator' },
      active > 1 ? React.createElement(
        'a',
        { className: 'navigator-child pull-left', onClick: function onClick() {
            return onPageClick(active - 1);
          } },
        React.createElement('img', { src: IMAGES + '/arrow-big-left.svg', alt: 'previous' })
      ) : React.createElement('div', { className: 'navigator-child pull-left' }),
      total > 0 ? Array.from({ length: total }, function (v, i) {
        return i + 1;
      }).map(function (page) {
        return page === active ? React.createElement(
          'u',
          { key: page },
          React.createElement(
            'a',
            { className: 'pagination-item active', style: { marginLeft: 10 }, onClick: function onClick() {
                onPageClick(page);
              } },
            page
          )
        ) : React.createElement(
          'a',
          { key: page, className: 'pagination-item', style: { marginLeft: 10 }, onClick: function onClick() {
              onPageClick(page);
            } },
          page
        );
      }) : React.createElement('div', null),
      active < total ? React.createElement(
        'a',
        { className: 'navigator-child pull-right', onClick: function onClick() {
            return onPageClick(active + 1);
          } },
        React.createElement('img', { src: IMAGES + '/arrow-big-right.svg', alt: 'next' })
      ) : React.createElement('div', { className: 'navigator-child pull-right' })
    )
  );
}

function TableRow(props) {
  var fields = props.fields,
      row = props.row,
      rowIdx = props.idx,
      className = props.className,
      onRowClick = props.onRowClick;

  return React.createElement(
    'tr',
    {
      className: className,
      onClick: function onClick() {
        return onRowClick(row);
      }
    },
    fields.map(function (field, idx) {
      return React.createElement(TableItem, {
        key: field.id,
        columnIdx: idx,
        field: field,
        item: field.value ? field.value(row[field.id], row) : row[field.id]
      });
    })
  );
}

function TableItem(props) {
  var columnIdx = props.columnIdx,
      field = props.field,
      item = props.item;
  //const { icon, name } = field;

  return React.createElement(
    'td',
    null,
    item
  );
}

module.exports = Table;