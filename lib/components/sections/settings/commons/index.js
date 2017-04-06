'use strict';

var React = require('react');
var bs = require('react-bootstrap');

var MainSection = require('../../../layout/MainSection');

var _require = require('../../../layout/Sidebars'),
    SidebarLeft = _require.SidebarLeft,
    SidebarRight = _require.SidebarRight;

var Confirm = require('../../../helpers/ConfirmModal');

var _require2 = require('../../../../utils/general'),
    getActiveKey = _require2.getActiveKey;

var _require3 = require('../../../../constants/HomeConstants'),
    MAIN_MENU = _require3.MAIN_MENU;

function CommonsSettings(props) {
  var _t = props._t,
      searchFilter = props.searchFilter,
      confirm = props.confirm,
      active = props.active,
      mode = props.mode,
      myCommons = props.myCommons,
      allCommons = props.allCommons,
      actions = props.actions,
      params = props.params,
      children = props.children,
      commonForm = props.commonForm,
      routes = props.routes,
      searchCommons = props.searchCommons;
  var setSearchFilter = actions.setSearchFilter,
      setConfirm = actions.setConfirm,
      clickConfirm = actions.clickConfirmCommon,
      resetConfirm = actions.resetConfirm,
      goTo = actions.goTo;


  var COMMONS_MENU = MAIN_MENU.find(function (item) {
    return item.name === 'settings';
  }).children.find(function (item) {
    return item.name === 'commons';
  }).children;

  var activeKey = getActiveKey(routes, 3);

  return React.createElement(
    MainSection,
    { id: 'section.commons' },
    React.createElement(
      'div',
      { className: 'section-row-container' },
      React.createElement(
        SidebarRight,
        null,
        React.createElement(
          bs.Tabs,
          {
            position: 'left',
            tabWidth: 50,
            activeKey: activeKey,
            onSelect: function onSelect(val) {
              goTo(COMMONS_MENU.find(function (item) {
                return item.name === val;
              }).route);
            }
          },
          COMMONS_MENU.map(function (m) {
            return React.createElement(bs.Tab, {
              key: m.name,
              eventKey: m.name,
              title: _t(m.title)
            });
          })
        )
      ),
      React.createElement(
        'div',
        { style: { margin: 20, height: '100%', width: '100%' } },
        React.cloneElement(children, props)
      ),
      React.createElement(Confirm, {
        show: confirm.mode !== null && confirm.item !== null,
        confirmation: confirm,
        message: confirm.item && confirm.mode ? 'Are you sure you want to ' + confirm.mode + ' ' + confirm.item.name + '?' : '',
        onConfirm: clickConfirm,
        onClose: resetConfirm
      })
    )
  );
}

module.exports = CommonsSettings;