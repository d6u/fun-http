'use strict';

const FunHttp = require('../').FunHttp;

const app = new FunHttp();

app.use(function (req) {
  return {
    status: 404,
    json: {
      reason: 'not found'
    }
  };
});

app.listen(3000, () => {
  console.log('server started');
});
