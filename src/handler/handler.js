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
    '/create-index-and-mapping': postHandlers.createEsIndexAndMapping,
    '/insert-data': postHandlers.insertEsData,
  }
};

function normalizePath(path) {
  if (!path) return '';
  const knownPaths = [
    '/hello',
    '/goodbye',
    '/data',
    '/find-by-phone',
    '/create-index-and-mapping',
    '/insert-data'
  ];
  const matched = knownPaths.find((known) => path.endsWith(known));
  return matched || path;
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
