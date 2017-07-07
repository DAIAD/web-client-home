'use strict';

var React = require('react');
var DatetimeInput = require('react-datetime');

var _require = require('react-intl'),
    FormattedMessage = _require.FormattedMessage,
    FormattedDate = _require.FormattedDate;

var _require2 = require('../../constants/HomeConstants'),
    IMAGES = _require2.IMAGES;

function CustomTimeNavigator(props) {
  var time = props.time,
      updateTime = props.updateTime;

  return React.createElement(
    'div',
    { className: 'navigator' },
    React.createElement(
      'div',
      { className: 'navigator-child' },
      React.createElement(
        'div',
        { style: { float: 'left', marginRight: 5 } },
        React.createElement(DatetimeInput, {
          dateFormat: 'DD/MM/YYYY',
          timeFormat: 'HH:mm',
          inputProps: { size: 18 },
          value: time.startDate,
          isValidDate: function isValidDate(curr) {
            return curr.valueOf() <= time.endDate;
          },
          onChange: function onChange(val) {
            return updateTime({ startDate: val.valueOf() });
          }
        })
      ),
      '-',
      React.createElement(
        'div',
        { style: { float: 'right', marginLeft: 5 } },
        React.createElement(DatetimeInput, {
          closeOnSelect: true,
          dateFormat: 'DD/MM/YYYY',
          timeFormat: 'HH:mm',
          inputProps: { size: 18 },
          value: time.endDate,
          isValidDate: function isValidDate(curr) {
            return curr.valueOf() >= time.startDate;
          },
          onChange: function onChange(val) {
            return updateTime({ endDate: val.valueOf() });
          }
        })
      )
    )
  );
}

function TimeNavigator(props) {
  var time = props.time,
      _props$hasNext = props.hasNext,
      hasNext = _props$hasNext === undefined ? true : _props$hasNext,
      handlePrevious = props.handlePrevious,
      handleNext = props.handleNext;


  if (!time.startDate || !time.endDate) return React.createElement('div', null);
  return React.createElement(
    'div',
    { className: 'navigator' },
    React.createElement(
      'button',
      {
        className: 'btn-a navigator-child pull-left',
        onClick: handlePrevious
      },
      React.createElement('img', { src: IMAGES + '/arrow-big-left.svg', alt: 'previous' })
    ),
    React.createElement(
      'div',
      { className: 'navigator-child' },
      React.createElement(FormattedDate, {
        value: time.startDate,
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      '-',
      React.createElement(FormattedDate, {
        value: time.endDate,
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    ),
    hasNext ? React.createElement(
      'button',
      {
        className: 'btn-a navigator-child pull-right',
        onClick: handleNext
      },
      React.createElement('img', { src: IMAGES + '/arrow-big-right.svg', alt: 'next' })
    ) : React.createElement(
      'div',
      { className: 'navigator-child pull-right' },
      '\xA0'
    )
  );
}

function ShowerNavigator(props) {
  var showerRanges = props.showerRanges,
      handlePrevious = props.handlePrevious,
      handleNext = props.handleNext,
      hasNext = props.hasNext,
      hasPrevious = props.hasPrevious;

  return React.createElement(
    'div',
    { className: 'navigator' },
    hasPrevious ? React.createElement(
      'button',
      {
        className: 'btn-a navigator-child pull-left',
        onClick: handlePrevious
      },
      React.createElement('img', { src: IMAGES + '/arrow-big-left.svg', alt: 'previous' })
    ) : React.createElement(
      'div',
      { className: 'navigator-child pull-left' },
      '\xA0'
    ),
    React.createElement(
      'div',
      { className: 'navigator-child' },
      showerRanges.map(function (range, i) {
        return React.createElement(
          'div',
          { key: i },
          React.createElement(FormattedMessage, { id: 'history.showers' }),
          '\xA0',
          React.createElement(
            'span',
            null,
            range.first
          ),
          '-',
          React.createElement(
            'span',
            null,
            range.last
          ),
          '\xA0',
          React.createElement(
            'span',
            null,
            range && range.name ? '(' + range.name + ')' : ''
          )
        );
      })
    ),
    hasNext ? React.createElement(
      'button',
      {
        className: 'btn-a navigator-child pull-right',
        onClick: handleNext
      },
      React.createElement('img', { src: IMAGES + '/arrow-big-right.svg', alt: 'next' })
    ) : React.createElement(
      'div',
      { className: 'navigator-child pull-right' },
      '\xA0'
    )
  );
}

module.exports = {
  TimeNavigator: TimeNavigator,
  CustomTimeNavigator: CustomTimeNavigator,
  ShowerNavigator: ShowerNavigator
};