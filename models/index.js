const sequelize = require("../db/database");
const User = require("./user");
const Event = require("./event");
const Log = require("./event_booking_log");
const Vip = require('./vip_users');

User.hasMany(Log, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Log.belongsTo(User, {
  foreignKey: "user_id",
});

Event.hasMany(Log, {
  foreignKey: "event_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Log.belongsTo(Event, {
  foreignKey: "event_id",
});

User.hasMany(Vip , {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
})
Vip.belongsTo(User, {
  foreignKey : "user_id"
})

Event.hasMany(Vip, {
  foreignKey: "event_id",
  onDelete : "CASCADE",
  onUpdate : "CASCADE"
})
Vip.belongsTo(Event, {
  foreignKey : "event_id"
})

sequelize.sync({ alter: true });



module.exports = {
  sequelize,
  User,
  Event,
  Log,
  Vip
};
