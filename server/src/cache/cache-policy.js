const env = require('../config/env');

const CACHE_POLICY = {
  LIST: env.CACHE_TTL_LIST, // default 600s (10m)
  DETAIL: env.CACHE_TTL_DETAIL, // default 1800s (30m)
  WATCH: 900, // 15m
  SEARCH: 300, // 5m
  HEALTH: 120, // 2m
  NOT_FOUND: 60, // 1m
};

module.exports = CACHE_POLICY;
