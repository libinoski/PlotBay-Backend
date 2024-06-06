//server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const adminRoutes = require('./app/routes/admin-routes');
const userRoutes = require('./app/routes/user-routes');
const corsOptions = require('./app/config/corsOptions');

const app = express();

// Middleware for security, logging, and parsing
app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route handlers
app.use('/api/plotbay/admin', adminRoutes);
app.use('/api/plotbay/user', userRoutes);

// 404 error handler
app.use((req, res, next) => {
  res.status(404).send('Route not found');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Server setup
const PORT = process.env.PORT || 1313;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
