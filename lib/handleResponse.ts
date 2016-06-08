import {ServerResponse} from 'http';
import isString = require('lodash/isString');

function handleResponseValue(res: ServerResponse, response: any): void {
  if (response != null) {
    if (isString(response)) {
      res.statusCode = 200;
      res.end(response);
    } else if (response.status || response.headers || response.json || response.text) {
      const {headers, status, json, text} = response;

      res.statusCode = status || 200;

      if (headers != null) {
        for (const key of Object.keys(headers)) {
          res.setHeader(key, headers[key]);
        }
      }

      if (json != null) {
        res.end(JSON.stringify(json));
      } else if (text != null) {
        res.end(text);
      } else {
        res.end();
      }
    } else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(response));
    }
  }
}

function handleResponse(res: ServerResponse, error: Error): void;
function handleResponse(res: ServerResponse, value: any): void;
function handleResponse(res: ServerResponse, value: Error | any): void {
  if (value instanceof Error) {
    res.statusCode = 500;
    res.end();
    return;
  }

  if (value && typeof value.then === 'function') {
    (value as Promise<any>)
      .then((response) => handleResponseValue(res, response))
      .catch((err) => {
        res.statusCode = 500;
        res.end();
      });
  } else {
    handleResponseValue(res, value);
  }
}

export {handleResponse as default};
