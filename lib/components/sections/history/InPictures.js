'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');

var _require = require('../../../constants/HomeConstants'),
    IMAGES = _require.IMAGES;

function Picture(props) {
  var display = props.display,
      items = props.items,
      metric = props.metric,
      remaining = props.remaining,
      _props$iconSuffix = props.iconSuffix,
      iconSuffix = _props$iconSuffix === undefined ? '' : _props$iconSuffix,
      _t = props._t;

  return React.createElement('img', {
    src: IMAGES + '/' + display + iconSuffix + '.svg',
    className: ['picture', display].join(' '),
    title: _t('history.inPicturesHover', {
      number: items,
      metric: _t('history.' + metric).toLowerCase(),
      scale: _t('history.' + display)
    }),
    alt: display
  });
}

function InPictures(props) {
  var display = props.display,
      items = props.items,
      remaining = props.remaining,
      metric = props.metric;

  return React.createElement(
    'div',
    { className: 'in-pictures' },
    Array.from({ length: items }).map(function (v, i) {
      return React.createElement(Picture, props);
    }),
    function () {
      if (remaining === 0.25) {
        return React.createElement(Picture, _extends({}, props, { iconSuffix: '-25' }));
      } else if (remaining === 0.5) {
        return React.createElement(Picture, _extends({}, props, { iconSuffix: '-50' }));
      } else if (remaining === 0.75) {
        return React.createElement(Picture, _extends({}, props, { iconSuffix: '-75' }));
      }
      return React.createElement('i', null);
    }()
  );
}

module.exports = InPictures;