"use strict";

var React = require('react');

function QuerySuccess() {
  return React.createElement(
    "div",
    { className: "query-success" },
    React.createElement("i", { className: "fa fa-check green" })
  );
}

module.exports = QuerySuccess;