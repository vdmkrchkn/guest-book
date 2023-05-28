let subscribers = [];
// eslint-disable-next-line require-jsdoc
function subscribe(response) {
  subscribers.push(response);

  response.on('close', function() {
    subscribers.splice(subscribers.indexOf(response), 1);
  });
}

// eslint-disable-next-line require-jsdoc
function publish(message) {
  subscribers.forEach(subscriber => {
    subscriber.writeHead(200, {'Content-Type': 'application/json'});
    subscriber.end(message);
  });

  subscribers = [];
}

exports.subscribe = subscribe;
exports.publish = publish;
