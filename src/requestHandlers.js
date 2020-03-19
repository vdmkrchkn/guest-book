/**
 * Created by vdmkrchkn on 05.07.15.
 */
var fs  = require('fs'),
    log = require('./log'),
    Comment = require('./models/comment').Comment,
    querystring = require('querystring'),
    path = require('path');

function start(response) {
    const filename = path.join(__dirname, 'index.html');

    if(!fs.existsSync(filename)) {
        log.error(`${filename} not found.`);
        //
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.end("404 Not found");
    }
    else {
        response.writeHead(200, {"Content-Type": "text/html"});
        response.end(fs.readFileSync(filename, {'encoding': 'utf-8'}));
    }
}

// добавление комментария в хранилище
function upload(response, postData) {
    log.info("Request handler 'upload' was called.");

    if(postData) {
        var name = querystring.parse(postData).name,
            mail = querystring.parse(postData).mail,
            comment = querystring.parse(postData).text;

        var newComment = new Comment({
            name: name, email: mail, text: comment
        });

        // запись в хранилище
        newComment.save(function(err, comment){
            if(err) return log.error(err);

            log.info(`New comment from ${comment.Contact()} was added.`);
        });
    }
}

function show(response) {
    log.info("Request handler 'show' was called.");

    Comment.find(function (err, comments) {
        if (err) return log.error(err);

        // формирование html списка комментариев
        var content = '<html><head>' +
            '<meta content="text/html" charset="UTF-8"></head>' +
            '<body><table border="1" cellpadding="5">' +
            '<tr>' +
            '<th>Name</th>' +
            '<th>E-mail</th>' +
            '<th>Comment</th>' +
            '<th>Date</th></tr>';

        comments.forEach(function(comment){
            if(comment) {
                // преобразование значений записи в html
                content += '<tr><td>' + comment.name + '</td>';
                content += '<td>' + comment.email + '</td>';
                content += '<td>' + comment.text + '</td>';
                content += '<td>' + comment.DateTime() + '</td>';
                content += '</tr>';
            }
        });

        content += '</table></body></html>';

        // отдача комментариев браузеру
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write(content);
        response.end();
    });
}

exports.start = start;
exports.upload = upload;
exports.show = show;
