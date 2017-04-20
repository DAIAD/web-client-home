"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');

function Tab(props) {
  return React.createElement(
    "li",
    {
      key: props.key,
      role: "presentation",
      className: props.active ? props.className + " active" : props.className
    },
    React.createElement(
      "a",
      {
        role: "tab",
        tabIndex: props.index,
        onClick: function onClick(e) {
          e.preventDefault();
          props.onSelect(props.eventKey);
        }
      },
      props.image ? React.createElement("img", {
        className: "tab-icon",
        src: props.image,
        alt: props.key,
        style: { maxWidth: 20, maxHeight: 25, marginRight: 5 }
      }) : React.createElement("i", null),
      props.icon ? React.createElement("i", {
        className: "fa fa-" + props.icon + " navy",
        style: { width: 20, height: 20, marginRight: 5 }
      }) : React.createElement("i", null),
      React.createElement(
        "span",
        null,
        props.title
      ),
      props.multi && props.active ? React.createElement("i", { style: { float: 'right', marginRight: -5, marginTop: 5 }, className: "fa fa-times" }) : React.createElement("i", null)
    )
  );
}

function Tabs(props) {
  var horizontal = props.position === 'top' || props.position === 'bottom';
  return React.createElement(
    "div",
    { className: props.className + " clearfix" },
    React.createElement(
      "ul",
      { className: "col-xs-20 nav " + (horizontal ? 'nav-tabs' : 'nav-pills nav-stacked') },
      props.children.map(function (child, index) {
        return React.createElement(Tab, _extends({}, child.props, {
          index: index,
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