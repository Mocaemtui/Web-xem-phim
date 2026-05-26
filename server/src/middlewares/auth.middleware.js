const jwt = require('jsonwebtoken');
const env = require('../config/env');

const authRequired = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      data: null,
      error: { code: 'UNAUTHORIZED', message: 'Vui lòng đăng nhập' },
      meta: {}
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded; // { id, username, is_admin }
    next();
  } catch (err) {
    return res.status(401).json({
      data: null,
      error: { code: 'UNAUTHORIZED', message: 'Token không hợp lệ hoặc đã hết hạn' },
      meta: {}
    });
  }
};

module.exports = authRequired;
