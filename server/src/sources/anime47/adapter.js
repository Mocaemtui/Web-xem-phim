const SourceAdapter = require('../shared/source-adapter');
const Anime47Client = require('./client');
const { anime47ListResponseSchema, anime47DetailResponseSchema } = require('./schema');
const { mapToSourceMovieListItem, mapToSourceMovieDetail } = require('./mapper');
const SourceError = require('../shared/source-error');

class Anime47Adapter extends SourceAdapter {
  constructor(config) {
    super(config);
    this.client = new Anime47Client(config.baseUrl);
  }

  get sourceName() {
    return 'anime47';
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
    
    const parsed = anime47ListResponseSchema.safeParse(rawResponse);
    if (!parsed.success) {
      throw new SourceError('Invalid Anime47 list schema', this.sourceName, 'SCHEMA_ERROR');
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
    // Remove "anime47-" prefix if present
    if (slug.startsWith('anime47-')) {
      rawSlug = slug.substring(8);
    }

    try {
      const rawResponse = await this.client.getMovieDetail(rawSlug);
      
      const parsed = anime47DetailResponseSchema.safeParse(rawResponse);
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
    // Anime47 public API doesn't document a generic search easily, 
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

module.exports = Anime47Adapter;
