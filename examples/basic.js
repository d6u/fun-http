'use strict';

process.on('unhandledRejection', function (err) {
  console.error(err);
});

const createServer = require('../').createServer;

const app = createServer();

app.use(function *(req, next) {
  const name = yield next();
  return {
    name,
  };
});

app.use(function () {
  return 'Wrold';
});

app.listen(() => {
  console.log('ready');
});
