'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var flattenCommonsGroups = function flattenCommonsGroups(groups) {
  if (!Array.isArray(groups)) {
    throw new Error('unknownError');
  }
  return groups.map(function (group) {
    return {
      group: _extends({}, group.group, {
        owner: group.owner,
        member: group.member
      })
    };
  }).map(function (group) {
    return group.group;
  });
};

module.exports = {
  flattenCommonsGroups: flattenCommonsGroups
};