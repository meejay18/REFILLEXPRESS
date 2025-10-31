const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('FinalProject2', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize