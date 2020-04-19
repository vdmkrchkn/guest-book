// загрузка модулей
const http = require('http');
const url = require('url');
const log = require('./log');
const stream = require('./log').stream;
const static = require('./staticHandlers');

/**
 * Инициализация сервера.
 * @param {number} port - № порта.
 * @param {any} route - функция обработки пути.
 * @param {any} handle - объект, содержащий отображение пути и функции его обработки.
 */
function start(port, route, handle) {
  http.createServer(function(request, response) {
    const pathname = url.parse(request.url).pathname;

    const dotoffset = pathname.lastIndexOf('.');
    if (dotoffset != -1) {
      const extension = pathname.substr(dotoffset + 1);
      // Обработка запроса статического файла.
      // TODO: реализовать отправку любых файлов.
      if (extension == 'ico') {
        static.favicon(response);
      } else if (extension == 'css') {
        static.css(response);
      } else if (extension == 'js') {
        static.js(response);
      } else {
        log.error(`Request ${pathname} was not recognized.`);

        response.writeHead(404, {'Content-Type': 'text/plain'});
        response.end('404 Not found');
      }
    } else {
      // Обработка запроса маршрута
      let postData = '';
      request.addListener('data', function(postDataChunk) {
        postData += postDataChunk;
      });

      request.addListener('end', function() {
        route(handle, pathname, response, postData);
      });
    }
  }).listen(port);

  stream.write(`Server has started on port ${port}.`);
}
//
exports.start = start;
