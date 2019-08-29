const crypto = require('crypto');

module.exports.getShortenedUrl = (fullUrl) => {
  return crypto.createHash('sha1').update(fullUrl).digest('hex');
}
