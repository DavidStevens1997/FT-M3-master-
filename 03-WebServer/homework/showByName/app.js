var fs  = require("fs")
var http  = require("http")

// Escribí acá tu servidor
http.createServer((req,res) => {
    fs.readFile(`${__dirname}/images/${req.url}.jpg`, (err, data) => {
        if (err) {
            res.writeHead(404, {"Content-type": "text/plain"});
            res.end("hubo un erro");
        } else {
            res.writeHead(200, {"Content-type": "image/jpg"});
            res.end(data);
        }
    });
    
}).listen(3000, '127.0.0.1')
