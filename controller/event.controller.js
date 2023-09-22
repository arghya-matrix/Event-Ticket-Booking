const eventServices = require("../services/event.services");
const moment = require("moment");
const logServices = require("../services/log.services");
const db = require("../models/index");
const { Op } = require("sequelize");

// async function getEvent(req, res) {
//   try {
//     const page = req.query.page ? req.query.page : 1;
//     const itemsInPage = req.query.size;

//     const orderOptions = [];

//     const size = itemsInPage ? +itemsInPage : 3;
//     const index = page ? (page - 1) * size : 0;

//     if (req.query.colName && req.query.orderName) {
//       orderOptions.push([req.query.colName, req.query.orderName]);
//     } else {
//       orderOptions.push(["event_date", "ASC"]);
//     }
//     const whereOptions = {};

//

//     if (req.query.event_date) {
//       whereOptions.event_date = moment(req.query.event_date).format("YYYY-MM-DD");
//     }
//     whereOptions.type = "public";
//     const currentDate = moment().format("YYYY-MM-DD");
//     whereOptions.event_date = { [Op.gte]: currentDate };

//     const event = await eventServices.getPublicEvent({
//       index: index,
//       orderOptions: orderOptions,
//       pageSize: size,
//       whereOptions: whereOptions
//     });
//     // console.log(event,'Event data');
//     const currentPage = page ? +page : 1;
//     const totalPages = Math.ceil(event.count / size);

//     if (event.count > 0) {
//       res.json({
//         "Total Pages": totalPages,
//         "Total Items": event.count,
//         "Current Page": currentPage,
//         message: `${event.count} Events Found`,
//         data: event.rows,
//       });
//     } else {
//       res.status(404).json({
//         message: `no data found`
//       })
//     }
//   } catch (error) {
//     res.status(500).json({
//       message: `Server Error`,
//       err: error,
//     });
//   }
// }

async function getPublicEventForUser(req, res) {
  try {
    const page = req.query.page ? req.query.page : 1;
    const itemsInPage = req.query.size;

    const orderOptions = [];
    const whereOptions = {};
    const currentDate = moment().format("YYYY-MM-DD");

    const size = itemsInPage ? +itemsInPage : 3;
    const index = page ? (page - 1) * size : 0;

    if (req.query.colName && req.query.orderName) {
      orderOptions.push([req.query.colName, req.query.orderName]);
    } else {
      orderOptions.push(["event_date", "ASC"]);
    }

    if (req.query.event_name) {
      whereOptions.event_name = {
        [Op.substring]: req.query.event_name,
      };
    }

    if (req.query.type) {
      whereOptions.type = req.query.type;
    }

    whereOptions.event_date = { [Op.gte]: currentDate };

    const value = await eventServices.getEventForUser({
      index: index,
      pageSize: size,
      orderOptions: orderOptions,
      whereOptions: whereOptions,
      user_id: req.userdata.user_id,
    });
    const event = value.message;
    const currentPage = page ? +page : 1;
    const totalPages = Math.ceil(event.count / size);
    if (value.statuscode == 200) {
      res.json({
        "Total Pages": totalPages,
        "Total Items": event.count,
        "Current Page": currentPage,
        message: `${event.count} latest events found`,
        events: event.rows,
      });
    } else {
      res.status(value.statuscode).json({
        message: value.message,
      });
    }
  } catch (error) {
    console.log(error, "<-----An error occured");
    res.status(500).json({
      message: `Server Error`,
      err: error,
    });
  }
}

async function seatBooking(req, res) {
  try {
    const log = await logServices.existingBookedEvent({
      event_name: req.body.event_name,
      user_id: req.userdata.user_id,
    });
    if (log.count == 0 || log.count == null || log.count == undefined) {
      const event = await eventServices.seatBooking({
        event_name: req.body.event_name,
        seat: req.body.no_of_seat,
        user_id: req.userdata.user_id,
      });
      res.json({
        // message: `${req.body.no_of_seat} seats have booked for you`,
        data: event,
      });
    } else {
      const event = await logServices.addMoreSeat({
        event_name: req.body.event_name,
        seat: req.body.no_of_seat,
        user_id: req.userdata.user_id,
      });

      res.json({
        "Total Seat Booked": event.sum,
        data: event.eventData,
        message: event,
      });
    }
  } catch (error) {
    console.log(error, "<-----An error occured");
    res.status(500).json({
      message: `Server Error`,
      err: error,
    });
  }
}

async function getEventForAdmin(req, res) {
  try {
    const page = req.query.page ? req.query.page : 1;
    const itemsInPage = req.query.size;
    const whereOptions = {};
    const orderOptions = [];

    const size = itemsInPage ? +itemsInPage : 3;
    const index = page ? (page - 1) * size : 0;

    if (req.query.colName && req.query.orderName) {
      orderOptions.push([req.query.colName, req.query.orderName]);
    } else {
      orderOptions.push(["event_name", "ASC"]);
    }

    if (req.query.event_name) {
      whereOptions.event_name = {
        [Op.like]: `%${req.query.event_name}`,
      };
    }

    if (req.query.event_date) {
      whereOptions.event_date = req.query.event_date;
    }

    if (req.query.type) {
      whereOptions.type = req.query.type;
    }

    if (req.userdata.type == "Admin") {
      const event = await eventServices.getPrivateEvent({
        index: index,
        pageSize: size,
        orderOptions: orderOptions,
        whereOptions: whereOptions,
      });
      const currentPage = page ? +page : 1;
      const totalPages = Math.round(event.count / size);

      res.json({
        "Total Pages": totalPages,
        "Total Items": event.count,
        "Current Page": currentPage,
        message: `${event.count} Events Found`,
        data: event.rows,
      });
    } else {
      res.status(403).json({
        message: `Event can be seen by Admin only`,
      });
    }
  } catch (error) {
    console.log(error, "<-----An error occured");
    res.status(500).json({
      message: `Server Error`,
      err: error,
    });
  }
}

async function createEvent(req, res) {
  try {
    if (req.userdata.type == "Admin") {
      const event_details = {};

      if (req.body.type) {
        event_details.type = req.body.type;
      }

      if (req.body.event_date) {
        const date = moment(req.body.event_date).format("YYYY-MM-DD");
        const currentDate = moment().format("YYYY-MM-DD");
        if (date < currentDate) {
          return res.json({
            message: `Cannot add event in past.`,
          });
        } else {
          event_details.event_date = date;
        }
      }

      if (req.body.last_date) {
        const lastDate = moment(req.body.last_date).format("YYYY-MM-DD");
        const date = moment(req.body.event_date).format("YYYY-MM-DD");
        if (lastDate > date) {
          return res.json({
            message: `Cannot add Last booking Date after the event completion`,
          });
        } else {
          event_details.last_date = lastDate;
        }
      }

      if (req.body.max_people > 0) {
        event_details.max_people = req.body.max_people;
      } else if (req.body.max_people < 0) {
        return res.json({
          message: `Max People value should be greater than 0`,
        });
      }

      if (req.body.max_booking_per_user > 0) {
        if (req.body.max_people > req.body.max_booking_per_user) {
          event_details.max_booking_per_user = req.body.max_booking_per_user;
        } else {
          return res.json({
            message: `Max booking Per user can not be greater than max people`,
          });
        }
      } else if (req.body.max_booking_per_user < 0) {
        return res.json({
          message: `Max Booking per user should be greater than 0`,
        });
      }

      if (req.body.event_name) {
        event_details.event_name = req.body.event_name;
      }

      const event = await eventServices.createEvent({
        event_details: event_details,
      });
      res.json({
        message: `${req.body.event_name} created`,
        data: event,
      });
    } else {
      res.status(403).json({
        message: `Event can be created by Admin only`,
      });
    }
  } catch (error) {
    console.log(error, "<-----An error occured");
    res.status(500).json({
      message: `Server Error`,
      err: error,
    });
  }
}

async function updateEvent(req, res) {
  try {
    if (req.userdata.type == "Admin") {
      const updateOptions = {};
      const whereOptions = {};
      ///////////////Update Type//////////////////////////

      if (req.query.type) {
        updateOptions.type = req.query.type;
      }
      /////////////////////////////Update Date//////////////////////////////////////

      if (req.query.event_date) {
        const date = moment(req.query.event_date).format("YYYY-MM-DD");
        const currentDate = moment().format("YYYY-MM-DD");
        if (date >= currentDate) {
          updateOptions.event_date = date;
        } else {
          return res.json({
            message: `Cannot update event date to past`,
          });
        }
      }

      if (req.query.last_date) {
        const date = moment(req.query.last_date).format("YYYY-MM-DD");
        const currentDate = moment().format("YYYY-MM-DD");
        if (date >= currentDate) {
          updateOptions.last_date = date;
        } else {
          return res.json({
            message: `Cannot update event booking last date to past`,
          });
        }
      }

      if (req.query.max_people) {
        updateOptions.max_people = req.query.max_people;
      }

      if (req.query.max_booking) {
        updateOptions.max_booking = req.query.max_booking;
      }

      if (req.query.event_name) {
        updateOptions.event_name = req.query.event_name;
      }
      ///////////////////Where Options////////////////////////
      if (req.query.event_id) {
        whereOptions.event_id = req.query.event_id;
      }

      const event = await eventServices.updateEvent({
        updateOptions: updateOptions,
        whereOptions: whereOptions,
      });
      res.json({
        message: `${req.query.event_id} updated`,
        data: event,
      });
    } else {
      res.status(403).json({
        message: `Event can be updated by Admin only`,
      });
    }
  } catch (error) {
    console.log(error, "<-----An error occured");
    res.status(500).json({
      message: `Server Error`,
      err: error,
    });
  }
}

async function deleteEvent(req, res) {
  try {
    if ((req.userdata.type = "Admin")) {
      const event = await eventServices.deleteEvent({
        event_name: req.query.event_name,
      });
      res.json({
        message: event,
      });
    } else {
      res.status(403).json({
        message: `Event can be deleted by Admin only`,
      });
    }
  } catch (error) {
    console.log(error, "<-----An error occured");
    res.status(500).json({
      message: `Server Error`,
      err: error,
    });
  }
}

async function addVipUser(req, res) {
  try {
    if (req.userdata.type == "Admin") {
      const idArray = req.body.user_id;
      const vipUser = await eventServices.addVipUser({
        event_name: req.body.event_name,
        user_id: idArray,
      });
      res.json({
        message: `Vip User Added`,
        data: vipUser,
      });
    } else {
      res.status(403).json({
        message: `Permission denied. You must be an admin to add a VIP user.`,
      });
    }
  } catch (error) {
    console.log(error, "<----Error occured");
    res.status(500).json({
      message: `Server error`,
    });
  }
}

module.exports = {
  // getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventForAdmin,
  seatBooking,
  getPublicEventForUser,
  addVipUser,
};
