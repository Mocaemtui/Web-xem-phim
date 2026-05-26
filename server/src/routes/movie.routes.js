const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movie.controller');
const { publicApiLimiter } = require('../middlewares/rate-limit.middleware');

router.get('/', publicApiLimiter, movieController.getMovies);
router.get('/slug/:slug', publicApiLimiter, movieController.getMovieBySlug);

// Keeping /id/:id for consistency if needed, but not implemented in controller yet
// router.get('/id/:id', publicApiLimiter, movieController.getMovieById);

module.exports = router;
