exports.createResponse = (message, event, statusCode = 200, extra = {}) => ({
  statusCode,
  body: JSON.stringify(
    {
      message,
      input: event,
      ...extra,
    },
    null,
    2
  ),
});