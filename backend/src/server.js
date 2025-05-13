require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { logger } = require('./utils/logger');
const proxyRoutes = require('./routes/proxy.routes');
const { errorHandler } = require('./middleware/error.middleware');

const app = express();
const PORT = process.env.PORT || 4000;

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://v0-new-project-mzrne9oo3mq.vercel.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/proxies', proxyRoutes);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
}); 