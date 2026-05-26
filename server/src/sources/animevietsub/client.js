const logger = require('../../utils/logger');
const SourceError = require('../shared/source-error');

class AnimevietsubClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async fetchWithRetry(url, options = {}, retries = 1) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000); // 8 seconds timeout
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
          'Referer': this.baseUrl,
          ...options.headers
        }
      });
      clearTimeout(timeout);

      if (!response.ok) {
        throw new SourceError(`Animevietsub API error: ${response.statusText}`, 'animevietsub', 'HTTP_ERROR', response.status);
      }

      return await response.json();
    } catch (error) {
      if (retries > 0 && error.name !== 'SourceError') {
        logger.warn(`Retrying fetch to ${url}. Error: ${error.message}`);
        return this.fetchWithRetry(url, options, retries - 1);
      }
      throw new SourceError(error.message, 'animevietsub', 'NETWORK_ERROR', 500);
    }
  }

  async getLatestMovies(page = 1) {
    const url = `${this.baseUrl}/api/danh-sach/phim-moi?page=${page}`;
    return this.fetchWithRetry(url);
  }

  async getMovieDetail(slug) {
    const url = `${this.baseUrl}/api/phim/${slug}`;
    return this.fetchWithRetry(url);
  }
}

module.exports = AnimevietsubClient;
