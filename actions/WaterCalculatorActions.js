const types = require('../constants/ActionTypes');
const waterCalculatorAPI = require('../api/waterCalculator');

const { resetSuccess, requestedQuery, receivedQuery, dismissError, setInfo } = require('./QueryActions');

const { throwServerError } = require('../utils/general');
const { SUCCESS_SHOW_TIMEOUT } = require('../constants/HomeConstants');

const fetchWaterBreakdown = function () {
  return function (dispatch, getState) {
    const data = {
      csrf: getState().user.csrf,
    };

    dispatch(requestedQuery());

    return waterCalculatorAPI.getWaterBreakdown(data)
    .then((response) => {
      dispatch(receivedQuery(response.success, response.errors));
      setTimeout(() => { dispatch(resetSuccess()); }, SUCCESS_SHOW_TIMEOUT);

      if (!response || !response.success) {
        throwServerError(response);  
      }
      return response.labels;
    }) 
    .catch((errors) => {
      console.error('Error caught on fetch water breakdown:', errors);
      dispatch(receivedQuery(false, errors));
      return errors;
    });
  };
};

module.exports = {
  fetchWaterBreakdown,
};
