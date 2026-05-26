const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authLimiter } = require('../middlewares/rate-limit.middleware');

router.post('/login', authLimiter, authController.login);

module.exports = router;
