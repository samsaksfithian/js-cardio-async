const http = require('http');
const url = require('url');
const db = require('./db');

const server = http.createServer();
const { PORT } = db;

server.on('request', (request, response) => {
  // console.log('I received a request!');
  if (request.url === '/' && request.method === 'GET') {
    response.writeHead(200, { 'my-custom-header': 'This is a great API' });
    response.end('Welcome to my server');
    return;
  }

  if (request.url === '/status' && request.method === 'GET') {
    const status = {
      up: true,
      owner: 'Sam',
      timestamp: Date.now(),
    };
    response.writeHead(200, {
      'Content-Type': 'application/json',
      'Another-Header': 'more things',
    });
    response.end(JSON.stringify(status));
    return;
  }

  const parsedUrl = url.parse(request.url, true);
  console.log(parsedUrl);
  if (parsedUrl.pathname === '/set' && request.method === 'PATCH') {
    const { file, key, value } = parsedUrl.query;
    db.set(file, key, value)
      .then(() => {
        response.end('Value set');
      })
      .catch(err => {
        // TODO: handle errors
      });
    return;
  }

  response.end('hello client');
});

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
