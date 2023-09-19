const {DataTypes, UUIDV4} = require('sequelize');
const sequelize = require('../db/database');

const User = sequelize.define(
    'Users',{
        user_id : {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull : false,
            unique : true,
            primaryKey: true
        },
        uuid : {
            type : DataTypes.UUID,
            defaultValue :UUIDV4
        },
        Name : {
            type : DataTypes.STRING,
            allowNull : false
        },
        user_name:{
            type : DataTypes.STRING,
            allowNull: false
        },
        email_address : {
            type : DataTypes.STRING,
            allowNull: false
        },
        password : {
            type : DataTypes.STRING,
            allowNull: false
        },
        user_type:{
            type : DataTypes.STRING,
            defaultValue: "User",
            allowNull: false
        }
    },{
        id: false
    }
)

module.exports = User;