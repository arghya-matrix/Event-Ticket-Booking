const {DataTypes} = require('sequelize');
const sequelize = require('../db/database');
const moment = require('moment');

const event = sequelize.define(
    "Event", {
        event_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,

        }, 
        event_name:{
            type:DataTypes.STRING,
            allowNull: false
        },
        event_date:{
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        type:{
            type : DataTypes.ENUM(['private', 'public']),
            allowNull: true,
            defaultValue: 'private'
        },
        last_date : {
            type: DataTypes.DATEONLY,
            allowNull: true,
            defaultValue: function() {
                return moment(this.getDataValue('event_date')-24*60*60*1000).format("YYYY-MM-DD")
            }
        },
        max_people : {
            type: DataTypes.INTEGER,
            defaultValue : 200
        },
        max_booking:{
            type: DataTypes.INTEGER,
            defaultValue: 10
        },
        createdAt : DataTypes.DATEONLY
    },{
        updatedAt: false
    }
)

module.exports = event;