const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const corsOptions = require('./config/cors');

const routes = require('./routes');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

// Security HTTP headers
app.use(helmet());

// CORS config
app.use(cors(corsOptions));

// Parse JSON request body
app.use(express.json());

// Mount API routes
app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('Movie Website API is running! (v2)');
});

app.use(errorMiddleware);

module.exports = app;
