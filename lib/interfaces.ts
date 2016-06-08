import {IncomingMessage} from 'http';

export interface RouteHandler {
  (req: IncomingMessage, next: () => Promise<any>): any;
}

export class NoHandlerError extends Error {
  constructor() {
    super();
    this.message = 'there is no handler to handle request';
  }
}
