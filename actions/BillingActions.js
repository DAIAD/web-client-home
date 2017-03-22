const types = require('../constants/ActionTypes');
const billingAPI = require('../api/billing');

const { resetSuccess, requestedQuery, receivedQuery, dismissError, setInfo } = require('./QueryActions');

const { throwServerError } = require('../utils/general');
const { SUCCESS_SHOW_TIMEOUT } = require('../constants/HomeConstants');

const fetchPriceBrackets = function () {
  return function (dispatch, getState) {
    const data = {
      csrf: getState().user.csrf,
    };

    dispatch(requestedQuery());

    return billingAPI.getPriceBrackets(data)
    .then((response) => {
      dispatch(receivedQuery(response.success, response.errors));
      setTimeout(() => { dispatch(resetSuccess()); }, SUCCESS_SHOW_TIMEOUT);

      if (!response || !response.success) {
        throwServerError(response);  
      }
      return response.brackets;
    }) 
    .catch((errors) => {
      console.error('Error caught on get price brackets:', errors);
      dispatch(receivedQuery(false, errors));
      return errors;
    });
  };
};

module.exports = {
  fetchPriceBrackets,
};
