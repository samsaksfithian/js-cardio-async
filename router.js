const url = require('url');

const {
  notFound,
  getHome,
  getStatus,
  getFile,
  patchSet,
  postWrite,
} = require('./controller');

/**
 * Handles all of the routes and passes off to a subfunction
 * depending on the request method
 * @param {Object} request
 * @param {Object} response
 */
const handleRoutes = (request, response) => {
  const { pathname, query } = url.parse(request.url, true);

  if (request.method === 'GET') {
    if (pathname === '/') {
      return getHome(request, response);
    }

    if (pathname === '/status') {
      return getStatus(request, response);
    }

    if (pathname.startsWith('/get')) {
      return getFile(request, response, pathname);
    }
  }

  if (request.method === 'PATCH') {
    if (pathname === '/set') {
      return patchSet(request, response, query);
    }
  }

  if (request.method === 'POST') {
    if (pathname.startsWith('/write')) {
      return postWrite(request, response, pathname);
    }
  }

  notFound();
};

module.exports = handleRoutes;
