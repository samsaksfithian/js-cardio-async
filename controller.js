// const url = require('url');
const fs = require('fs').promises;
const db = require('./db');

exports.notFound = async (request, response) => {
  const html = await fs.readFile('404.html');
  // handle any unhandled routes
  response.writeHead(404, { 'Content-Type': 'text/html' });
  response.end(html);
};

// ===========================================================

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

// ===========================================================

/**
 * Gets and returns the value of the given key from the
 * object in the given file
 * @param {Object} request incoming message
 * @param {Object} response server response
 * @param {Object} query the parsed query from the url
 * @param {string} query.file the name of the file to access
 * @param {string} query.key the key to get from the object
 */
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
 * Gets and returns all of the data out of a given file
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
 * Takes two files and logs all the properties of both of them
 * combined as a list without duplicates
 * @param {Object} request incoming message
 * @param {Object} response server response
 * @param {Object} query the parsed query from the url
 * @param {string} query.fileA the first file
 * @param {string} query.fileB the second file
 */
exports.getUnion = (request, response, { fileA, fileB }) =>
  db
    .union(fileA, fileB)
    .then(data => {
      response.writeHead(200);
      response.end(data);
    })
    .catch(err => {
      response.writeHead(400, { 'Content-Type': 'text/html' });
      response.end(err.message);
    });

/**
 * Takes two files and returns all the properties
 * that both objects share
 * @param {Object} request incoming message
 * @param {Object} response server response
 * @param {Object} query the parsed query from the url
 * @param {string} query.fileA the first file
 * @param {string} query.fileB the second file
 */
exports.getIntersect = (request, response, { fileA, fileB }) =>
  db
    .intersect(fileA, fileB)
    .then(data => {
      response.writeHead(200);
      response.end(data);
    })
    .catch(err => {
      response.writeHead(400, { 'Content-Type': 'text/html' });
      response.end(err.message);
    });

/**
 * Takes two files and gets all properties that are
 * different between the two objects
 * @param {Object} request incoming message
 * @param {Object} response server response
 * @param {Object} query the parsed query from the url
 * @param {string} query.fileA the first file
 * @param {string} query.fileB the second file
 */
exports.getDifference = (request, response, { fileA, fileB }) =>
  db
    .difference(fileA, fileB)
    .then(data => {
      response.writeHead(200);
      response.end(data);
    })
    .catch(err => {
      response.writeHead(400, { 'Content-Type': 'text/html' });
      response.end(err.message);
    });

/**
 * Gets and returns the merged data from all of the database files
 * @param {Object} request incoming message
 * @param {Object} response server response
 */
exports.getMergedData = (request, response) =>
  db
    .mergeData()
    .then(() => fs.readFile('mergedData.json'))
    .then(fileData => {
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(fileData);
    })
    .catch(err => {
      response.writeHead(400, { 'Content-Type': 'text/html' });
      response.end(err.message);
    });

// ===========================================================
// ===========================================================

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
 * Takes a query and removes some of the data in the
 * database for the provided key
 * @param {Object} request incoming message
 * @param {Object} response server response
 * @param {Object} query the parsed query from the url
 */
exports.patchRemove = (request, response, { file, key }) => {
  if (!file || !key) {
    response.writeHead(400);
    return response.end('Bad Request');
  }
  return db
    .remove(file, key)
    .then(info => {
      response.writeHead(200);
      response.end(info);
    })
    .catch(err => {
      response.writeHead(400, { 'Content-Type': 'text/html' });
      response.end(err.message);
    });
};

// ===========================================================
// ===========================================================

/**
 * Creates a file with the data given in the request body
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

// ===========================================================
// ===========================================================

/**
 * Deletes the specified
 * @param {Object} request incoming message
 * @param {Object} response server response
 * @param {string} pathname the path string
 */
exports.deleteDelete = (request, response, pathname) =>
  db
    .deleteFile(pathname.split('/')[2])
    .then(() => {
      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.end('File deleted');
    })
    .catch(err => {
      // file doesn't exist
      response.writeHead(400, { 'Content-Type': 'text/html' });
      response.end(err.message);
    });

// ===========================================================
// ===========================================================
