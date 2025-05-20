const postHandlers = require('./postHandlers');
const { connectToDatabase } = require('../../connection/mongo');
const { getClient } = require('../../connection/elasticsearch');

jest.mock('../../connection/mongo', () => ({
  connectToDatabase: jest.fn(),
}));
jest.mock('../../connection/elasticsearch', () => ({
  getClient: jest.fn(),
}));

const mockEvent = (body) => ({
  body: JSON.stringify(body),
});

describe('postHandlers.data', () => {
  it('should insert data and return success response', async () => {
    const mockInsertOne = jest.fn().mockResolvedValue({ insertedId: 'mockedId' });
    const mockDb = { collection: () => ({ insertOne: mockInsertOne }) };
    connectToDatabase.mockResolvedValue(mockDb);

    const event = {
      body: JSON.stringify({ test: true, data: { first_name: 'Test', phone_number: 1234567890 } }),
    };

    const response = await postHandlers.data(event);
    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.body).message).toBe('Data received and stored successfully!');
    expect(JSON.parse(response.body).insertedId).toBe('mockedId');
  });

  it('should handle missing body gracefully', async () => {
    const mockInsertOne = jest.fn().mockResolvedValue({ insertedId: 'mockedId' });
    const mockDb = { collection: () => ({ insertOne: mockInsertOne }) };
    connectToDatabase.mockResolvedValue(mockDb);

    const event = {}; // No body property
    const response = await postHandlers.data(event);
    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.body).message).toBe('Data received and stored successfully!');
    expect(JSON.parse(response.body).insertedId).toBe('mockedId');
  });

  it('should handle database errors gracefully', async () => {
    connectToDatabase.mockRejectedValue(new Error('DB error'));

    const event = {
      body: JSON.stringify({ test: true }),
    };

    const response = await postHandlers.data(event);
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body).message).toBe('Database error');
  });
});

describe('postHandlers.createEsIndexAndMapping', () => {
  it('should return 400 if esIndex is missing', async () => {
    const event = mockEvent({ mapping: {} });
    const response = await postHandlers.createEsIndexAndMapping(event);
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body).message).toBe('esIndex is required');
  });

  it('should return 400 if mapping is missing', async () => {
    const event = mockEvent({ esIndex: 'test-index' });
    const response = await postHandlers.createEsIndexAndMapping(event);
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body).message).toBe('mapping is required');
  });

  it('should return 201 and mapping response on success', async () => {
    const mockPutMapping = jest.fn().mockResolvedValue({ acknowledged: true });
    getClient.mockResolvedValue({
      indices: { putMapping: mockPutMapping }
    });
    const event = mockEvent({ esIndex: 'test-index', mapping: { field: { type: 'text' } } });
    const response = await postHandlers.createEsIndexAndMapping(event);
    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.body).mapping).toEqual({ acknowledged: true });
    expect(mockPutMapping).toHaveBeenCalledWith({
      index: 'test-index',
      properties: { field: { type: 'text' } }
    });
  });

  it('should handle elasticsearch errors', async () => {
    getClient.mockResolvedValue({
      indices: { putMapping: jest.fn().mockRejectedValue(new Error('ES error')) }
    });
    const event = mockEvent({ esIndex: 'test-index', mapping: { field: { type: 'text' } } });
    const response = await postHandlers.createEsIndexAndMapping(event);
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body).message).toBe('Elastic search error');
  });
});

describe('postHandlers.insertEsData', () => {
  it('should return 400 if esIndex is missing', async () => {
    const event = mockEvent({ data: [{ foo: 'bar' }] });
    const response = await postHandlers.insertEsData(event);
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body).message).toBe('esIndex is required');
  });

  it('should return 400 if data is missing', async () => {
    const event = mockEvent({ esIndex: 'test-index' });
    const response = await postHandlers.insertEsData(event);
    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body).message).toBe('data is required');
  });

  it('should return 201 and bulkIngestResponse on success', async () => {
    const mockBulk = jest.fn().mockResolvedValue({ success: true });
    getClient.mockResolvedValue({
      helpers: { bulk: mockBulk }
    });
    const event = mockEvent({ esIndex: 'test-index', data: [{ foo: 'bar' }] });
    const response = await postHandlers.insertEsData(event);
    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.body).bulkIngestResponse).toEqual({ success: true });
    expect(mockBulk).toHaveBeenCalledWith({
      index: 'test-index',
      datasource: [{ foo: 'bar' }],
      onDocument: expect.any(Function)
    });
  });

  it('should handle elasticsearch errors', async () => {
    getClient.mockResolvedValue({
      helpers: { bulk: jest.fn().mockRejectedValue(new Error('ES error')) }
    });
    const event = mockEvent({ esIndex: 'test-index', data: [{ foo: 'bar' }] });
    // Add try/catch if your handler doesn't catch errors internally
    let response;
    try {
      response = await postHandlers.insertEsData(event);
    } catch (err) {
      // If your handler doesn't catch, you can check here
      expect(err.message).toBe('ES error');
      return;
    }
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body).message).toBe('Database error');
  });
});