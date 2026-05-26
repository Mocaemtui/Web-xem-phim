const fs = require('fs');
const mysql = require('mysql2/promise');
const path = require('path');

async function importDatabase() {
  try {
    // First connect without database to create it
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '2222'
    });

    console.log('Connected to MySQL server');

    // Drop database if exists and create new one
    await connection.query('DROP DATABASE IF EXISTS movie_website');
    await connection.query('CREATE DATABASE movie_website CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci');
    console.log('Database movie_website created');

    await connection.end();

    // Now connect to the new database
    const dbConnection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '2222',
      database: 'movie_website',
      multipleStatements: true
    });

    console.log('Connected to movie_website database');

    // Read and execute SQL file
    const sqlFile = path.join(__dirname, 'movie_website.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    console.log('Executing SQL file...');
    await dbConnection.query(sql);
    console.log('SQL import completed successfully');

    await dbConnection.end();
    console.log('Done!');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

importDatabase();
