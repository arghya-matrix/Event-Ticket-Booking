const moment = require('moment');
const sequelize = require('../db/database');
const {DataTypes} = require('sequelize');
const Sessions = sequelize.define('Sessions',{
    user_id : {
        type : DataTypes.INTEGER,
        allowNull: true
    },
    login_date : {
        type : DataTypes.DATE,
        allowNull: true,
        defaultValue : DataTypes.NOW
    },
    logout_date : {
        type: DataTypes.DATE,
        allowNull : true
    },
    expiry_date:{
        type : DataTypes.DATE,
        allowNull: true
    }
})

module.exports = Sessions; 