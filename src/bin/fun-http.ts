import {resolve} from 'path'
import program = require('commander');
import FunHttp from '../FunHttp';

const funHttpProgram: FunHttpProgram = program
  .usage('[options] <file>')
  .option('-p, --port <port_number>', 'Specify port number other than 3000', (val: string) => parseInt(val), 3000)
  .option('-h, --host <host_adress>', 'Bind to a specify host rather than listening on any interface', '0.0.0.0')
  .parse(process.argv);

interface FunHttpProgram {
  args: string[];
  host: string;
  port: number;
}

const file = funHttpProgram.args[0];
const host = funHttpProgram.host;
const port = funHttpProgram.port;

if (!file) {
  program.outputHelp();
  process.exit(1);
}

const absoluteFilePath = resolve(file);

const es2015ModulesCommonjs = require('babel-plugin-transform-es2015-modules-commonjs');
const syntaxAsyncFunction = require('babel-plugin-syntax-async-functions');
const asyncToModuleMethod = require('babel-plugin-transform-async-to-module-method');

require('babel-register')({
  plugins: [
    es2015ModulesCommonjs,
    syntaxAsyncFunction,
    [asyncToModuleMethod, {module: 'bluebird', method: 'coroutine'}]
  ]
});

const requestHandler = require(absoluteFilePath).default || require(absoluteFilePath);
const app = new FunHttp();

app.use(requestHandler);

app.listen(port, host, () => {
  console.log(`server start to listen on ${host}:${port}...`);
});
