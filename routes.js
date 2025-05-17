const { hello, goodbye } = require('./handler');

module.exports = {
  '/hello': hello,
  '/goodbye': goodbye,
};