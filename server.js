//server.js

// Importing necessary modules
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const adminRoutes = require('./app/routes/admin-routes');
const userRoutes = require('./app/routes/user-routes');
const corsOptions = require('./app/config/corsOptions');

const app = express();

// Middleware for enhancing security by setting various HTTP headers
app.use(helmet());

// Middleware for enabling Cross-Origin Resource Sharing (CORS)
app.use(cors(corsOptions));

// Middleware for HTTP request logging
app.use(morgan('combined'));

// Middleware for parsing JSON bodies from incoming requests
app.use(express.json());

// Middleware for parsing URL-encoded bodies from incoming requests
app.use(express.urlencoded({ extended: true }));

// Route handlers for admin-related routes
app.use('/api/plotbay/admin', adminRoutes);

// Route handlers for user-related routes
app.use('/api/plotbay/user', userRoutes);

// Middleware for handling 404 errors (Route not found)
app.use((req, res, next) => {
  res.status(404).send('Route not found');
});

// Middleware for handling global errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Server setup
const PORT = process.env.PORT || 1313;
// Start the server and listen on the specified port and IP
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
