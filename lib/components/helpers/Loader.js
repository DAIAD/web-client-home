"use strict";

var React = require('react');

function Loader(props) {
  return React.createElement(
    "div",
    null,
    React.createElement("img", {
      className: "preloader",
      src: props.imgPrefix + "/preloader-counterclock.png",
      alt: "loading"
    }),
    React.createElement("img", {
      className: "preloader-inner",
      src: props.imgPrefix + "/preloader-clockwise.png",
      alt: "loading"
    })
  );
}

module.exports = Loader;