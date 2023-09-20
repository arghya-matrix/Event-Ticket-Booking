const { DataTypes } = require("sequelize");
const sequelize = require("../db/database");

const Vip = sequelize.define("Vip_user",{
    event_id : {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    user_id:{
        type : DataTypes.INTEGER,
        allowNull : true
    }
});

module.exports = Vip