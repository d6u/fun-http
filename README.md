# :monkey_face: Fun(ctional) Http

[![npm version](https://badge.fury.io/js/fun-http.svg)](https://badge.fury.io/js/fun-http)

HTTP server should be as stateless as possible like functions. We should write request handlers in pure funtion. Let's treat return value as responses and use [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) to wrap async operations.

## Usage

**fun-http** supports Node >= 4.

```sh
npm install --save fun-http
```

```js
const FunHttp = require('../').FunHttp;
const app = new FunHttp();

app.use(function (req) {
  return 'Hello, World!';
});

app.listen(3000, () => {
  console.log('server started');
});
```

Visit `localhost:3000` will display "Hello, World!".

You can also return promise in request handlers, the resolved value will become the body of response.

```js
app.use(function (req) {
  return Promise.resolve('Hello, World!');
});
```

If returned value (or promise resolved value) is not a number of string, it will be parsed into JSON string using `JSON.stringify`.

## Middleware

**fun-http** supports middleware similar to Koa. Calling `next` will invoke next middleware and return a promise wrapping the return value of that middleware.

```js
app.use(function (req, next) {
  return next()
    .then(name => {
      return {hello: name}; // name === 'World'
    });
});

app.use(function () {
  return 'World';
});
```

Paire with [co](https://www.npmjs.com/package/co), you can make everything cleaner.

```js
const co = require('co');

app.use(co(function *(req, next) {
  const name = yield next();
  return {hello: name};
}));

app.use(function () {
  return 'World';
});
```

## Examples

Check out [examples](./examples).

## TypeScript

Did I tell you **fun-http** is written using [TypeScript](http://www.typescriptlang.org/)?
