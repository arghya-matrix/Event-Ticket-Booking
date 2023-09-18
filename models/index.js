const sequelize = require('../db/database');
const User = require('./user');
const Event = require('./event');

sequelize.sync({alter: true});

module.exports = {
    sequelize,
    User,
    Event
}