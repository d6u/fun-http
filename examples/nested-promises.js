'use strict';

const FunHttp = require('../').FunHttp;

const app = new FunHttp();

app.use(function (req) {
  return {
    name: {
      first: Promise.resolve('John')
    },
    age: Promise.resolve(999),
    slogan: 'Hello',
  };
});

app.listen(3000, () => {
  console.log('server started');
});
