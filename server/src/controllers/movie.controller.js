const movieService = require('../services/movie.service');
const asyncHandler = require('../utils/async-handler');

const getMovies = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 24;
  const search = req.query.keyword || '';

  const result = await movieService.getMovies({ page, limit, search });
  
  res.json({
    data: result,
    error: null,
    meta: result.meta || {}
  });
});

const getMovieBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const result = await movieService.getMovieDetailBySlug(slug);
  
  if (!result) {
    return res.status(404).json({
      data: null,
      error: { code: 'MOVIE_NOT_FOUND', message: 'Không tìm thấy phim' },
      meta: {}
    });
  }

  res.json({
    data: result.data,
    error: null,
    meta: result.meta || {}
  });
});

module.exports = {
  getMovies,
  getMovieBySlug
};
