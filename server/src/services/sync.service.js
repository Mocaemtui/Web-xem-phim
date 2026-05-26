const movieRepository = require('../repositories/movie.repository');
const episodeRepository = require('../repositories/episode.repository');
const { genreRepository, countryRepository, actorRepository, directorRepository } = require('../repositories/taxonomy.repository');
const NguoncAdapter = require('../sources/nguonc/adapter');
const KKPhimAdapter = require('../sources/kkphim/adapter');
const OPhimAdapter = require('../sources/ophim/adapter');
const AnimevietsubAdapter = require('../sources/animevietsub/adapter');
const Anime47Adapter = require('../sources/anime47/adapter');
const AnimehayAdapter = require('../sources/animehay/adapter');
const env = require('../config/env');
const logger = require('../utils/logger');
const pool = require('../db/pool');

const adapters = {
  nguonc: env.SOURCE_NGUONC_ENABLED ? new NguoncAdapter({ baseUrl: env.SOURCE_NGUONC_BASE_URL }) : null,
  kkphim: env.SOURCE_KKPHIM_ENABLED ? new KKPhimAdapter({ baseUrl: env.SOURCE_KKPHIM_BASE_URL }) : null,
  ophim: env.SOURCE_OPHIM_ENABLED ? new OPhimAdapter({ baseUrl: env.SOURCE_OPHIM_BASE_URL }) : null,
  animevietsub: env.SOURCE_ANIMEVIETSUB_ENABLED ? new AnimevietsubAdapter({ baseUrl: env.SOURCE_ANIMEVIETSUB_BASE_URL }) : null,
  anime47: env.SOURCE_ANIME47_ENABLED ? new Anime47Adapter({ baseUrl: env.SOURCE_ANIME47_BASE_URL }) : null,
  animehay: env.SOURCE_ANIMEHAY_ENABLED ? new AnimehayAdapter({ baseUrl: env.SOURCE_ANIMEHAY_BASE_URL }) : null
};

class SyncService {
  async logSync(source, type, key, status, statusCode = null, error = null) {
    try {
      await pool.query(
        'INSERT INTO source_sync_logs (source, target_type, target_key, status, status_code, error_message) VALUES (?, ?, ?, ?, ?, ?)',
        [source, type, key, status, statusCode, error ? String(error).substring(0, 500) : null]
      );
    } catch (err) {
      logger.error('Failed to log sync result', { err: err.message });
    }
  }

  async syncLatestFromSource(sourceName, { page = 1, limit = 24 }) {
    const adapter = adapters[sourceName];
    if (!adapter) throw new Error(`Source ${sourceName} is not enabled or supported`);

    logger.info(`Syncing latest from ${sourceName} page ${page}`);
    try {
      const result = await adapter.getLatestMovies({ page, limit });
      
      let syncedCount = 0;
      for (const item of result.items) {
        try {
          await movieRepository.upsertMovieFromSource(item);
          syncedCount++;
        } catch (err) {
          logger.error(`Error upserting movie list item ${item.slug}`, { err: err.message });
        }
      }

      await this.logSync(sourceName, 'latest', `page:${page}`, 'success', 200);
      return { syncedCount, totalItems: result.items.length };
    } catch (err) {
      await this.logSync(sourceName, 'latest', `page:${page}`, 'error', err.statusCode || 500, err.message);
      throw err;
    }
  }

  async syncMovieFromSource(sourceName, slug) {
    const adapter = adapters[sourceName];
    if (!adapter) throw new Error(`Source ${sourceName} is not enabled or supported`);

    logger.info(`Syncing movie detail from ${sourceName} slug ${slug}`);
    try {
      const detail = await adapter.getMovieDetail({ slug });
      if (!detail) {
        await this.logSync(sourceName, 'movie', slug, 'not_found', 404);
        return null;
      }

      const movieId = await movieRepository.upsertMovieFromSource(detail);
      
      await genreRepository.clearForMovie(movieId);
      await genreRepository.attachToMovie(movieId, detail.categories);

      await countryRepository.clearForMovie(movieId);
      await countryRepository.attachToMovie(movieId, detail.countries);

      await actorRepository.clearForMovie(movieId);
      await actorRepository.attachToMovie(movieId, detail.actors);

      await directorRepository.clearForMovie(movieId);
      await directorRepository.attachToMovie(movieId, detail.directors);

      await episodeRepository.replaceEpisodesForSource(movieId, sourceName, detail.episodes);

      await this.logSync(sourceName, 'movie', slug, 'success', 200);
      
      // Update cache here if needed, but usually handled in movie.service
      return await movieRepository.findBySlugWithEpisodes(detail.slug);
    } catch (err) {
      await this.logSync(sourceName, 'movie', slug, 'error', err.statusCode || 500, err.message);
      throw err;
    }
  }
}

// expose adapters for other services to use as a fallback when DB is unavailable
SyncService.prototype.getAdapters = function() {
  return adapters;
};

module.exports = new SyncService();
