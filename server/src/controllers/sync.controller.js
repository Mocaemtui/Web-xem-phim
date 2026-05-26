const syncService = require('../services/sync.service');
const asyncHandler = require('../utils/async-handler');

const syncLatest = asyncHandler(async (req, res) => {
  const { source } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 24;

  const result = await syncService.syncLatestFromSource(source, { page, limit });
  
  res.json({
    data: result,
    error: null,
    meta: { source }
  });
});

const syncMovie = asyncHandler(async (req, res) => {
  const { source, slug } = req.params;

  const result = await syncService.syncMovieFromSource(source, slug);
  
  if (!result) {
    return res.status(404).json({
      data: null,
      error: { code: 'NOT_FOUND', message: 'Không tìm thấy phim trên nguồn' },
      meta: { source }
    });
  }

  res.json({
    data: result,
    error: null,
    meta: { source }
  });
});

module.exports = {
  syncLatest,
  syncMovie
};
