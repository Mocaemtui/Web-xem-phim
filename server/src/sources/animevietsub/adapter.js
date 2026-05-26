const SourceAdapter = require('../shared/source-adapter');
const AnimevietsubClient = require('./client');
const { animevietsubListResponseSchema, animevietsubDetailResponseSchema } = require('./schema');
const { mapToSourceMovieListItem, mapToSourceMovieDetail } = require('./mapper');
const SourceError = require('../shared/source-error');

class AnimevietsubAdapter extends SourceAdapter {
  constructor(config) {
    super(config);
    this.client = new AnimevietsubClient(config.baseUrl);
  }

  get sourceName() {
    return 'animevietsub';
  }

  async healthCheck() {
    try {
      const data = await this.client.getLatestMovies(1);
      if (data && data.status === 'success') return true;
      return false;
    } catch {
      return false;
    }
  }

  async getLatestMovies({ page = 1, limit = 24 }) {
    const rawResponse = await this.client.getLatestMovies(page);
    
    const parsed = animevietsubListResponseSchema.safeParse(rawResponse);
    if (!parsed.success) {
      throw new SourceError('Invalid Animevietsub list schema', this.sourceName, 'SCHEMA_ERROR');
    }

    const { items = [], paginate } = parsed.data;
    
    return {
      source: this.sourceName,
      page: page,
      totalPages: paginate?.total_page || null,
      totalItems: paginate?.total_items || null,
      items: items.map(mapToSourceMovieListItem)
    };
  }

  async getMovieDetail({ slug }) {
    if (!slug) return null;
    let rawSlug = slug;
    // Remove "animevietsub-" prefix if present
    if (slug.startsWith('animevietsub-')) {
      rawSlug = slug.substring(14);
    }

    try {
      const rawResponse = await this.client.getMovieDetail(rawSlug);
      
      const parsed = animevietsubDetailResponseSchema.safeParse(rawResponse);
      if (!parsed.success || !parsed.data.movie) {
        return null; // Not found or invalid
      }
  
      return mapToSourceMovieDetail(parsed.data.movie);
    } catch (err) {
      if (err.statusCode === 404) return null;
      throw err;
    }
  }

  async searchMovies({ keyword, page, limit, filters }) {
    // Animevietsub public API doesn't document a generic search easily, 
    // we return empty array to fallback to DB local search
    return {
      source: this.sourceName,
      page: 1,
      totalPages: 1,
      totalItems: 0,
      items: []
    };
  }
}

module.exports = AnimevietsubAdapter;
