const logger = require('../utils/logger');
const env = require('../config/env');

const errorMiddleware = (err, req, res, next) => {
  logger.error(err.message, { stack: env.NODE_ENV === 'development' ? err.stack : undefined });

  const statusCode = err.statusCode || 500;
  const message = err.isOperational || env.NODE_ENV === 'development' 
    ? err.message 
    : 'Lỗi máy chủ nội bộ';

  res.status(statusCode).json({
    data: null,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: message
    },
    meta: {}
  });
};

module.exports = errorMiddleware;
