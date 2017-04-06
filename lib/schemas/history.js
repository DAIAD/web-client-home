'use strict';

var React = require('react');

var _require = require('react-intl'),
    FormattedDate = _require.FormattedDate,
    FormattedMessage = _require.FormattedMessage;

var _require2 = require('../constants/HomeConstants'),
    IMAGES = _require2.IMAGES;

var _require3 = require('../utils/general'),
    getMetricMu = _require3.getMetricMu;

var meter = [{
  id: 'volume',
  name: 'Volume',
  value: function value(_value, row) {
    return React.createElement(
      'span',
      { style: { fontSize: '2.5em' } },
      _value ? React.createElement(
        'div',
        null,
        React.createElement(
          'span',
          null,
          _value
        ),
        React.createElement(
          'span',
          { style: { fontSize: '0.6em' } },
          ' ',
          getMetricMu('volume')
        )
      ) : React.createElement(
        'span',
        null,
        '-'
      )
    );
  }
}, {
  id: 'comparison',
  name: '',
  csv: false,
  value: function value(_value2, row) {
    var min = row.min,
        max = row.max;

    if (row.percentDiff == null) {
      return React.createElement(
        'span',
        null,
        React.createElement('i', { className: 'dash' }),
        '\xA0',
        min ? React.createElement(
          'span',
          { style: { fontWeight: 'bold', color: '#7AD3AB' } },
          'min'
        ) : React.createElement('i', null),
        max ? React.createElement(
          'span',
          { style: { fontWeight: 'bold', color: '#CD4D3E' } },
          'max'
        ) : React.createElement('i', null)
      );
    } else if (row.percentDiff < 0) {
      return React.createElement(
        'span',
        null,
        React.createElement('i', { className: 'fa fa-arrow-down green' }),
        '\xA0',
        min ? React.createElement(
          'span',
          { style: { fontWeight: 'bold', color: '#7AD3AB' } },
          'min'
        ) : React.createElement('i', null)
      );
    }
    return React.createElement(
      'span',
      null,
      React.createElement('i', { className: 'fa fa-arrow-up red' }),
      '\xA0',
      max ? React.createElement(
        'span',
        { style: { fontWeight: 'bold', color: '#CD4D3E' } },
        'max'
      ) : React.createElement('i', null)
    );
  }
}, {
  id: 'member',
  name: 'User',
  icon: 'user'
}, {
  id: 'date',
  name: 'Date',
  icon: 'calendar'
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
  name: 'Volume',
  value: function value(_value3, row) {
    return React.createElement(
      'span',
      { style: { fontSize: '2.5em' } },
      _value3,
      React.createElement(
        'span',
        { style: { fontSize: '0.6em' } },
        ' ',
        getMetricMu('volume')
      )
    );
  }
}, {
  id: 'comparison',
  name: '',
  csv: false,
  value: function value(_value4, row) {
    if (row.percentDiff == null) {
      return React.createElement('i', { className: 'dash' });
    } else if (row.percentDiff < 0) {
      return React.createElement('i', { className: 'fa fa-arrow-down green' });
    }
    return React.createElement('i', { className: 'fa fa-arrow-up red' });
  }
}, {
  id: 'member',
  name: 'User',
  icon: 'user'
}, {
  id: 'date',
  name: 'Date',
  icon: 'calendar'
}, {
  id: 'devName',
  name: 'Device'
}, {
  id: 'friendlyDuration',
  name: 'Dur',
  icon: 'clock-o'
}, {
  id: 'energyClass',
  name: 'En',
  icon: 'flash'
}, {
  id: 'temperature',
  name: 'Temp',
  icon: 'temperature',
  value: function value(_value5, row) {
    return _value5 + ' \xBAC';
  }
}, {
  id: 'real',
  name: 'Real',
  value: function value(_value6, row) {
    return _value6 ? React.createElement('i', { className: 'fa fa-check' }) : React.createElement('i', null);
  }
}, {
  id: 'id',
  name: 'Id'
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
  name: 'Usage',
  value: function value(_value7, row) {
    return React.createElement(
      'span',
      { style: { fontSize: '1.5em' } },
      React.createElement('img', { src: IMAGES + '/' + row.id + '.svg', alt: _value7, style: { marginRight: 10 } }),
      React.createElement(
        'span',
        null,
        _value7
      )
    );
  }
}, {
  id: 'volume',
  name: 'Volume',
  value: function value(_value8, row) {
    return React.createElement(
      'span',
      { style: { fontSize: '2.5em' } },
      _value8,
      React.createElement(
        'span',
        { style: { fontSize: '0.6em' } },
        ' ',
        getMetricMu('volume')
      )
    );
  }
}, {
  id: 'member',
  name: 'User',
  icon: 'user'
}, {
  id: 'date',
  name: 'Date',
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
  name: 'Forecasted',
  value: function value(_value9) {
    return React.createElement(
      'span',
      { style: { fontSize: '2.5em' } },
      _value9 ? React.createElement(
        'div',
        null,
        React.createElement(
          'span',
          null,
          _value9
        ),
        React.createElement(
          'span',
          { style: { fontSize: '0.6em' } },
          ' ',
          getMetricMu('forecst')
        )
      ) : React.createElement(
        'span',
        null,
        '-'
      )
    );
  }
}].concat(meter);

var wateriq = [{
  id: 'wateriq',
  name: 'Water IQ',
  value: function value(_value10) {
    return React.createElement(
      'span',
      { style: { fontSize: '2.5em', marginLeft: 20 } },
      _value10
    );
  }
}].concat(meter);

var pricing = [{
  id: 'cost',
  name: 'Cost',
  icon: 'euro',
  value: function value(_value11) {
    return React.createElement(
      'span',
      { style: { fontSize: '2.5em' } },
      _value11 + ' ' + getMetricMu('cost')
    );
  }
}, {
  id: 'total',
  name: 'Total',
  value: function value(_value12, row) {
    return React.createElement(
      'span',
      { style: { fontSize: '2.0em' } },
      _value12,
      React.createElement(
        'span',
        { style: { fontSize: '0.6em' } },
        ' ',
        getMetricMu('total')
      )
    );
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