'use strict';

var React = require('react');

var _require = require('react-intl'),
    FormattedDate = _require.FormattedDate,
    FormattedMessage = _require.FormattedMessage;

var DisplayMetric = require('../helpers/DisplayMetric');

var _require2 = require('../../constants/HomeConstants'),
    IMAGES = _require2.IMAGES;

var meter = [{
  id: 'volume',
  name: React.createElement(FormattedMessage, { id: 'history.volume' }),
  value: function value(_value) {
    return React.createElement(DisplayMetric, { className: 'table-highlight', value: _value });
  }
}, {
  id: 'comparison',
  name: '',
  csv: false,
  value: function value(_value2, row) {
    if (row.percentDiff == null) {
      return React.createElement(
        'span',
        null,
        React.createElement('i', { className: 'dash' })
      );
    } else if (row.percentDiff < 0) {
      return React.createElement(
        'span',
        null,
        React.createElement('img', {
          src: IMAGES + '/better.svg',
          style: { height: 25 },
          alt: 'better'
        })
      );
    }
    return React.createElement(
      'span',
      null,
      React.createElement('img', {
        src: IMAGES + '/worse.svg',
        style: { height: 25 },
        alt: 'worse'
      })
    );
  }
}, {
  id: 'min-max',
  name: '',
  csv: false,
  value: function value(_value3, row) {
    var min = row.min,
        max = row.max;

    if (min) {
      return React.createElement(
        'span',
        null,
        React.createElement('i', { className: 'fa fa-check green ' }),
        '\xA0\xA0',
        React.createElement(FormattedMessage, {
          id: 'history.consumption-min-short',
          values: { period: row.period }
        })
      );
    } else if (max) {
      return React.createElement(
        'span',
        null,
        React.createElement('img', { src: IMAGES + '/warning.svg', alt: 'warn' }),
        '\xA0\xA0',
        React.createElement(FormattedMessage, {
          id: 'history.consumption-max-short',
          values: { period: row.period }
        })
      );
    }
    return React.createElement('span', null);
  }
}, {
  id: 'date',
  name: React.createElement(FormattedMessage, { id: 'common.date' }),
  csv: false,
  icon: 'calendar'
}, {
  id: 'timestamp',
  name: '',
  value: function value() {
    return null;
  }
}, {
  id: 'showMore',
  name: '',
  csv: false,
  value: function value() {
    return React.createElement('img', { src: IMAGES + '/arrow-big-right.svg', alt: 'details' });
  }

}];

var amphiro = [{
  id: 'volume',
  name: React.createElement(FormattedMessage, { id: 'history.volume' }),
  value: function value(_value4) {
    return React.createElement(DisplayMetric, { className: 'table-highlight', value: _value4 });
  }
}, {
  id: 'comparison',
  name: '',
  csv: false,
  value: function value(_value5, row) {
    if (row.percentDiff == null) {
      return React.createElement('i', { className: 'dash' });
    } else if (row.percentDiff < 0) {
      return React.createElement('img', {
        src: IMAGES + '/better.svg',
        style: { height: 25 },
        alt: 'better'
      });
    }
    return React.createElement('img', {
      src: IMAGES + '/worse.svg',
      style: { height: 25 },
      alt: 'worse'
    });
  }
}, {
  id: 'member',
  name: React.createElement(FormattedMessage, { id: 'common.user' }),
  icon: 'user'
}, {
  id: 'date',
  name: React.createElement(FormattedMessage, { id: 'common.date' }),
  csv: false,
  icon: 'calendar'
}, {
  id: 'timestamp',
  name: '',
  value: function value() {
    return null;
  }
}, {
  id: 'deviceName',
  name: React.createElement(FormattedMessage, { id: 'history.device' })
}, {
  id: 'duration',
  name: '',
  icon: 'clock-o',
  value: function value(_value6) {
    return React.createElement(DisplayMetric, { value: _value6 });
  }
}, {
  id: 'energyClass',
  name: '',
  icon: 'flash'
}, {
  id: 'temperature',
  name: '',
  icon: 'temperature',
  value: function value(_value7) {
    return React.createElement(DisplayMetric, { value: _value7 });
  }
}, {
  id: 'real',
  name: React.createElement(FormattedMessage, { id: 'history.real' }),
  value: function value(_value8, row) {
    return _value8 ? React.createElement('i', { className: 'fa fa-check' }) : React.createElement('i', null);
  }
}, {
  id: 'id',
  name: '#'
}, {
  id: 'showMore',
  name: '',
  csv: false,
  value: function value() {
    return React.createElement('img', { src: IMAGES + '/arrow-big-right.svg', alt: 'details' });
  }
}];

var breakdown = [{
  id: 'title',
  name: React.createElement(FormattedMessage, { id: 'history.breakdownUse' }),
  value: function value(_value9, row) {
    return React.createElement(
      'span',
      { style: { fontSize: '1.5em' } },
      React.createElement('img', { src: IMAGES + '/' + row.id + '.svg', alt: _value9, style: { marginRight: 10 } }),
      React.createElement(
        'span',
        null,
        _value9
      )
    );
  }
}, {
  id: 'volume',
  name: React.createElement(FormattedMessage, { id: 'history.volume' }),
  value: function value(_value10) {
    return React.createElement(DisplayMetric, { className: 'table-highlight', value: _value10 });
  }
}, {
  id: 'date',
  name: React.createElement(FormattedMessage, { id: 'common.date' }),
  icon: 'calendar'
}, {
  id: 'showMore',
  name: '',
  csv: false,
  value: function value() {
    return React.createElement('img', { src: IMAGES + '/arrow-big-right.svg', alt: 'details' });
  }
}];

var forecast = [{
  id: 'forecast',
  name: React.createElement(FormattedMessage, { id: 'history.forecast' }),
  value: function value(_value11) {
    return React.createElement(DisplayMetric, { className: 'table-highlight', value: _value11 });
  }
}].concat(meter);

var wateriq = [{
  id: 'wateriq',
  name: React.createElement(FormattedMessage, { id: 'history.wateriq' }),
  value: function value(_value12) {
    return React.createElement(DisplayMetric, { className: 'table-highlight', value: _value12 });
  }
}].concat(meter);

var pricing = [{
  id: 'cost',
  name: React.createElement(FormattedMessage, { id: 'history.cost' }),
  icon: 'euro',
  value: function value(_value13) {
    return React.createElement(DisplayMetric, { className: 'table-highlight', value: _value13 });
  }
}, {
  id: 'total',
  name: React.createElement(FormattedMessage, { id: 'history.total' }),
  value: function value(_value14) {
    return React.createElement(DisplayMetric, { className: 'table-highlight', value: _value14 });
  }
}].concat(meter);

module.exports = {
  meter: meter,
  amphiro: amphiro,
  forecast: forecast,
  breakdown: breakdown,
  wateriq: wateriq,
  pricing: pricing
};