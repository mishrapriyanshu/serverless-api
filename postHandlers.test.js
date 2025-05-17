const postHandlers = require('./postHandlers');
const { connectToDatabase } = require('./connection/mongo');

jest.mock('./connection/mongo', () => ({
  connectToDatabase: jest.fn(),
}));

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