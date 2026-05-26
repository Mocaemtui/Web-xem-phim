const express = require('express');
const router = express.Router();
const watchController = require('../controllers/watch.controller');
const { publicApiLimiter } = require('../middlewares/rate-limit.middleware');

router.get('/slug/:slug', publicApiLimiter, watchController.getWatchBySlug);

module.exports = router;
