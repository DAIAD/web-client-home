const QueryActions = require('./actions/query/QueryActionsConnector');

const Widgets = require('./components/helpers/Widgets');

const widgetUtils = require('./utils/widgets');
const genUtils = require('./utils/general');
const devUtils = require('./utils/device');

module.exports = {
  actions: {
    QueryActions,
  },
  components: {
    Widgets,
  },
  utils: {
    widgets: widgetUtils,
    general: genUtils,
    device: devUtils,
  },
};
