const fetch = require('isomorphic-fetch');
require('es6-promise').polyfill();

const callAPI = function (url, data = {}, method = 'POST') {
  const { csrf } = data;

  const fetchObj = {
    method,
    credentials: 'same-origin',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': csrf
    },
    ...((method === 'POST' || method === 'PUT') ?
        ({ body: JSON.stringify(data) })
          : {})
  };
  
  return fetch(url, fetchObj) 
    .then(response => response.json()
        .then(json => ({ ...json, csrf: response.headers.get('X-CSRF-TOKEN') }))
        .catch((error) => { 
          console.error('Error parsing response:', error, url); 
          throw error;
        })
  );
};

module.exports = callAPI;
