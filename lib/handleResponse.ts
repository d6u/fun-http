import {ServerResponse} from 'http';
import isString = require('lodash/isString');

export interface FunHttpResponseConfig {
  headers?: {[key: string]: string};
  status?: number;
  json?: any;
  text?: string;
}

export class FunHttpResponse {
  constructor(config: FunHttpResponseConfig) {
    this.headers = config.headers;
    this.status = config.status;
    this.json = config.json;
    this.text = config.text;
  }

  public headers: {[key: string]: string} = null;
  public status: number = null;
  public json: any = null;
  public text: string = null;
}

export function handleResponse(res: ServerResponse, response: any) {
  if (response != null) {
    if (isString(response)) {
      res.statusCode = 200;
      res.end(response);
    } else if (response instanceof FunHttpResponse) {
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
        throw new Error('response must contain a json or text field');
      }
    } else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(response));
    }
  }
}

export function handleErrorResponse(res: ServerResponse, err: Error) {
  console.error(err);
  res.statusCode = 500;
  res.end();
}
