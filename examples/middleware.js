'use strict';

const FunHttp = require('../').FunHttp;

const app = new FunHttp();

app.use(function (req, next) {
  return next().then(name => {
    return {
      hello: name,
    };
  });
});

app.use(function () {
  return 'World';
});

app.listen(3000, () => {
  console.log('server started');
});
