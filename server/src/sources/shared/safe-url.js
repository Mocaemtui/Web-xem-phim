const env = require('../../config/env');

function safeHttpsUrl(input) {
  if (typeof input !== 'string' || !input.trim()) return null;
  try {
    const url = new URL(input);
    if (url.protocol !== 'https:' && !(env.NODE_ENV === 'development' && url.hostname === 'localhost')) {
      return null;
    }
    return url.toString();
  } catch {
    return null;
  }
}

function safeImageUrl(input) {
  return safeHttpsUrl(input);
}

function safeEmbedUrl(input) {
  return safeHttpsUrl(input);
}

module.exports = {
  safeHttpsUrl,
  safeImageUrl,
  safeEmbedUrl
};
