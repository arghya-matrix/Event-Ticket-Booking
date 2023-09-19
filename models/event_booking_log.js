const sequelize = require('../db/database');
const { DataTypes } = require('sequelize')

const Log = sequelize.define(
    "event_booking_log",{
        event_id:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        user_id:{
            type: DataTypes.INTEGER,
            allowNull:false
        },
        booked_seat:{
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }
)

module.exports = Log;