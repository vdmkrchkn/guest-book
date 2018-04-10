/**
 * Created by vadim on 05.07.15.
 */
var fs = require("fs");
var querystring = require("querystring");    
var Comment = require('./models/comment').Comment;


function start(response) {
    console.log("Request handler 'start' was called.");    
    getHtmlResponse("index.html", response);
}

// добавление комментария в хранилище
function upload(response, postData) {
    console.log("Request handler 'upload' was called.");
    if(postData) {        
        var name = querystring.parse(postData).name,
            mail = querystring.parse(postData).mail,
            comment = querystring.parse(postData).text;
        
        var newComment = new Comment({
            name: name, email: mail, text: comment
        });        

        // запись в хранилище
        newComment.save(function(err, comment){            
            if(err) return console.error(err);
            
            console.log(`New comment from ${comment.name} was added.`);
        });
    }   
}

function show(response) {
    console.log("Request handler 'show' was called.");                
       
    Comment.find(function (err, comments) {
        if (err) return console.error(err);

        // формирование html с заголовком таблицы
        var content = '<html><head>' +
            '<meta content="text/html" charset="UTF-8"></head>' +
            '<body><table border="1" cellpadding="5">' +
            '<tr>' + 
            '<th>Name</th>' +
            '<th>E-mail</th>' + 
            '<th>Date</th>' +
            '<th>Comment</th></tr>';

        comments.forEach(function(comment){                                                             
            if(comment) {    
            // console.log(comment.Contact());           
                // преобразование значений записи в html
                content += '<tr><td>' + comment.name + '</td>';
                content += '<td>' + comment.email + '</td>';   
                content += '<td>' + comment.text + '</td>';
                content += '<td>' + comment.dateTime + '</td>';                    
                content += '</tr>';                                    
            }
        });
        
        content += '</table></body></html>';
        // отдача содержимого браузеру
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write(content);
        response.end();    
    });
}

exports.start = start;
exports.upload = upload;
exports.show = show;

function getHtmlResponse(filename, response) {
    if(!fs.existsSync(filename)) {
        console.log(filename + ' not found');
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write("404 Not found");
        response.end();
    }
    else {
        response.writeHead(200, {"Content-Type": "text/html"});
        response.end(fs.readFileSync(filename, {'encoding': 'utf-8'}));
    }
}