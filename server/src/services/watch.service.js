const movieService = require('./movie.service');
const cache = require('../cache/cache');
const CacheKeys = require('../cache/cache-keys');
const CACHE_POLICY = require('../cache/cache-policy');

class WatchService {
  async getWatchDataBySlug(slug) {
    const cacheKey = CacheKeys.watch(slug);
    const cached = await cache.get(cacheKey);
    if (cached) return { data: cached, meta: { source: 'cache', stale: false } };

    const movieResult = await movieService.getMovieDetailBySlug(slug);
    if (!movieResult || !movieResult.data) return null;

    // Filter or organize episodes if needed
    const watchData = movieResult.data;

    await cache.set(cacheKey, watchData, CACHE_POLICY.WATCH);
    return { data: watchData, meta: { ...movieResult.meta, type: 'watch' } };
  }
}

module.exports = new WatchService();
