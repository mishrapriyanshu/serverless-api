# Serverless API

A simple Node.js serverless API using AWS Lambda, Serverless Framework, MongoDB, Elasticsearch, and DeepSeek (OpenAI-compatible) integration.

## Features

- Serverless architecture with AWS Lambda
- RESTful endpoints (`/hello`, `/goodbye`, `/data`, `/find-by-phone`, `/openai`, `/create-index-and-mapping`, `/insert-data`)
- MongoDB integration for storing and querying data
- Elasticsearch integration for index/mapping management and bulk data ingestion
- DeepSeek (OpenAI-compatible) integration for AI chat completions
- Local development with `serverless-offline` and hot-reloading via `nodemon`
- Jest unit tests with coverage

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Serverless Framework](https://www.serverless.com/framework/docs/getting-started/)
- [MongoDB](https://www.mongodb.com/) (local or cloud)
- [Elasticsearch](https://www.elastic.co/) (cloud or local)
- [DeepSeek API Key](https://deepseek.com/) or compatible OpenAI API key

### Installation

```bash
git clone https://github.com/your-username/serverless-api.git
cd serverless-api
npm install
```

### Configuration

Set your MongoDB, Elasticsearch, and DeepSeek/OpenAI connection strings in environment variables:

```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=serverlessdb
ELASTICSEARCH_NODE=https://your-elasticsearch-url
ELASTICSEARCH_KEY=your_elasticsearch_api_key
OPENAI_API_KEY=your_deepseek_api_key
```

Or create a `.env` file in your project root with the above content.

### Running Locally

Start the serverless offline environment with hot-reloading:

```bash
npm run dev
```

### Available Scripts

- `npm run start` - Start serverless offline
- `npm run dev` - Start serverless offline with nodemon (auto-restart on file changes)
- `npm test` - Run Jest tests
- `npm run coverage` - Run Jest tests with coverage report

### Endpoints

- `GET /hello`  
  Returns a hello message.

- `GET /goodbye`  
  Returns a goodbye message.

- `POST /data`  
  Stores JSON body in MongoDB.  
  **Example body:**
  ```json
  {
    "test": true,
    "data": {
      "first_name": "Priyanshu Mishra",
      "phone_number": 7376198743
    }
  }
  ```

- `GET /find-by-phone?phone_number=7376198743`  
  Returns all documents where `data.phone_number` matches the provided number.

- `POST /create-index-and-mapping`  
  Creates or updates an Elasticsearch index mapping.  
  **Example body:**
  ```json
  {
    "esIndex": "my-index",
    "mapping": {
      "field1": { "type": "text" },
      "field2": { "type": "keyword" }
    }
  }
  ```

- `POST /insert-data`  
  Bulk inserts data into an Elasticsearch index.  
  **Example body:**
  ```json
  {
    "esIndex": "my-index",
    "data": [
      { "field1": "value1", "field2": "value2" },
      { "field1": "value3", "field2": "value4" }
    ]
  }
  ```
- `GET /openai`  
  Calls DeepSeek's chat completion API with a sample prompt and returns the AI's response.

- `POST /openai`  
  Accepts a JSON body and returns a generic response (customize as needed).
- `GET /openai`  
  Calls DeepSeek's chat completion API with a sample prompt and returns the AI's response.

- `POST /openai`  
  Accepts a JSON body and returns a generic response (customize as needed).

### Project Structure

```
.
├── src/
│   ├── handler/
│   │   ├── handler.js
│   │   ├── getHandlers.js
│   │   └── postHandlers.js
│   ├── openai/
│   │   └── openai.js
│   ├── utils.js
│   └── connection/
│       ├── mongo.js
│       └── elasticsearch.js
├── serverless.yaml
├── package.json
├── .env
└── ...
```

## Testing

Run all tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run coverage
```

## License

ISC
