const { Op } = require("sequelize");
const db = require("../models/index");

async function getPublicEvent({ pageSize, index, orderOptions , whereOptions }) {
  const event = await db.Event.findAndCountAll({
    where: whereOptions,
    order: orderOptions,
    limit: pageSize,
    offset: index,
  });
  return event;
}

async function getPrivateEvent({ pageSize, index, orderOptions }) {
  const event = await db.Event.findAndCountAll({
    include:[{
      model : db.Vip,
      attributes : ['user_id'],
      include : [
        {
          model: db.User,
          attributes : ['Name', 'user_name']
        }
      ]
    }] ,
    where: {
      type: "private",
    },
    order: orderOptions,
    limit: pageSize,
    offset: index,
  });

  // console.log(vipUsers, "<<-----Vip Users for the event");
  return event;
}

async function getOneEvent({ event_name }) {
  const event = await db.Event.findOne({
    where: {
      event_name: event_name
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
    return ({ sum, eventData });
  }
}

async function getEventForUser({ whereOptions, pageSize, index, orderOptions }) {
  const event = await db.Event.findAndCountAll({
    where: whereOptions,
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

async function addVipUser({ user_id, event_name }) {
  const event = await db.Event.findOne({
    where: {
      event_name: event_name
    }
  });
  const event_id = event.event_id
  user_id.map(async (id) => {

    await db.Vip.bulkCreate([{
      user_id: id,
      event_id: event_id
    }])
  });

  const vip_user = await db.Vip.findAll({
    include: [{
      model: db.Event,
      attributes: ['event_name', 'event_date', 'max_people', 'type']
    }, {
      model: db.User,
      attributes: ['Name', 'user_name'],
      where: {
        user_id: user_id
      }
    }],
    where: {
      event_id: event_id
    }
  })
  return vip_user;
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
  sumOfSeats,
  addVipUser
};
