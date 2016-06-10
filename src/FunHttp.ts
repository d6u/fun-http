import {
  createServer,
  Server,
  IncomingMessage,
  ServerResponse
} from 'http';
import {ListenOptions} from 'net';
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

  listen(port: number, listeningListener?: Function): void;
  listen(path: string, listeningListener?: Function): void;
  listen(handle: any, listeningListener?: Function): void;
  listen(options: ListenOptions, listeningListener?: Function): void;
  listen(port: number, hostname?: string, listeningListener?: Function): void;
  listen(port: number, backlog?: number, listeningListener?: Function): void;
  listen(path: string, backlog?: number, listeningListener?: Function): void;
  listen(handle: any, backlog?: number, listeningListener?: Function): void;
  listen(port: number, hostname?: string, backlog?: number, listeningListener?: Function): void;
  listen(): void {
    this.server = createServer((req, res) => this.handler(req, res));
    this.server.listen.apply(this.server, arguments);
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
