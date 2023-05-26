// загрузка модулей
const http = require('http');
const url = require('url');
const nStatic = require('node-static');

const stream = require('./log').stream;

const fileServer = new nStatic.Server('./build');

/**
 * Инициализация сервера.
 * @param {number} port - № порта.
 * @param {any} route - функция обработки пути.
 * @param {any} handle - объект, содержащий отображение пути и функции его обработки.
 */
function start(port, route, handle) {
  http.createServer(function(request, response) {
    const pathname = url.parse(request.url).pathname;

    if (~pathname.lastIndexOf('.')) {
      fileServer.serve(request, response);
    } else {
      // Обработка запроса маршрута
      let message = '';
      request.addListener('data', function(chunk) {
        message += chunk;
      });

      request.addListener('end', function() {
        route(handle, pathname, response, message);
      });
    }
  }).listen(port);

  stream.write(`Server has started on port ${port}.`);
}
//
exports.start = start;
