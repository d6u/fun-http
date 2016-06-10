import {
  createServer,
  Server,
  IncomingMessage,
  ServerResponse
} from 'http';
import {RouteHandler, NoHandlerError} from './interfaces';
import handleResponse from './handleResponse';
import {wrapNextReturnValue} from './Utils';

export default class FunHttp {
  private handlers: RouteHandler[] = [];
  private server: Server = null;

  // to work with existing native http server
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
  listen(
    port: number,
    hostname?: string | number | (() => void),
    backlog?: number | (() => void),
    callback?: () => void
  ): void {
    this.server = createServer((req, res) => this.handler(req, res));

    let _hostname: string;
    let _backlog: number;
    let _callback: () => void;

    if (arguments.length === 4) {
      _callback = callback;
      _backlog = backlog as number;
      _hostname = hostname as string;

    } else if (arguments.length === 3) {
      if (typeof backlog === 'function') {
        _callback = backlog;
        if (typeof hostname === 'number') {
          _backlog = hostname;
        } else {
          _hostname = hostname as string;
        }
      } else {
        _hostname = hostname as string;
        _backlog = backlog;
      }

    } else if (arguments.length === 2) {
      if (typeof hostname === 'function') {
        _callback = hostname;
      } else if (typeof hostname === 'number') {
        _backlog = hostname;
      } else {
        _hostname = hostname;
      }
    }

    this.server.listen(port, _hostname, _backlog, _callback);
  }

  private _handler(req: IncomingMessage, res: ServerResponse) {
    const next = (index: number): any => {
      if (index < this.handlers.length) {
        return this.handlers[index](req, () => wrapNextReturnValue(next, index + 1));
      } else {
        throw new NoHandlerError();
      }
    }

    try {
      handleResponse(res, next(0));
    } catch (err) {
      handleResponse(res, err);
    }
  }
}
