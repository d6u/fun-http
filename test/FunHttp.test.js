'use strict';

const test = require('tape');
const supertest = require('supertest');
const FunHttp = require('../').FunHttp;

test('return text content', (t) => {
  t.plan(3);

  const app = new FunHttp();
  app.use(function () {
    return 'Hello, World!';
  });

  supertest(app.handler)
    .get('/')
    .end((err, res) => {
      t.notOk(err);
      t.equal(res.statusCode, 200);
      t.equal(res.text, 'Hello, World!');
    });
});

test('return JSON content', (t) => {
  t.plan(3);

  const app = new FunHttp();
  app.use(function () {
    return {
      hello: 'world'
    };
  });

  supertest(app.handler)
    .get('/')
    .end((err, res) => {
      t.notOk(err);
      t.equal(res.statusCode, 200);
      t.equal(res.text, JSON.stringify({hello: 'world'}));
    });
});

test('wait for promise to resolve', (t) => {
  t.plan(3);

  const app = new FunHttp();
  app.use(function () {
    return Promise.resolve('Hello, World!');
  });

  supertest(app.handler)
    .get('/')
    .end((err, res) => {
      t.notOk(err);
      t.equal(res.statusCode, 200);
      t.equal(res.text, 'Hello, World!');
    });
});

test('wait for array of promises to resolve', (t) => {
  t.plan(3);

  const app = new FunHttp();
  app.use(function () {
    return [
      Promise.resolve('Hello'),
      Promise.resolve('World'),
    ];
  });

  supertest(app.handler)
    .get('/')
    .end((err, res) => {
      t.notOk(err);
      t.equal(res.statusCode, 200);
      t.equal(res.text, JSON.stringify(['Hello', 'World']));
    });
});

test('wait for nested promise objects to resolve', (t) => {
  t.plan(3);

  const app = new FunHttp();
  app.use(function () {
    return {
      hello: Promise.resolve('world'),
    };
  });

  supertest(app.handler)
    .get('/')
    .end((err, res) => {
      t.notOk(err);
      t.equal(res.statusCode, 200);
      t.equal(res.text, JSON.stringify({hello: 'world'}));
    });
});

test('recognize custom status code', (t) => {
  t.plan(2);

  const app = new FunHttp();
  app.use(function () {
    return {
      status: 404
    };
  });

  supertest(app.handler)
    .get('/')
    .end((err, res) => {
      t.notOk(err);
      t.equal(res.statusCode, 404);
    });
});

test('recognize custom headers', (t) => {
  t.plan(2);

  const app = new FunHttp();
  app.use(function () {
    return {
      headers: {
        'x-header-test': 'done'
      }
    };
  });

  supertest(app.handler)
    .get('/')
    .end((err, res) => {
      t.notOk(err);
      t.equal(res.headers['x-header-test'], 'done');
    });
});

test('recognize json field', (t) => {
  t.plan(2);

  const app = new FunHttp();
  app.use(function () {
    return {
      json: 'Hello World'
    };
  });

  supertest(app.handler)
    .get('/')
    .end((err, res) => {
      t.notOk(err);
      t.equal(res.text, JSON.stringify('Hello World'));
    });
});

test('recognize text field', (t) => {
  t.plan(2);

  const app = new FunHttp();
  app.use(function () {
    return {
      text: 'Hello World'
    };
  });

  supertest(app.handler)
    .get('/')
    .end((err, res) => {
      t.notOk(err);
      t.equal(res.text, 'Hello World');
    });
});
