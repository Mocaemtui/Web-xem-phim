const NodeCache = require('node-cache');
const env = require('../config/env');
const logger = require('../utils/logger');

// Initialize memory cache
const cacheStore = new NodeCache({ stdTTL: 600, checkperiod: 120 });

const cache = {
  get: async (key) => {
    try {
      if (env.CACHE_DRIVER === 'memory') {
        return cacheStore.get(key);
      }
      return null;
    } catch (err) {
      logger.error('Cache GET error', { key, error: err.message });
      return null;
    }
  },

  set: async (key, value, ttlSeconds) => {
    try {
      if (env.CACHE_DRIVER === 'memory') {
        cacheStore.set(key, value, ttlSeconds);
        return true;
      }
      return false;
    } catch (err) {
      logger.error('Cache SET error', { key, error: err.message });
      return false;
    }
  },
  
  del: async (key) => {
    try {
      if (env.CACHE_DRIVER === 'memory') {
        cacheStore.del(key);
        return true;
      }
      return false;
    } catch (err) {
      logger.error('Cache DEL error', { key, error: err.message });
      return false;
    }
  }
};

module.exports = cache;
