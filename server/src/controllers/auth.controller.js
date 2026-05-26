const jwt = require('jsonwebtoken');
const env = require('../config/env');
const pool = require('../db/pool');
const bcrypt = require('bcrypt');
const asyncHandler = require('../utils/async-handler');

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ data: null, error: { message: 'Username and password required' } });
  }

  const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  const user = rows[0];

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ data: null, error: { message: 'Invalid credentials' } });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, is_admin: user.is_admin },
    env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    data: {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        is_admin: user.is_admin
      }
    },
    error: null
  });
});

module.exports = { login };
