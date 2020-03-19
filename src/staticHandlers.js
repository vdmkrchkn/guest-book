var fs  = require('fs'),
    log = require('./log'),
    path = require('path');

function favicon(response) {
    const filename = path.join(__dirname, 'assets', 'img', 'favicon.ico');

    if(!fs.existsSync(filename)) {
        log.error(`${filename} not found.`);

        response.writeHead(404, {"Content-Type": "text/plain"});
        response.end("404 Not found");
    } else {
        response.setHeader('Content-Type', 'image/x-icon');
        fs.createReadStream(filename)
          .pipe(response);
    }
}

function css(response) {
    const filename = path.join(__dirname, 'styles', 'mysite.css');

    if(!fs.existsSync(filename)) {
        log.error(`${filename} not found.`);

        response.writeHead(404, {"Content-Type": "text/plain"});
        response.end("404 Not found");
    } else {
        response.writeHead(200, {"Content-Type": "text/css"});
        response.end(fs.readFileSync(filename, {'encoding': 'utf-8'}));
    }
}

exports.favicon = favicon;
exports.css = css;
