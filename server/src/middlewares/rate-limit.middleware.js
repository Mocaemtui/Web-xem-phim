const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per `window` (here, per 15 minutes)
  message: {
    data: null,
    error: { code: 'TOO_MANY_REQUESTS', message: 'Quá nhiều yêu cầu, vui lòng thử lại sau.' },
    meta: {}
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const publicApiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // Limit each IP to 60 requests per `window`
  message: {
    data: null,
    error: { code: 'TOO_MANY_REQUESTS', message: 'Quá nhiều yêu cầu, vui lòng thử lại sau.' },
    meta: {}
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const syncLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, 
  message: {
    data: null,
    error: { code: 'TOO_MANY_REQUESTS', message: 'Quá nhiều yêu cầu đồng bộ.' },
    meta: {}
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  authLimiter,
  publicApiLimiter,
  syncLimiter
};
