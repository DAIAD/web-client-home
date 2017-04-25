'use strict';

var develop = process.env.NODE_ENV !== 'production';

var _require = require('redux'),
    createStore = _require.createStore,
    applyMiddleware = _require.applyMiddleware;

var _require2 = require('react-router-redux'),
    routerMiddleware = _require2.routerMiddleware;

var thunkMiddleware = require('redux-thunk');
var logger = require('redux-logger');

var rootReducer = require('../reducers/');
var history = require('../routing/history');

var middleware = [thunkMiddleware, routerMiddleware(history)];

if (develop) {
  middleware.push(logger());
}

var store = createStore(rootReducer, applyMiddleware.apply(undefined, middleware));

module.exports = store;