/**
 * Created by vdmkrchkn on 05.07.15.
 */
const fs = require('fs');
const path = require('path');

const log = require('./log');
const Comment = require('./models/comment').Comment;
const {subscribe, publish} = require('./subscriber');

/**
 * Отображение начальной страницы.
 * @param {any} response - объект ответа.
 */
function start(response) {
  const filename = path.join('build', 'index.html');

  if (!fs.existsSync(filename)) {
    log.error(`${filename} not found.`);
    //
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.end('404 Not found');
  } else {
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end(fs.readFileSync(filename, {'encoding': 'utf-8'}));
  }
}

/**
 * Добавление комментария.
 * @param {any} response - объект ответа.
 * @param {any} postData
 */
function upload(response, postData) {
  log.info('Request handler \'upload\' was called.');

  if (postData) {
    new Comment({
      name: JSON.parse(postData).name,
      email: JSON.parse(postData).mail,
      text: JSON.parse(postData).text,
    }).save(function(err, comment) {
      if (err) {
        log.error(err);

        response.writeHead(500, err);
        response.end();
      } else {
        log.info(`New comment from ${comment.getContact()} was added.`);

        publish(JSON.stringify({
          name: comment.name,
          email: comment.email,
          text: comment.text,
          dt: comment.getPrettyDateTime(),
        }));

        response.writeHead(200, {'Content-Type': 'application/json'});
        response.end(JSON.stringify({dt: comment.getPrettyDateTime()}));
      }
    });
  } else {
    response.writeHead(400, 'No data provided');
    response.end();
  }
}

/**
 * Отображение списка комментариев.
 * @param {any} response - объект ответа.
 */
function show(response) {
  log.info('Request handler \'show\' was called.');

  Comment.find(function(err, comments) {
    if (err) {
      return log.error(err);
    };

    response.writeHead(200, {'Content-Type': 'application/json'});
    response.end(JSON.stringify(comments.map(comment => ({
      name: comment.name,
      email: comment.email,
      text: comment.text,
      dt: comment.getPrettyDateTime(),
    }))));
  });
}

exports.start = start;
exports.upload = upload;
exports.show = show;
exports.subscribe = subscribe;
