// testConnection.js
require('dotenv').config();
const { Sequelize } = require('sequelize');

// Pull values directly from your .env
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT,
    logging: console.log, // so you can see the SQL
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected successfully!');
    console.log('🔹 Host:', process.env.DB_HOST);
    console.log('🔹 Database:', process.env.DB_NAME);
    console.log('🔹 User:', process.env.DB_USER);

    // Optional: list all tables in the connected DB
    const [results] = await sequelize.query('SHOW TABLES;');
    console.log('\n📦 Tables in this database:');
    console.table(results);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  } finally {
    await sequelize.close();
  }
})();
