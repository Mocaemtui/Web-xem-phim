const SourceAdapter = require('../shared/source-adapter');
const NguoncClient = require('./client');
const { nguoncListResponseSchema, nguoncDetailResponseSchema } = require('./schema');
const { mapToSourceMovieListItem, mapToSourceMovieDetail } = require('./mapper');
const SourceError = require('../shared/source-error');

class NguoncAdapter extends SourceAdapter {
  constructor(config) {
    super(config);
    this.client = new NguoncClient(config.baseUrl);
  }

  get sourceName() {
    return 'nguonc';
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
    
    const parsed = nguoncListResponseSchema.safeParse(rawResponse);
    if (!parsed.success) {
      throw new SourceError('Invalid NguonC list schema', this.sourceName, 'SCHEMA_ERROR');
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
    // Remove "nguonc-" prefix if present
    if (slug.startsWith('nguonc-')) {
      rawSlug = slug.substring(7);
    }

    try {
      const rawResponse = await this.client.getMovieDetail(rawSlug);
      
      const parsed = nguoncDetailResponseSchema.safeParse(rawResponse);
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
    // NguonC public API doesn't document a generic search easily, 
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

module.exports = NguoncAdapter;
