const logger = require('../../utils/logger');
const SourceError = require('../shared/source-error');

class NguoncClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async fetchWithRetry(url, options = {}, retries = 1) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000); // 8 seconds timeout
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (!response.ok) {
        throw new SourceError(`NguonC API error: ${response.statusText}`, 'nguonc', 'HTTP_ERROR', response.status);
      }

      return await response.json();
    } catch (error) {
      if (retries > 0 && error.name !== 'SourceError') {
        logger.warn(`Retrying fetch to ${url}. Error: ${error.message}`);
        return this.fetchWithRetry(url, options, retries - 1);
      }
      throw new SourceError(error.message, 'nguonc', 'NETWORK_ERROR', 500);
    }
  }

  async getLatestMovies(page = 1) {
    const url = `${this.baseUrl}/films/phim-moi-cap-nhat?page=${page}`;
    return this.fetchWithRetry(url);
  }

  async getMovieDetail(slug) {
    const url = `${this.baseUrl}/film/${slug}`;
    return this.fetchWithRetry(url);
  }
}

module.exports = NguoncClient;
