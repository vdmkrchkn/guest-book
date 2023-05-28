const server = require('./server');
const router = require('./router');
const requestHandlers = require('./requestHandlers');
const config = require('./config');
const log = require('./log');

const port = config.get('port');

if (port) {
  server.start(port, router.route, {
    '/': requestHandlers.start,
    '/upload': requestHandlers.upload,
    '/show': requestHandlers.show,
    '/subscribe': requestHandlers.subscribe,
  });
} else {
  log.error('Неверно задан порт сервера.');
}
