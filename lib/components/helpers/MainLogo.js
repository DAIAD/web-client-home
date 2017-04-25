'use strict';

var React = require('react');

var _require = require('react-router'),
    Link = _require.Link;

function MainLogo(props) {
  var imgPrefix = props.imgPrefix,
      _props$link = props.link,
      link = _props$link === undefined ? '/' : _props$link;

  return React.createElement(
    Link,
    { to: link, className: 'logo', activeClassName: 'selected' },
    React.createElement('img', {
      src: imgPrefix + '/daiad-logo-navy.svg',
      alt: 'DAIAD',
      title: 'DAIAD'
    })
  );
}

module.exports = MainLogo;