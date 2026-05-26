const watchService = require('../services/watch.service');
const asyncHandler = require('../utils/async-handler');

const getWatchBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const result = await watchService.getWatchDataBySlug(slug);
  
  if (!result) {
    return res.status(404).json({
      data: null,
      error: { code: 'MOVIE_NOT_FOUND', message: 'Không tìm thấy dữ liệu xem phim' },
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
  getWatchBySlug
};
