'use strict';

/*
/**
* Form Actions module.
* Action creators for generic form handling
* 
* @module FormActions
*/

var types = require('../constants/ActionTypes');

/**
 * Sets form data
 * @param {String} form - The id of the form
 * @param {Object} formData - The data to set 
 * 
 */
var setForm = function setForm(form, formData) {
  return {
    type: types.FORM_SET,
    form: form,
    formData: formData
  };
};

/**
 * Resets form data to initial state
 * @param {String} form - The id of the form
 * 
 */
var resetForm = function resetForm(form) {
  return {
    type: types.FORM_RESET,
    form: form
  };
};

/* Confirm actions */
var resetConfirm = function resetConfirm() {
  return function (dispatch, getState) {
    dispatch(resetForm('confirm'));
  };
};

var setConfirm = function setConfirm(mode, item) {
  return function (dispatch, getState) {
    dispatch(setForm('confirm', { mode: mode, item: item }));
  };
};

module.exports = {
  setForm: setForm,
  resetForm: resetForm,
  setConfirm: setConfirm,
  resetConfirm: resetConfirm
};