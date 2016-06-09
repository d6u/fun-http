'use strict';

const FunHttp = require('../').FunHttp;

const app = new FunHttp();

app.use(function (req) {
  return Promise.resolve('Hello, World!');
});

app.listen(3000, () => {
  console.log('server started');
});
