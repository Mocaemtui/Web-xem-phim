function stripHtml(input) {
  if (typeof input !== 'string') return '';
  return input.replace(/<[^>]*>?/gm, '');
}

function normalizeWhitespace(input) {
  if (typeof input !== 'string') return '';
  return input.replace(/\s+/g, ' ').trim();
}

function safeText(input, maxLength = 1000) {
  const text = normalizeWhitespace(stripHtml(input));
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
}

module.exports = {
  stripHtml,
  normalizeWhitespace,
  safeText
};
