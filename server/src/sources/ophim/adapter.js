const SourceAdapter = require('../shared/source-adapter');

class OPhimAdapter extends SourceAdapter {
  constructor(config) {
    super(config);
    this.baseUrl = config.baseUrl;
  }

  get sourceName() {
    return 'ophim';
  }

  async healthCheck() {
    // By default, if disabled, return false
    return false;
  }

  async getLatestMovies({ page = 1, limit = 24 }) {
    return {
      source: this.sourceName,
      page: 1,
      totalPages: 1,
      totalItems: 0,
      items: []
    };
  }

  async getMovieDetail({ slug }) {
    return null;
  }

  async searchMovies({ keyword, page, limit, filters }) {
    return {
      source: this.sourceName,
      page: 1,
      totalPages: 1,
      totalItems: 0,
      items: []
    };
  }
}

module.exports = OPhimAdapter;
