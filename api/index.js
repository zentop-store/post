const autoPost = require('./auto-post');

module.exports = (req, res) => {
  return autoPost(req, res);
};
