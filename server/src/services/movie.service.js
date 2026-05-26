const movieRepository = require('../repositories/movie.repository');
const syncService = require('./sync.service');
const cache = require('../cache/cache');
const CacheKeys = require('../cache/cache-keys');
const CACHE_POLICY = require('../cache/cache-policy');

const logger = require('../utils/logger');

class MovieService {
  isStale(lastSyncedAt, minutes = 30) {
    if (!lastSyncedAt) return true;
    const diff = (new Date() - new Date(lastSyncedAt)) / 1000 / 60;
    return diff > minutes;
  }

  async getMovies(filters) {
    const hash = Buffer.from(JSON.stringify(filters)).toString('base64');
    const cacheKey = CacheKeys.list(hash);
    
    const cached = await cache.get(cacheKey);
    if (cached) return { ...cached, meta: { source: 'cache', stale: false } };

    try {
      const data = await movieRepository.findAllMovies(filters);
      if ((!data.items || data.items.length === 0) && !filters.search) {
        const adapters = syncService.getAdapters();
        const combined = [];
        const page = filters.page || 1;
        const limit = filters.limit || 24;

        for (const key of Object.keys(adapters)) {
          const adapter = adapters[key];
          if (!adapter) continue;
          try {
            const res = await adapter.getLatestMovies({ page, limit });
            if (res && Array.isArray(res.items)) {
              combined.push(...res.items);
            }
          } catch (e) {
            logger.error(`Adapter ${key} failed`, { err: e.message });
          }
        }

        if (combined.length > 0) {
          const items = combined.slice(0, limit);
          const result = {
            items,
            totalItems: combined.length,
            totalPages: Math.ceil(combined.length / limit)
          };
          await cache.set(cacheKey, result, CACHE_POLICY.LIST);
          return { ...result, meta: { source: 'sources', stale: false } };
        }
      }

      await cache.set(cacheKey, data, CACHE_POLICY.LIST);
      return { ...data, meta: { source: 'db', stale: false } };
    } catch (err) {
      // If DB is down or query fails, fallback to fetching latest from enabled adapters
      logger.warn('DB unavailable, falling back to source adapters', { err: err.message });
      const adapters = syncService.getAdapters();
      const combined = [];
      const page = filters.page || 1;
      const limit = filters.limit || 24;

      for (const key of Object.keys(adapters)) {
        const adapter = adapters[key];
        if (!adapter) continue;
        try {
          const res = await adapter.getLatestMovies({ page, limit });
          if (res && Array.isArray(res.items)) {
            combined.push(...res.items);
          }
        } catch (e) {
          logger.error(`Adapter ${key} failed`, { err: e.message });
        }
      }

      // Trim to limit and return a simple list structure
      const items = combined.slice(0, limit);
      const result = { items, totalItems: combined.length, totalPages: Math.ceil(combined.length / limit) };
      await cache.set(cacheKey, result, CACHE_POLICY.LIST);
      return { ...result, meta: { source: 'sources', stale: false } };
    }
  }

  async getMovieDetailBySlug(slug) {
    const cacheKey = CacheKeys.detail(slug);
    const cached = await cache.get(cacheKey);
    if (cached) return { data: cached, meta: { source: 'cache', stale: false } };

    let dbMovie;
    try {
      dbMovie = await movieRepository.findBySlugWithEpisodes(slug);
    } catch (err) {
      logger.warn('DB unavailable when fetching movie detail, will try sources', { err: err.message });
      dbMovie = null;
    }
    
    // If missing or stale and has a source, try to refresh
    if ((!dbMovie || this.isStale(dbMovie?.lastSyncedAt, 30)) && dbMovie?.source && dbMovie.source !== 'manual') {
      try {
        const refreshed = await syncService.syncMovieFromSource(dbMovie.source, dbMovie.source_slug || slug);
        if (refreshed) {
          dbMovie = refreshed;
        }
      } catch (err) {
        // Fallback to dbMovie if exists (stale but usable)
        if (!dbMovie) throw err; 
      }
    }

    if (!dbMovie) {
      // Try to fetch from adapters directly
      const adapters = syncService.getAdapters();
      for (const key of Object.keys(adapters)) {
        const adapter = adapters[key];
        if (!adapter) continue;
        try {
          const detail = await adapter.getMovieDetail({ slug });
          if (detail) {
            await cache.set(cacheKey, detail, CACHE_POLICY.DETAIL);
            return { data: detail, meta: { source: `source:${key}`, stale: false } };
          }
        } catch (e) {
          logger.error(`Adapter ${key} failed to fetch detail`, { err: e.message });
        }
      }

      return null;
    }

    await cache.set(cacheKey, dbMovie, CACHE_POLICY.DETAIL);
    return { data: dbMovie, meta: { source: 'db', stale: this.isStale(dbMovie.lastSyncedAt, 30) } };
  }
}

module.exports = new MovieService();
