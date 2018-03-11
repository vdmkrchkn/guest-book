/**
 * Created by vadim on 05.07.15.
 */
var fs = require("fs");
var querystring = require("querystring");    
var Comment = require('./models/comment').Comment;
var mongoose = require('./mongoose');

function start(response) {
    console.log("Request handler 'start' was called.");    
    getHtmlResponse("index.html",response);
}

// const STORAGE = 'records.txt';

// добавление комментария в хранилище
function upload(response,postData) {
    console.log("Request handler 'upload' was called.");
    if(postData) {        
        var name = querystring.parse(postData).name,
            dt = new Date().toISOString(),
            mail = querystring.parse(postData).mail,
            comment = querystring.parse(postData).text;
        
        var newComment = new Comment({
            name: name, email: mail, text: comment, dateTime: dt
        });
        var db = mongoose.connection.db;
        // запись в хранилище
        newComment.save(function(err){
            if(err) return console.error(err);
        }).then(() => console.log(`New comment from ${newComment.Contact()} was added.`));

// var content = name + ';' + mail + ";" + dt + ';' + comment + "\n";                
// fs.appendFile(STORAGE, content, function (err) {
//     if (err) 
//         console.log(err);
//     else {
//         console.log('New comment\'s data was appended to file!');
//         response.writeHead(200, {"Content-Type": "text/html"});    
//         response.write('<form action="/show"></form>');
//         response.end();
//     }
// });
    }   
}

function show(response) {
    console.log("Request handler 'show' was called.");        
    
    // формирование html с заголовком таблицы
    var content = '<html><head>' +
        '<meta content="text/html" charset="UTF-8"></head>' +
        '<body><table border="1" cellpadding="5">' +
        '<tr>' + 
        '<th>Name</th>' +
        '<th>E-mail</th>' + 
        '<th>Date</th>' +
        '<th>Comment</th></tr>';

var i = 0;        
    Comment.find(function (err, comments) {
        if (err) return console.error(err);

        comments.forEach(function(obj){                                                             
            if(obj) {   
            console.log(`doc #${i++}`);                        
                // преобразование значений записи в html
                content += '<tr><td>' + obj.name + '</td>';
                content += '<td>' + obj.email + '</td>';   
                content += '<td>' + obj.dateTime + '</td>';    
                content += '<td>' + obj.text + '</td>'; 
                content += '</tr>';                                    
            }
        });         
    });
console.log(`total docs - ${i}`);
    content += '</table></body></html>';
    // отдача содержимого браузеру
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(content);
    response.end();     

// парсинг файла с записями
// fs.readFile(STORAGE, function (error, data) {  
//     if (error) {
//         // throw error;            
//         response.writeHead(500, {"Content-Type": "text/plain"});
//         response.write(error + "\n");
//         response.end();
//     } 
//     else {
//         // формирование html с заголовком таблицы
//         var content = '<html><head>' +
//             '<meta content="text/html" charset="UTF-8"></head>' +
//             '<body><table border="1" cellpadding="5">' +
//             '<tr>' + 
//             '<th>Name</th>' +
//             '<th>E-mail</th>' + 
//             '<th>Date</th>' +
//             '<th>Comment</th></tr>';
//         // преобразование буфера data в string
//         var text = data.toString();
//         // разбиение строки по записям
//         var lines = text.split('\n');
//         lines.forEach(function(line) {
//             if(line) {
//             var fields = line.split(';');
//             // преобразование значений записи в html
//             content += '<tr><td>' + fields[0] + '</td>';// name
//             content += '<td>' + fields[1] + '</td>';    // mail
//             content += '<td>' + fields[2] + '</td>';    // time
//             content += '<td>' + fields[3] + '</td>';    // comment
//             content += '</tr>';
//         }
//         });
//         content += '</table></body></html>';
//         // отдача содержимого браузеру
//         response.writeHead(200, {"Content-Type": "text/html"});
//         response.write(content);
//         response.end();
//     }
// });    
}

exports.start = start;
exports.upload = upload;
exports.show = show;

function getHtmlResponse(filename,response) {
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