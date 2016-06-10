'use strict';

const FunHttp = require('../').FunHttp;

const app = new FunHttp();

app.use(function (req) {
  return {
    headers: {
      'x-really-awesome': 'yes!'
    },
    json: {
      reason: 'yes indeed'
    }
  };
});

app.listen(3000, () => {
  console.log('server started');
});
