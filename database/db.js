const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');
const path = require('path');

// Dynamically resolve the path (equivalent to __path in your original code)
const __path = process.cwd();

// Assuming 'color.js' is in the 'lib' folder inside the root directory
const { color } = require(path.join(__path, 'lib/color.js'));

// Load environment variables from .env file
dotenv.config();

// Connection URL from environment variable (you can also use a direct URL here if needed)
if (!process.env.DATABASE_URL) {
  console.log(color('DATABASE_URL variable is not set', 'red'));
  throw new Error('DATABASE_URL variable is not set');
}

// Create Sequelize instance using DATABASE_URL from environment variable
const db = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',  // Specify PostgreSQL
  protocol: 'postgres', // Define protocol as PostgreSQL
  logging: false,       // Disable logging of SQL queries
});

// Log connection attempt with color
async function syncDatabase() {
  try {
    // Try syncing the database models
    await db.sync({ force: false });  // 'force: false' means don't drop/recreate tables
    console.log(color('Connected correctly to server, ZhirrrGanss', 'green'));
  } catch (err) {
    console.error(color(`Error: ${err}\n\nFailed to connect to the database. Check if the connection URL is correct.`, 'red'));
  }
}

// Call the function to sync the database
syncDatabase();

// Export the Sequelize instance (db) for use in other files
module.exports = db;
