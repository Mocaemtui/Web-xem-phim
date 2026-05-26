const express = require('express');
const router = express.Router();
const syncController = require('../controllers/sync.controller');
const authRequired = require('../middlewares/auth.middleware');
const adminRequired = require('../middlewares/admin.middleware');
const { syncLimiter } = require('../middlewares/rate-limit.middleware');

router.use(authRequired, adminRequired, syncLimiter);

router.post('/:source/latest', syncController.syncLatest);
router.post('/:source/movie/:slug', syncController.syncMovie);

module.exports = router;
