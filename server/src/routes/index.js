const express = require('express');
const router = express.Router();

const movieRoutes = require('./movie.routes');
const watchRoutes = require('./watch.routes');
const syncRoutes = require('./sync.routes');
const authRoutes = require('./auth.routes');

// Legacy routes
const legacyRoutes = require('../../routes');

// V2 Routes
router.use('/v2/movies', movieRoutes);
router.use('/v2/watch', watchRoutes);
router.use('/v2/sync', syncRoutes);
router.use('/v2/auth', authRoutes);

// V1 Legacy routes
router.use('/', legacyRoutes);

module.exports = router;
