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

  // GET /find-by-phone?phone_number=7376198743
  if (method === 'GET' && path.endsWith('/find-by-phone')) {
    const phoneNumber = event.queryStringParameters && event.queryStringParameters.phone_number;
    if (!phoneNumber) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'phone_number query parameter is required' }, null, 2),
      };
    }
    try {
      const db = await connectToDatabase();
      // Search for documents where data.phone_number matches (as number or string)
      const results = await db.collection('data').find({ "data.phone_number": Number(phoneNumber) }).toArray();
      return {
        statusCode: 200,
        body: JSON.stringify({ results }, null, 2),
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
