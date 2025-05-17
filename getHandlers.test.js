const getHandlers = require('./getHandlers');
const { connectToDatabase } = require('./connection/mongo');

jest.mock('./connection/mongo', () => ({
  connectToDatabase: jest.fn(),
}));

describe('getHandlers', () => {
  describe('hello', () => {
    it('should return hello message', () => {
      const event = {};
      const response = getHandlers.hello(event);
      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body).message).toBe('Hello from Serverless!');
    });
  });

  describe('goodbye', () => {
    it('should return goodbye message', () => {
      const event = {};
      const response = getHandlers.goodbye(event);
      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body).message).toBe('Goodbye from Serverless!');
    });
  });

  describe('findByPhone', () => {
    it('should return 400 if phone_number is missing', async () => {
      const event = { queryStringParameters: {} };
      const response = await getHandlers.findByPhone(event);
      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body).message).toBe('phone_number query parameter is required');
    });

    it('should return results if phone_number is provided', async () => {
      const mockResults = [
        { data: { first_name: 'Test', phone_number: 1234567890 } }
      ];
      const mockToArray = jest.fn().mockResolvedValue(mockResults);
      const mockCollection = jest.fn(() => ({ find: jest.fn(() => ({ toArray: mockToArray })) }));
      connectToDatabase.mockResolvedValue({ collection: mockCollection });

      const event = { queryStringParameters: { phone_number: '1234567890' } };
      const response = await getHandlers.findByPhone(event);
      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.message).toBe('Phone number search results');
      expect(body.results).toEqual(mockResults);
    });

    it('should handle database errors', async () => {
      connectToDatabase.mockRejectedValue(new Error('DB error'));
      const event = { queryStringParameters: { phone_number: '1234567890' } };
      const response = await getHandlers.findByPhone(event);
      expect(response.statusCode).toBe(500);
      expect(JSON.parse(response.body).message).toBe('Database error');
    });
  });
});