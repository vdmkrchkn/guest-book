/**
 * Created by vdmkrchkn on 05.07.15.
 */
var log = require('./log');

function route(handle, pathname, response, postData) {
    log.info(`Routing a request for ${pathname}.`);
    if (typeof handle[pathname] === 'function') {
        return handle[pathname](response, postData);
    } else {
        log.error(`No request handler found for ${pathname}.`);
        //
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.end("404 Not found");
    }
}

exports.route = route;