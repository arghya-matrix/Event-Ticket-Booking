const { Op } = require("sequelize");
const db = require("../models/index");

async function existingBookedEvent({ event_name, user_id }) {
  const event = await db.Event.findOne({
    where: {
      event_name: event_name,
    },
  });
  const event_id = event.event_id;
  const log = await db.Log.findAndCountAll({
    where: {
      event_id: event_id,
      user_id: user_id,
    },
  });
  return log;
}

async function addMoreSeat({ event_name, user_id, seat }) {
  const event = await db.Event.findOne({
    where: {
      event_name: event_name,
    },
  });
  const event_id = event.event_id;
  const logSum = await db.Log.sum('booked_seat');
  const sum = logSum+seat;

  const logData = await db.Log.findOne({
    where: {
      event_id: event_id,
      user_id: user_id,
    },
    raw: true,
  });

  ////////////////<<<<<<<<<<<<<<<<<<<----------------------->>>>>>>>>>>>>>>>>>>>>>>/////////////////
  const maxBookingPerUser = event.max_booking_per_user;
  const alreadyBookedSeatByUser = logData.booked_seat;

  if (maxBookingPerUser >= alreadyBookedSeatByUser + seat && event.max_people >= sum) {
    await db.Log.update(
      {
        booked_seat: db.sequelize.literal(`booked_seat + ${seat}`),
      },
      {
        where: {
          user_id: user_id,
          event_id: event_id,
        },
      }
    );
    const eventData = await db.User.findOne({
      attributes: ["uuid", "Name", "email_address", "createdAt"],
      include: {
        model: db.Log,
        attributes: ["booked_seat", "createdAt"],
        include: {
          model: db.Event,
        },
        where: {
          event_id: event_id,
        },
      },
      where: {
        user_id: user_id,
      },
    });
    return ({eventData, sum});
  }
  else {
    const value = alreadyBookedSeatByUser + seat - maxBookingPerUser;
    if(value>0){
      return `Max Seat Booking per person exceeds by ${value}`;
    }
    else if(value<0){
      return `Max people reached`
    }
  }
}

module.exports = {
  existingBookedEvent,
  addMoreSeat,
};
