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
  name: React.createElement(FormattedMessage, { id: 'history.volume' }),
  value: function value(_value, row) {
    return React.createElement(
      'span',
      { style: { fontSize: '2.5em' } },
      _value != null ? React.createElement(
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
  name: React.createElement(FormattedMessage, { id: 'history.volume' }),
  value: function value(_value4, row) {
    return React.createElement(
      'span',
      { style: { fontSize: '2.5em' } },
      _value4,
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
  icon: 'calendar'
}, {
  id: 'deviceName',
  name: React.createElement(FormattedMessage, { id: 'history.device' })
}, {
  id: 'duration',
  name: '',
  icon: 'clock-o'
}, {
  id: 'energyClass',
  name: '',
  icon: 'flash'
}, {
  id: 'temperature',
  name: '',
  icon: 'temperature',
  value: function value(_value6, row) {
    return _value6 + ' \xBAC';
  }
}, {
  id: 'real',
  name: React.createElement(FormattedMessage, { id: 'history.real' }),
  value: function value(_value7, row) {
    return _value7 ? React.createElement('i', { className: 'fa fa-check' }) : React.createElement('i', null);
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
  value: function value(_value8, row) {
    return React.createElement(
      'span',
      { style: { fontSize: '1.5em' } },
      React.createElement('img', { src: IMAGES + '/' + row.id + '.svg', alt: _value8, style: { marginRight: 10 } }),
      React.createElement(
        'span',
        null,
        _value8
      )
    );
  }
}, {
  id: 'volume',
  name: React.createElement(FormattedMessage, { id: 'history.volume' }),
  value: function value(_value9, row) {
    return React.createElement(
      'span',
      { style: { fontSize: '2.5em' } },
      _value9,
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
  name: React.createElement(FormattedMessage, { id: 'common.user' }),
  icon: 'user'
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
  name: React.createElement(FormattedMessage, { id: 'history.forecasted' }),
  value: function value(_value10) {
    return React.createElement(
      'span',
      { style: { fontSize: '2.5em' } },
      _value10 ? React.createElement(
        'div',
        null,
        React.createElement(
          'span',
          null,
          _value10
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
  name: React.createElement(FormattedMessage, { id: 'history.wateriq' }),
  value: function value(_value11) {
    return React.createElement(
      'span',
      { style: { fontSize: '2.5em', marginLeft: 20 } },
      _value11
    );
  }
}].concat(meter);

var pricing = [{
  id: 'cost',
  name: React.createElement(FormattedMessage, { id: 'history.cost' }),
  icon: 'euro',
  value: function value(_value12) {
    return React.createElement(
      'span',
      { style: { fontSize: '2.5em' } },
      _value12 + ' ' + getMetricMu('cost')
    );
  }
}, {
  id: 'total',
  name: React.createElement(FormattedMessage, { id: 'history.totalVolume' }),
  value: function value(_value13, row) {
    return React.createElement(
      'span',
      { style: { fontSize: '2.5em' } },
      _value13,
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