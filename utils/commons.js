const flattenCommonsGroups = function (groups) {
  if (!Array.isArray(groups)) {
    throw new Error('unknownError');
  }
  return groups
  .map(group => ({ 
    group: {
      ...group.group, 
      owner: group.owner,
      member: group.member,
    },
  }))
  .map(group => group.group);
};

module.exports = {
  flattenCommonsGroups,
};
