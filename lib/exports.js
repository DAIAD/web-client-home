'use strict';

var QueryActions = require('./actions/query/QueryActionsConnector');
var CacheActions = require('./actions/query/CacheActionsConnector');

var Widgets = require('./components/helpers/Widgets');

var widgetUtils = require('./utils/widgets');
var genUtils = require('./utils/general');
var devUtils = require('./utils/device');

module.exports = {
  actions: {
    QueryActions: QueryActions,
    CacheActions: CacheActions
  },
  components: {
    Widgets: Widgets
  },
  utils: {
    widgets: widgetUtils,
    general: genUtils,
    device: devUtils
  }
};