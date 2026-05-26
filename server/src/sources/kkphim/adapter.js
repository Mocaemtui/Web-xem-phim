const SourceAdapter = require('../shared/source-adapter');
const KKPhimClient = require('./client');
const { kkphimListResponseSchema, kkphimDetailResponseSchema } = require('./schema');
const { mapToSourceMovieListItem, mapToSourceMovieDetail } = require('./mapper');
const SourceError = require('../shared/source-error');

class KKPhimAdapter extends SourceAdapter {
  constructor(config) {
    super(config);
    this.client = new KKPhimClient(config.baseUrl);
  }

  get sourceName() {
    return 'kkphim';
  }

  async healthCheck() {
    try {
      const data = await this.client.getLatestMovies(1);
      if (data && data.status === true) return true;
      return false;
    } catch {
      return false;
    }
  }

  async getLatestMovies({ page = 1, limit = 64 }) {
    const rawResponse = await this.client.getLatestMovies(page);
    
    const parsed = kkphimListResponseSchema.safeParse(rawResponse);
    if (!parsed.success) {
      throw new SourceError('Invalid KKPhim list schema', this.sourceName, 'SCHEMA_ERROR');
    }

    const { items = [], pagination } = parsed.data;
    
    return {
      source: this.sourceName,
      page: page,
      totalPages: pagination?.totalPages || null,
      totalItems: pagination?.totalItems || null,
      items: items.map(mapToSourceMovieListItem)
    };
  }

  async getMovieDetail({ slug }) {
    if (!slug) return null;
    let rawSlug = slug;
    if (slug.startsWith('kkphim-')) {
      rawSlug = slug.substring(7);
    }

    try {
      const rawResponse = await this.client.getMovieDetail(rawSlug);
      
      const parsed = kkphimDetailResponseSchema.safeParse(rawResponse);
      if (!parsed.success || !parsed.data.movie) {
        return null;
      }
  
      return mapToSourceMovieDetail(parsed.data.movie, parsed.data.episodes);
    } catch (err) {
      if (err.statusCode === 404) return null;
      throw err;
    }
  }

  async searchMovies({ keyword, page, limit, filters }) {
    // Currently relying on DB search
    return {
      source: this.sourceName,
      page: 1,
      totalPages: 1,
      totalItems: 0,
      items: []
    };
  }
}

module.exports = KKPhimAdapter;
