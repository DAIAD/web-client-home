'use strict';

var React = require('react');

var _require = require('react-intl'),
    FormattedMessage = _require.FormattedMessage;

var _require2 = require('react-router'),
    Link = _require2.Link;

var _require3 = require('../../utils/general'),
    getActiveKey = _require3.getActiveKey;

function MainSidebar(props) {
  var menuItems = props.menuItems,
      imgPrefix = props.imgPrefix,
      _props$routes = props.routes,
      routes = _props$routes === undefined ? [] : _props$routes;

  var activeKey = getActiveKey(routes, 1);

  return React.createElement(
    'aside',
    { className: 'main-sidebar' },
    React.createElement(
      'ul',
      { className: 'main-menu-side' },
      menuItems.map(function (item) {
        return item.hidden ? React.createElement('div', { key: item.name }) : React.createElement(
          'li',
          {
            key: item.name,
            className: item.name === activeKey ? 'menu-item active' : 'menu-item'
          },
          React.createElement(
            Link,
            { to: item.route },
            item.image ? React.createElement(
              'div',
              { style: { float: 'left', minWidth: 25 } },
              React.createElement('img', {
                style: { width: 20, maxHeight: 20 },
                src: item.name === activeKey && item.activeImage ? imgPrefix + '/' + item.activeImage : imgPrefix + '/' + item.image,
                alt: item.name
              })
            ) : null,
            React.createElement(FormattedMessage, { id: item.title })
          )
        );
      })
    )
  );
}

module.exports = MainSidebar;