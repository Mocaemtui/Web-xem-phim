const adminRequired = (req, res, next) => {
  if (!req.user || (req.user.is_admin !== 1 && req.user.is_admin !== true)) {
    return res.status(403).json({
      data: null,
      error: { code: 'FORBIDDEN', message: 'Không có quyền truy cập' },
      meta: {}
    });
  }
  next();
};

module.exports = adminRequired;
