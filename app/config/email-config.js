const nodemailer = require('nodemailer');
require('dotenv').config();

// Email transporter configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // SMTP server host for Gmail
  port: 587, // Common port for secure email submission
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = transporter;
