const { connectToDatabase } = require('./connection/mongo');
const { createResponse } = require('./utils');

exports.hello = (event) => createResponse('Hello from Serverless!', event);

exports.goodbye = (event) => createResponse('Goodbye from Serverless!', event);

exports.findByPhone = async (event) => {
  const phoneNumber = event.queryStringParameters && event.queryStringParameters.phone_number;
  if (!phoneNumber) {
    return createResponse('phone_number query parameter is required', event, 400);
  }
  try {
    const db = await connectToDatabase();
    const results = await db
      .collection('data')
      .find({ "data.phone_number": Number(phoneNumber) })
      .toArray();
    return createResponse('Phone number search results', event, 200, { results });
  } catch (err) {
    return createResponse('Database error', event, 500, { error: err.message });
  }
};