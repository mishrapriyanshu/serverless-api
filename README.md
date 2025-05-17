# Serverless API

A simple Node.js serverless API using AWS Lambda, Serverless Framework, and MongoDB.

## Features

- Serverless architecture with AWS Lambda
- RESTful endpoints (`/hello`, `/goodbye`, `/data`, `/find-by-phone`)
- MongoDB integration for storing and querying data
- Local development with `serverless-offline` and hot-reloading via `nodemon`

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [Serverless Framework](https://www.serverless.com/framework/docs/getting-started/)
- [MongoDB](https://www.mongodb.com/) (local or cloud)

### Installation

```bash
git clone https://github.com/your-username/serverless-api.git
cd serverless-api
npm install
```

### Configuration

Set your MongoDB connection string in environment variables:

```bash
export MONGODB_URI="mongodb://localhost:27017"
export MONGODB_DB="serverlessdb"
```

Or create a `.env` file (if using [dotenv](https://www.npmjs.com/package/dotenv)):

```
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=serverlessdb
```

### Running Locally

Start the serverless offline environment with hot-reloading:

```bash
npm run dev
```

### Available Scripts

- `npm run start` - Start serverless offline
- `npm run dev` - Start serverless offline with nodemon (auto-restart on file changes)

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
  **Example response:**
  ```json
  {
    "results": [
      {
        "_id": "6828f059691978971b8f798f",
        "test": true,
        "data": {
          "first_name": "Priyanshu Mishra",
          "phone_number": 7376198743
        }
      }
    ]
  }
  ```

### Project Structure

```
.
├── handler.js
├── mongo.js
├── serverless.yaml
├── package.json
└── ...
```

## License

ISC
