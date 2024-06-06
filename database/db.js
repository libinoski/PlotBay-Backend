// db.js
const mysql = require('mysql');
const dbConfig = require('../database/db-config');

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    throw err; 
  }
  console.log('Connected to database');
});

module.exports = connection;
