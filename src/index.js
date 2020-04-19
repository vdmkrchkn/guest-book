const server = require('./server');
const router = require('./router');
const requestHandlers = require('./requestHandlers');
const config = require('./config');
const log = require('./log');
//
const handle = {};
handle['/'] = requestHandlers.start;
handle['/upload'] = requestHandlers.upload;
handle['/show'] = requestHandlers.show;
//
const port = config.get('port');

if (port) {
  server.start(port, router.route, handle);
} else {
  log.error('Неверно задан порт сервера.');
}
