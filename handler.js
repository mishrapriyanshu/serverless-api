'use strict';

const { connectToDatabase } = require('./mongo');

// Common response helper
const createResponse = (message, event, statusCode = 200) => ({
  statusCode,
  body: JSON.stringify(
    {
      message,
      input: event,
    },
    null,
    2
  ),
});

// Single exported handler
module.exports.main = async (event) => {
  const path = event.path || '';
  const method = (event.httpMethod || '').toUpperCase();

  if (method === 'GET' && path.endsWith('/hello')) {
    return createResponse('Hello from Serverless!', event);
  }
  if (method === 'GET' && path.endsWith('/goodbye')) {
    return createResponse('Goodbye from Serverless!', event);
  }
  if (method === 'POST' && path.endsWith('/data')) {
    const body = event.body ? JSON.parse(event.body) : {};
    try {
      const db = await connectToDatabase();
      const result = await db.collection('data').insertOne(body);
      return {
        statusCode: 201,
        body: JSON.stringify(
          {
            message: 'Data received and stored successfully!',
            received: body,
            insertedId: result.insertedId,
          },
          null,
          2
        ),
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Database error', error: err.message }, null, 2),
      };
    }
  }
  return createResponse('Not Found', event, 404);
};
