'use strict';
require('dotenv').config();
const { Client } = require('@elastic/elasticsearch');

const client = new Client({
  node: process.env.ELASTICSEARCH_NODE,
  auth: {
    apiKey: process.env.ELASTICSEARCH_KEY,
  }
});

/**
 * Test the Elasticsearch connection.
 */
async function testConnection() {
  try {
    const health = await client.cluster.health();
    console.log('Elasticsearch cluster health:', health.status);
    return true;
  } catch (error) {
    console.error('Elasticsearch connection error:', error.message);
    return false;
  }
}

/**
 * Get the Elasticsearch client instance.
 */
function getClient() {
  return client;
}

module.exports = {
  getClient,
  testConnection,
};