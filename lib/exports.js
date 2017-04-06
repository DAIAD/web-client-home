'use strict';

module.exports = {
  actions: {
    QueryActions: require('./actions/query/QueryActionsConnector')
  },
  components: {
    Widgets: require('./components/helpers/Widgets')
  },
  utils: {
    widgets: require('./utils/widgets')
  }
};