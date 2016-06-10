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

If returned value (or promise resolved value) is not a number or string, it will be parsed into JSON string using `JSON.stringify`.

## Customize Response

**fun-http** will look for special structure on values returned from request handler to customize response's status and headers.

```js
app.use(function () {
  return {
    status: 404,
    json: {
      reason: 'not found'
    }
  };
});
```

```
$ curl -i localhost:3000

HTTP/1.1 404 Not Found
Date: Fri, 10 Jun 2016 00:14:34 GMT
Connection: keep-alive
Content-Length: 22

{"reason":"not found"}
```

For custom headers:

```js
app.use(function (req) {
  return {
    headers: {
      'x-really-awesome': 'yes!'
    }
  };
});
```

```
$ curl -i localhost:3000

HTTP/1.1 200 OK
x-really-awesome: yes!
Date: Fri, 10 Jun 2016 00:14:02 GMT
Connection: keep-alive
Content-Length: 0
```

You can also force **fun-http** to return text:

```js
app.use(function (req) {
  return {
    text: 'I just want to tell you...'
  };
});
```

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

app.use(co.wrap(function *(req, next) {
  const name = yield next();
  return {hello: name};
}));

app.use(function () {
  return 'World';
});
```

Or you can even use it with async/await functions:

```js
app.use(async function (req, next) {
  const name = await next();
  return {hello: name};
});

app.use(function () {
  return 'World';
});
```

_Of cause, Node.js doesn't currently support async/await functions, you will need to use transpiler like Babel to transpile the source._

## Examples

Check out [examples](./examples).

## TypeScript

Did I tell you **fun-http** is written using [TypeScript](http://www.typescriptlang.org/)?
