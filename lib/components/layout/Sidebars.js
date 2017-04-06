"use strict";

var React = require('react');

function SidebarLeft(props) {
  return React.createElement(
    "div",
    {
      className: "sidebar-left",
      style: { width: props.width }
    },
    props.children
  );
}

function SidebarRight(props) {
  return React.createElement(
    "div",
    {
      className: "sidebar-right",
      style: { width: props.width }
    },
    props.children
  );
}
module.exports = { SidebarLeft: SidebarLeft, SidebarRight: SidebarRight };