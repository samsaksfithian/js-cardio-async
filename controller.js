// const url = require('url');
const fs = require('fs').promises;
const db = require('./db');

exports.notFound = async (request, response) => {
  const html = await fs.readFile('404.html');
  // handle any unhandled routes
  response.writeHead(404, { 'Content-Type': 'text/html' });
  response.end(html);
};

/**
 * Gets the homepage
 * @param {Object} request incoming message
 * @param {Object} response server response
 */
exports.getHome = (request, response) => {
  response.writeHead(200, { 'my-custom-header': 'This is a great API' });
  response.end('Welcome to my server');
};

/**
 * Gets the server status
 * @param {Object} request incoming message
 * @param {Object} response server response
 */
exports.getStatus = (request, response) => {
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
};

exports.getKeyFromFile = (request, response, { file, key }) => {
  if (!file || !key) {
    response.writeHead(400);
    return response.end('Bad Request');
  }
  return db
    .get(file, key)
    .then(value => {
      response.writeHead(200);
      response.end(value);
    })
    .catch(err => {
      response.writeHead(400, { 'Content-Type': 'text/html' });
      response.end(err.message);
    });
};

/**
 *
 * @param {Object} request incoming message
 * @param {Object} response server response
 * @param {string} pathname the path string
 */
exports.getFile = (request, response, pathname) =>
  db
    .getFile(pathname.split('/')[2])
    .then(fileData => {
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(fileData);
    })
    .catch(err => {
      response.writeHead(400, { 'Content-Type': 'text/html' });
      response.end(err.message);
    });

/**
 * Takes a query and sets the data in the database based
 * on the query object data
 * @param {Object} request incoming message
 * @param {Object} response server response
 * @param {Object} query the parsed query from the url
 */
exports.patchSet = (request, response, { file, key, value }) => {
  // check if file, key, and value are all defined
  if (!file || !key || !value) {
    response.writeHead(400);
    return response.end('Bad Request');
  }

  // fire off the db set method
  return db
    .set(file, key, value)
    .then(() => {
      response.writeHead(200);
      response.end('Value set');
    })
    .catch(err => {
      // TODO: more robust error handling
      // console.error(err);
      response.writeHead(400, { 'Content-Type': 'text/html' });
      response.end(err.message);
    });
};

/**
 *
 * @param {Object} request incoming message
 * @param {Object} response server response
 * @param {string} pathname the path string
 */
exports.postWrite = (request, response, pathname) => {
  const data = [];
  request.on('data', chunk => data.push(chunk));
  request.on('end', async () => {
    const body = JSON.parse(data);
    try {
      await db.createFile(pathname.split('/')[2], body);
      response.writeHead(201, { 'Content-Type': 'text/html' });
      response.end('File written');
    } catch (err) {
      // file already exists
      response.writeHead(400, { 'Content-Type': 'text/html' });
      response.end(err.message);
    }
  });
};
