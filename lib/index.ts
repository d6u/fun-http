import {
  createServer as createHttpServer,
  Server,
  IncomingMessage,
  ServerResponse
} from 'http';
import {handleResponse, handleErrorResponse} from './handleResponse';
import {FunHttpResponse} from './handleResponse';
import co = require('co');

export interface RouteHandler {
  (req: IncomingMessage, next: () => any): any;
}

export class FunHttpApp {
  private handlers: RouteHandler[] = [];
  private server: Server = null;

  use(handler: RouteHandler) {
    this.handlers.push(co.wrap(handler));
  }

  listen(callback: (err: Error) => void) {
    this.server = createHttpServer(this.handler.bind(this));
    this.server.listen(3000, callback);
  }

  private handler(req: IncomingMessage, res: ServerResponse) {
    const next = (index: number): Promise<any> => {
      if (index < this.handlers.length) {
        return this.handlers[index](req, () => next(index + 1));
      } else {
        return Promise.reject(new NoHandlerError());
      }
    };

    next(0)
      .then((response: any) => handleResponse(res, response))
      .catch((err: Error) => handleErrorResponse(res, err));
  }
}

export function createServer(): FunHttpApp {
  return new FunHttpApp();
}

export function createResponse(config: Object) {
  return new FunHttpResponse(config);
}

export class NoHandlerError extends Error {
  constructor() {
    super();
    this.message = 'there is no handler to handle request';
  }
}
