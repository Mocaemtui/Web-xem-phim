import http from './http';

export const moviesApi = {
  getMovies: async (params = {}) => {
    // Gọi API V2
    const res = await http.get('/v2/movies', { params });
    return res.data;
  },
  
  getMovieDetail: async (slug) => {
    const res = await http.get(`/v2/movies/slug/${slug}`);
    return res.data;
  },

  getWatchData: async (slug) => {
    const res = await http.get(`/v2/watch/slug/${slug}`);
    return res.data;
  },
  
  // Legacy support nếu cần
  getLegacyDetail: async (id) => {
    const res = await http.get(`/movie/${id}`);
    return res.data;
  }
};
