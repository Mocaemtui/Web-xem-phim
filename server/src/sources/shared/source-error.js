class SourceError extends Error {
  constructor(message, source, code, statusCode = 500) {
    super(message);
    this.name = 'SourceError';
    this.source = source;
    this.code = code;
    this.statusCode = statusCode;
  }
}

module.exports = SourceError;
