import {
  createServer,
  Server,
  IncomingMessage,
  ServerResponse
} from 'http';
import {RouteHandler, NoHandlerError} from './interfaces';
import handleResponse from './handleResponse';
import {toPromise} from './Utils';

export default class FunHttp {
  private handlers: RouteHandler[] = [];
  private server: Server = null;

  // to be used directly for server.createServer
  get handler() {
    return this._handler.bind(this);
  }

  use(handler: RouteHandler) {
    this.handlers.push(handler);
  }

  listen(port: number): void;
  listen(port: number, hostname: string): void;
  listen(port: number, backlog: number): void;
  listen(port: number, callback: () => void): void;
  listen(port: number, hostname: string, backlog: number): void;
  listen(port: number, hostname: string, callback: () => void): void;
  listen(port: number, backlog: number, callback: () => void): void;
  listen(port: number, hostname: string, backlog: number, callback: () => void): void;
  listen(...args: (number | string | (() => void))[]): void {
    this.server = createServer((req, res) => this.handler(req, res));
    this.server.listen.apply(this.server, args);
  }

  private _handler(req: IncomingMessage, res: ServerResponse) {
    const next = (index: number): Promise<any> => {
      if (index < this.handlers.length) {
        try {
          return toPromise(this.handlers[index](req, () => next(index + 1)));
        } catch (err) {
          return Promise.reject(err);
        }
      } else {
        return Promise.reject(new NoHandlerError());
      }
    }

    next(0)
      .then((obj) => handleResponse(res, obj))
      .catch((err) => handleResponse(res, err));
  }
}
