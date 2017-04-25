"use strict";

var React = require('react');

function MainSection(props) {
  return React.createElement(
    "section",
    { className: "main-section" },
    React.createElement(
      "div",
      { className: props.id },
      props.children
    )
  );
}

module.exports = MainSection;