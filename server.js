// загрузка модулей
var http = require("http"),
	url = require("url"),
	log = require('./log');

// включение сервера
function start(port, route, handle) {
	// создание
	http.createServer(function(request, response) {
		var pathname = url.parse(request.url).pathname;
		log.info(`Request for ${pathname} received.`);		
        //
		var postData = "";
		request.addListener("data", function(postDataChunk) {
			postData += postDataChunk;			
		});
		//
		request.addListener("end", function() {			
			route(handle, pathname, response, postData);
        });
        //        
	}).listen(port); // прослушка
	// сообщение о начале работы
	log.info(`Server has started on port ${port}.`);
}
//
exports.start = start;