const { Op } = require("sequelize");
const db = require("../models/index");

async function getPublicEvent({ pageSize, index, orderOptions }) {
  const event = await db.Event.findAndCountAll({
    where: {
      type: "public",
    },
    order: orderOptions,
    limit: pageSize,
    offset: index,
  });
  return event;
}

async function getPrivateEvent({ pageSize, index, orderOptions }) {
  const event = await db.Event.findAndCountAll({
    where: {
      type: "private",
    },
    order: orderOptions,
    limit: pageSize,
    offset: index,
  });
  return event;
}

async function getOneEvent({ event_id }) {
  const event = await db.Event.findOne({
    where: {
      event_id: event_id
    }
  })
  return event;
}

async function updateEvent({ updateOptions, whereOptions }) {
  await db.Event.update(updateOptions, {
    where: whereOptions,
  });
  const event = await db.Event.findAll({
    where: whereOptions,
    raw: true,
  });
  return event;
}

async function createEvent({ event_details }) {
  const event = await db.Event.create(event_details);
  return event;
}

async function deleteEvent({ event_name }) {
  await db.Event.destroy({
    where: {
      event_name: event_name,
    },
  });
  return `${event_name} Name is deleted.`;
}

async function seatBooking({ event_name, seat, user_id }) {
  const data = await db.Event.findOne({
    where: {
      event_name: event_name
    }
  });
  const sum = await db.Log.sum('booked_seat');
  const event_id = data.event_id;


  if (sum <= data.max_people) {
    await db.Log.create({
      event_id: event_id,
      booked_seat: seat,
      user_id: user_id,
    });
    return await db.User.findOne({
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
  } else {
    const sum = await db.Log.sum('booked_seat');
    const eventData = "Max People reached";
    return ({sum, eventData});
  }
}

async function getEventForUser({ currentDate, pageSize, index, orderOptions }) {
  const event = await db.Event.findAndCountAll({
    where: {
      event_date: { [Op.gte]: currentDate },
    },
    order: orderOptions,
    limit: pageSize,
    offset: index,
  });
  return event;
}

async function sumOfSeats() {
  const sum = await db.Log.sum('booked_seat');
  return sum;
}

module.exports = {
  getPublicEvent,
  updateEvent,
  createEvent,
  deleteEvent,
  getPrivateEvent,
  seatBooking,
  getEventForUser,
  getOneEvent,
  sumOfSeats
};
