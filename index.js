var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");
var config = require('./config');
//
var handle = {};
handle["/"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;
handle["/show"] = requestHandlers.show;

//
var port = config.get('port');

if(port != undefined)
    server.start(port, router.route, handle);
else
    console.error('неверно задан порт сервера')