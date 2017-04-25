'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var bs = require('react-bootstrap');

var _require = require('react-router'),
    Link = _require.Link;

var MainSection = require('../../layout/MainSection');
var Topbar = require('../../layout/Topbar');

var _require2 = require('../../../utils/general'),
    getActiveKey = _require2.getActiveKey;

var _require3 = require('../../../constants/HomeConstants'),
    MAIN_MENU = _require3.MAIN_MENU;

var Settings = function Settings(props) {
  var intl = props.intl,
      children = props.children,
      location = props.location,
      route = props.route,
      routes = props.routes,
      actions = props.actions;
  var goTo = actions.goTo;


  var SETTINGS_MENU = MAIN_MENU.find(function (item) {
    return item.name === 'settings';
  }).children;
  var activeKey = getActiveKey(routes, 2);

  var _t = function _t(x) {
    return intl.formatMessage({ id: x });
  };
  return React.createElement(
    MainSection,
    { id: 'section.settings' },
    React.createElement(
      Topbar,
      null,
      React.createElement(
        bs.Tabs,
        {
          position: 'top',
          tabWidth: 3,
          activeKey: activeKey,
          onSelect: function onSelect(val) {
            return goTo('/settings/' + val);
          }
        },
        SETTINGS_MENU.map(function (item) {
          return item.hidden ? React.createElement('div', { key: item.name }) : React.createElement(bs.Tab, {
            key: item.name,
            eventKey: item.name,
            title: _t(item.title)
          });
        })
      )
    ),
    React.Children.map(children, function (child) {
      return React.cloneElement(child, _extends({}, props, child.props));
    })
  );
};

module.exports = Settings;