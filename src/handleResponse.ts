import {ServerResponse} from 'http';
import isString = require('lodash/isString');

function handleResponseValue(res: ServerResponse, obj: any): void {
  if (obj == null) {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (isString(obj)) {
    res.statusCode = 200;
    res.end(obj);
  } else if (obj.status || obj.headers || obj.json || obj.text) {
    const headers = obj.headers;
    const status = obj.status;
    const json = obj.json;
    const text = obj.text;

    res.statusCode = status || 200;

    if (headers != null) {
      for (const key of Object.keys(headers)) {
        res.setHeader(key, headers[key]);
      }
    }

    if (json != null) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(json));
    } else if (text != null) {
      res.end(text);
    } else {
      res.end();
    }
  } else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(obj));
  }
}

function handleResponse(res: ServerResponse, err: Error): void;
function handleResponse(res: ServerResponse, obj: any): void;
function handleResponse(res: ServerResponse, obj: Error | any): void {
  if (obj instanceof Error) {
    res.statusCode = 500;
    res.end();
  } else {
    handleResponseValue(res, obj);
  }
}

export {handleResponse as default};
