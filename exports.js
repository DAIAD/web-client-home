const QueryActions = require('./actions/query/QueryActionsConnector');
const CacheActions = require('./actions/query/CacheActionsConnector');

const Widgets = require('./components/helpers/Widgets');

const widgetUtils = require('./utils/widgets');
const genUtils = require('./utils/general');
const devUtils = require('./utils/device');
const timeUtils = require('./utils/time');

module.exports = {
  actions: {
    QueryActions,
    CacheActions,
  },
  components: {
    Widgets,
  },
  utils: {
    widgets: widgetUtils,
    general: genUtils,
    device: devUtils,
    time: timeUtils,
  },
};
