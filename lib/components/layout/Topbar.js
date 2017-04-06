"use strict";

var React = require('react');

function Topbar(props) {
  return React.createElement(
    "div",
    { className: "top-bar" },
    props.children
  );
}

module.exports = Topbar;