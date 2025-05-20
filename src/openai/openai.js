'use strict';
require('dotenv').config();

// Please install OpenAI SDK first: `npm install openai`
const OpenAI = require('openai');
const { createResponse } = require('../utils/utils');

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.OPENAI_API_KEY, // Use your DeepSeek API Key from .env
});

module.exports.handler = async (event) => {
  const method = (event.httpMethod || '').toUpperCase();

  if (method === 'GET') {
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: "Are semicolons optional in JavaScript?" }
        ],
        model: "deepseek-chat",
      });

      const output = completion.choices[0].message.content;
      return createResponse('DeepSeek GET endpoint response', event, 200, { output });
    } catch (error) {
      console.error('DeepSeek error:', error);
      return createResponse('Error from DeepSeek', event, 500, { error: error.message });
    }
  } else if (method === 'POST') {
    const body = event.body ? JSON.parse(event.body) : {};
    return createResponse('DeepSeek POST endpoint response', event, 200, { received: body });
  }

  return createResponse('Method Not Allowed', event, 405);
};
