class SourceAdapter {
  constructor(config) {
    this.config = config;
  }

  get sourceName() {
    throw new Error('sourceName not implemented');
  }

  async healthCheck() {
    throw new Error('healthCheck not implemented');
  }

  async getLatestMovies({ page = 1, limit = 24 }) {
    throw new Error('getLatestMovies not implemented');
  }

  async getMovieDetail({ slug }) {
    throw new Error('getMovieDetail not implemented');
  }

  async searchMovies({ keyword, page, limit, filters }) {
    throw new Error('searchMovies not implemented');
  }

  async getCategories() {
    throw new Error('getCategories not implemented');
  }

  async getCountries() {
    throw new Error('getCountries not implemented');
  }
}

module.exports = SourceAdapter;
