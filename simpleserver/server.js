const http = require('http');

// Hello, World
/*
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
*/

const url = require('url');
const path = require('path');
const fs = require('fs');

const mimeTypes = {
  "html" : "text/html",
  "jpeg" : "image/jpeg",
  "jpg" : "image/jpg",
  "png" : "image/png",
  "js" : "text/tavascript",
  "css" : "text/css"
};

http.createServer((req, res) => {
  let uri = url.parse(req.url).pathname;
  let filename = path.join(process.cwd(), unescape(uri));
  let stats;

  // try to find requested file
  try {
    stats = fs.lstatSync(filename);
  } catch (e) {
    res.writeHead(404, {'Content-type' : 'text/plain'});
    res.write('404 Not Found\n');
    res.end();
    return;
  }

  // determine if file or directory was requested
  if (stats.isFile()) {
    const mimeType = mimeTypes[path.extname(filename).split(".").reverse()[0]]; //crazy nonsense to get the mimeType
    res.writeHead(200, { 'Content-type' : mimeType });
    const fileStream = fs.createReadStream(filename);
    fileStream.pipe(res);
  } else if (stats.isDirectory()) {
    res.writeHead(302, { 'Location' : 'index.html' });
    res.end();
  } else {
    res.writeHead(500, { 'Content-type' : 'text/plain' });
    res.write('500 Internal Error');
    res.end();
  }
}).listen(3000);
