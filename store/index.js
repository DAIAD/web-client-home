const develop = (process.env.NODE_ENV !== 'production');

const { createStore, applyMiddleware } = require('redux');
const { routerMiddleware } = require('react-router-redux');
const thunkMiddleware = require('redux-thunk');
const logger = require('redux-logger');

const rootReducer = require('../reducers/');
const history = require('../routing/history');

const middleware = [
  thunkMiddleware,
  routerMiddleware(history),
];

if (develop) {
  middleware.push(logger());
}

const store = createStore(rootReducer, applyMiddleware(...middleware));

module.exports = store;

