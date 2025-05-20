const { connectToDatabase } = require('../../connection/mongo');
const { createResponse } = require('../utils/utils');
const { getClient } = require('../../connection/elasticsearch');

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

exports.createEsIndexAndMapping = async (event) => {
  const body = event.body ? JSON.parse(event.body) : {};
  const {esIndex, mapping} = body;
  if (!esIndex) {
    return createResponse('esIndex is required', event, 400);
  }
  if (!mapping) {
    return createResponse('mapping is required', event, 400);
  }
  try {
    const elasticsearchClient = await getClient();
    console.log('Creating index:', esIndex);
    const updateMappingResponse = await elasticsearchClient.indices.putMapping({
      index: esIndex,
      properties: mapping,
    });
    console.log(updateMappingResponse);
    return createResponse(
      'Mapping CREATED successfully!',
      event,
      201,
      { received: body, mapping: updateMappingResponse }
    );
  } catch (err) {
    return createResponse('Elastic search error', event, 500, { error: err.message });
  }
};

exports.insertEsData = async (event) => {
  const body = event.body ? JSON.parse(event.body) : {};
  const {esIndex, data} = body;
  if (!esIndex) {
    return createResponse('esIndex is required', event, 400);
  }
  if (!data) {
    return createResponse('data is required', event, 400);
  }
  const elasticsearchClient = await getClient();

  const bulkIngestResponse = await elasticsearchClient.helpers.bulk({
    index: esIndex,
    datasource: data,
    onDocument() {
      return {
        index: {},
      };
    }
  });
  console.log(bulkIngestResponse);
  return createResponse(
    'Data inserted successfully!',
    event,
    201,
    { received: body, bulkIngestResponse }
  );
}
};
