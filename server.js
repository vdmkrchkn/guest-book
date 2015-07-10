// загрузка модулей
var http = require("http"),
    url = require("url");
// включение сервера
function start(port, route, handle) {
	// создание
	http.createServer(function(request, response) {
		var pathname = url.parse(request.url).pathname;
		console.log("Request for " + pathname + " received.");		
        //
		var postData = "";
		request.addListener("data", function(postDataChunk) {
			postData += postDataChunk;			
		});
		//
		request.addListener("end", function() {			
			route(handle,pathname,response,postData);
        });
        //        
	}).listen(port); // прослушка
	// сообщение о начале работы
	console.log("Server has started.");
}
//
exports.start = start;