const fs = require('fs');
const log = require('./log');
const path = require('path');

/**
 * Ответ на запрос об иконке страницы.
 * @param {any} response - объект ответа.
 */
function favicon(response) {
  const filename = path.join(__dirname, '..', 'assets', 'img', 'favicon.ico');

  if (!fs.existsSync(filename)) {
    log.error(`${filename} not found.`);

    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.end('404 Not found');
  } else {
    response.setHeader('Content-Type', 'image/x-icon');
    fs.createReadStream(filename)
        .pipe(response);
  }
}

/**
 * Ответ на запрос о стиле страницы.
 * @param {any} response - объект ответа.
 */
function css(response) {
  const filename = path.join(__dirname, '..', 'build', 'css', 'main.css');

  if (!fs.existsSync(filename)) {
    log.error(`${filename} not found.`);

    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.end('404 Not found');
  } else {
    response.writeHead(200, {'Content-Type': 'text/css'});
    response.end(fs.readFileSync(filename, {'encoding': 'utf-8'}));
  }
}

/**
 * Ответ на запрос о скрипте страницы.
 * @param {any} response - объект ответа.
 */
function js(response) {
  const filename = path.join(__dirname, '..', 'build', 'js', 'main.js');

  if (!fs.existsSync(filename)) {
    log.error(`${filename} not found.`);

    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.end('404 Not found');
  } else {
    response.writeHead(200, {'Content-Type': 'text/javascript'});
    response.end(fs.readFileSync(filename, {'encoding': 'utf-8'}));
  }
}

exports.favicon = favicon;
exports.css = css;
exports.js = js;
