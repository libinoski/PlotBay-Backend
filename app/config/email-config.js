// email-config.js

// Import nodemailer module and dotenv for environment variables
const nodemailer = require('nodemailer');
require('dotenv').config();

// Email transporter configuration using nodemailer
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // SMTP server host for Gmail
  port: 587, // Common port for secure email submission
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // Gmail username retrieved from environment variables
    pass: process.env.EMAIL_PASS, // Gmail password retrieved from environment variables
  },
});

// Export the email transporter for use in other modules
module.exports = transporter;
