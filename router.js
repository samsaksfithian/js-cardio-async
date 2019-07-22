const url = require('url');

const {
  notFound,
  getHome,
  getStatus,
  getKeyFromFile,
  getFile,
  getUnion,
  getIntersect,
  getDifference,
  getMergedData,
  patchSet,
  patchRemove,
  postWrite,
  deleteDelete,
} = require('./controller');

/**
 * Handles all of the routes and passes off to a subfunction
 * depending on the request method
 * @param {Object} request
 * @param {Object} response
 */
const handleRoutes = (request, response) => {
  const { pathname, query } = url.parse(request.url, true);
  const splitPath = pathname.split('/').slice(1);

  if (request.method === 'GET') {
    if (pathname === '/') {
      return getHome(request, response);
    }

    if (pathname === '/status') {
      return getStatus(request, response);
    }

    if (pathname === '/merge') {
      return getMergedData(request, response);
    }

    if (pathname === '/union') {
      return getUnion(request, response, query);
    }

    if (pathname === '/intersect') {
      return getIntersect(request, response, query);
    }

    if (pathname === '/difference') {
      return getDifference(request, response, query);
    }

    if (splitPath[0] === 'get' && splitPath.length > 1) {
      return getFile(request, response, pathname);
    }

    if (pathname.startsWith('/get') && Object.keys(query).length > 0) {
      return getKeyFromFile(request, response, query);
    }
  }

  if (request.method === 'PATCH') {
    if (pathname === '/set') {
      return patchSet(request, response, query);
    }

    if (pathname === '/remove') {
      return patchRemove(request, response, query);
    }
  }

  if (request.method === 'POST') {
    if (pathname.startsWith('/write')) {
      return postWrite(request, response, pathname);
    }
  }

  if (request.method === 'DELETE') {
    if (pathname.startsWith('/delete')) {
      return deleteDelete(request, response, pathname);
    }
  }

  notFound();
};

module.exports = handleRoutes;
