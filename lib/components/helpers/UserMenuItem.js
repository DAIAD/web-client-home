'use strict';

var React = require('react');

var _require = require('react-router'),
    Link = _require.Link;

function UserMenuItem(props) {
  var _t = props._t,
      imgPrefix = props.imgPrefix,
      base64Prefix = props.base64Prefix,
      _props$link = props.link,
      link = _props$link === undefined ? 'settings/profile' : _props$link;

  return React.createElement(
    'div',
    { className: 'user-menu' },
    React.createElement(
      'div',
      { title: _t('section.profile') },
      React.createElement(
        Link,
        { to: link },
        React.createElement(
          'span',
          null,
          React.createElement(
            'b',
            null,
            props.firstname
          )
        ),
        props.photo ? React.createElement('img', {
          className: 'profile-header-photo',
          src: '' + base64Prefix + props.photo,
          alt: 'profile'
        }) : React.createElement('img', {
          className: 'profile-header-photo',
          src: imgPrefix + '/daiad-consumer.png',
          alt: 'profile'
        })
      )
    )
  );
}

module.exports = UserMenuItem;