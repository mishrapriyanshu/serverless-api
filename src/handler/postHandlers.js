const { connectToDatabase } = require('../../connection/mongo');
const { createResponse } = require('../utils/utils');

exports.data = async (event) => {
  const body = event.body ? JSON.parse(event.body) : {};
  try {
    const db = await connectToDatabase();
    const result = await db.collection('data').insertOne(body);
    return createResponse(
      'Data received and stored successfully!',
      event,
      201,
      { received: body, insertedId: result.insertedId }
    );
  } catch (err) {
    return createResponse('Database error', event, 500, { error: err.message });
  }
};