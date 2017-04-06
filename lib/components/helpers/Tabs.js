'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');

function Tab(props) {
  return React.createElement(
    'li',
    {
      key: props.key,
      role: 'presentation',
      className: props.active ? 'active' : ''
    },
    React.createElement(
      'a',
      { role: 'tab', onClick: function onClick() {
          return props.onSelect(props.eventKey);
        } },
      props.image ? React.createElement('img', {
        className: 'tab-icon',
        src: props.image,
        alt: props.key
      }) : React.createElement('i', null),
      React.createElement(
        'span',
        null,
        props.title
      ),
      props.multi && props.active ? React.createElement('i', { style: { float: 'right', marginRight: -5, marginTop: 5 }, className: 'fa fa-times' }) : React.createElement('i', null)
    )
  );
}

function Tabs(props) {
  var horizontal = props.position === 'top' || props.position === 'bottom';
  return React.createElement(
    'div',
    { className: props.className + ' clearfix' },
    React.createElement(
      'ul',
      { className: 'col-xs-20 nav ' + (horizontal ? 'nav-tabs' : 'nav-pills nav-stacked') },
      props.children.map(function (child) {
        return React.createElement(Tab, _extends({}, child.props, {
          multi: props.multi,
          active: props.multi ? props.activeKeys.includes(child.props.eventKey) : props.activeKey === child.props.eventKey,
          onSelect: props.onSelect
        }));
      })
    )
  );
}

function TabsMulti(props) {
  return React.createElement(Tabs, _extends({
    multi: true
  }, props));
}

module.exports = {
  Tab: Tab,
  Tabs: Tabs,
  TabsMulti: TabsMulti
};