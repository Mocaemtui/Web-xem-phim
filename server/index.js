const env = require('./src/config/env');
const app = require('./src/app');
const pool = require('./src/db/pool');

// Attach the pool to app.locals so legacy routes can access it reliably.
app.locals.db = pool;

const startServer = async () => {
  try {
    // Test DB connection
    const connection = await pool.getConnection();
    console.log('Connected to MySQL database!');
    connection.release();
  } catch (err) {
    console.warn('Failed to connect to the database at startup:', err.message);
    console.warn('Continuing to start the server; DB-dependant endpoints may error until DB is available.');
  }

  app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });
};

startServer();