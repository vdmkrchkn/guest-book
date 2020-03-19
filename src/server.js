// загрузка модулей
var http = require("http"),
	url = require("url"),
    stream = require('./log').stream,
    static = require('./staticHandlers');

// включение сервера
function start(port, route, handle) {
	// создание
	http.createServer(function(request, response) {
		const pathname = url.parse(request.url).pathname;
        stream.write(`Request for ${pathname} received.`);

        const dotoffset = pathname.lastIndexOf('.');
        if (dotoffset != -1) {
            const extension = pathname.substr(dotoffset);
            // Обработка запроса статического файла.
            // TODO: реализовать отправку для каждого `extension`
            if (pathname == "/favicon.ico") {
                static.favicon(response);
            } else if (pathname == "/styles/mysite.css") {
                static.css(response);
            } else {
                response.writeHead(404, {"Content-Type": "text/plain"});
                response.end("404 Not found");
            }
        } else {
            // Обработка запроса маршрута
            let postData = "";
            request.addListener("data", function(postDataChunk) {
                postData += postDataChunk;
            });
            //
            request.addListener("end", function() {
                route(handle, pathname, response, postData);
            });
        }
	}).listen(port); // прослушка
	// сообщение о начале работы
	stream.write(`Server has started on port ${port}.`);
}
//
exports.start = start;