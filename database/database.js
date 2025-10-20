const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('FINALPROJECT', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize