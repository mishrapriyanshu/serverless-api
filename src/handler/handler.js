'use strict';

const getHandlers = require('./getHandlers');
const postHandlers = require('./postHandlers');
const { createResponse } = require('../utils/utils');

const routes = {
  'GET': {
    '/hello': getHandlers.hello,
    '/goodbye': getHandlers.goodbye,
    '/find-by-phone': getHandlers.findByPhone,
  },
  'POST': {
    '/data': postHandlers.data,
  }
};

function normalizePath(path) {
  if (!path) return '';
  if (path.endsWith('/hello')) return '/hello';
  if (path.endsWith('/goodbye')) return '/goodbye';
  if (path.endsWith('/data')) return '/data';
  if (path.endsWith('/find-by-phone')) return '/find-by-phone';
  return path;
}

module.exports.main = async (event) => {
  const path = normalizePath(event.path || '');
  const method = (event.httpMethod || '').toUpperCase();

  const methodRoutes = routes[method];
  if (methodRoutes && methodRoutes[path]) {
    return await methodRoutes[path](event);
  }

  return createResponse('Not Found', event, 404);
};
