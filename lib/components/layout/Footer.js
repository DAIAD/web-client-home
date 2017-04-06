"use strict";

var React = require('react');

function Footer() {
  return React.createElement(
    "footer",
    { className: "site-footer" },
    React.createElement(
      "div",
      { className: "container" },
      React.createElement(
        "ul",
        { style: { listStyle: 'none', textAlign: 'center' } },
        React.createElement(
          "li",
          { style: { display: 'inline-block' } },
          React.createElement(
            "a",
            { href: "/" },
            "2016 DAIAD"
          )
        ),
        React.createElement(
          "li",
          { style: { marginLeft: 20, display: 'inline-block' } },
          React.createElement(
            "a",
            { href: "http://daiad.eu" },
            "daiad.eu"
          )
        ),
        React.createElement(
          "li",
          { style: { marginLeft: 20, display: 'inline-block' } },
          React.createElement(
            "a",
            { href: "/" },
            "Terms of service"
          )
        ),
        React.createElement(
          "li",
          { style: { marginLeft: 20, display: 'inline-block' } },
          React.createElement(
            "a",
            { href: "/" },
            "Send feedback"
          )
        )
      )
    )
  );
}

module.exports = Footer;