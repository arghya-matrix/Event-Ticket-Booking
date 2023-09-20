const eventServices = require("../services/event.services");
const moment = require("moment");
const logServices = require("../services/log.services");
const db = require("../models/index");

async function getPublicEvent(req, res) {
  try {
    const page = req.query.page ? req.query.page : 1;
    const itemsInPage = req.query.size;

    const orderOptions = [];

    const size = itemsInPage ? +itemsInPage : 3;
    const index = page ? (page - 1) * size : 0;

    if (req.query.colName && req.query.orderName) {
      orderOptions.push([req.query.colName, req.query.orderName]);
    } else {
      orderOptions.push(["event_date", "ASC"]);
    }
    const event = await eventServices.getPublicEvent({
      index: index,
      orderOptions: orderOptions,
      pageSize: size,
    });

    const currentPage = page ? +page : 1;
    const totalPages = Math.ceil(event.count / size);

    res.json({
      "Total Pages": totalPages,
      "Total Items": event.count,
      "Current Page": currentPage,
      message: `${event.count} Events Found`,
      data: event.rows,
    });
  } catch (error) {
    res.status(500).json({
      message: `Server Error`,
      err: error,
    });
  }
}

async function getEventForUser(req, res) {
  try {
    const page = req.query.page ? req.query.page : 1;
    const itemsInPage = req.query.size;

    const orderOptions = [];

    const size = itemsInPage ? +itemsInPage : 3;
    const index = page ? (page - 1) * size : 0;

    if (req.query.colName && req.query.orderName) {
      orderOptions.push([req.query.colName, req.query.orderName]);
    } else {
      orderOptions.push(["event_date", "ASC"]);
    }

    const currentDate = moment().format("YYYY-MM-DD");
    const event = await eventServices.getEventForUser({
      currentDate: currentDate,
      index: index,
      pageSize: size,
      orderOptions: orderOptions,
    });
    res.json({
      message: `${event.count} latest events found`,
      events: event.rows,
    });
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
        "Total Seat Booked" : event.sum,
        data: event.eventData,
        message : event
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

async function getPrivateEvent(req, res) {
  try {
    const page = req.query.page ? req.query.page : 1;
    const itemsInPage = req.query.size;

    const orderOptions = [];

    const size = itemsInPage ? +itemsInPage : 3;
    const index = page ? (page - 1) * size : 0;

    if (req.query.colName && req.query.orderName) {
      orderOptions.push([req.query.colName, req.query.orderName]);
    } else {
      orderOptions.push(["event_name", "ASC"]);
    }

    if (req.userdata.type == "Admin") {
      const event = await eventServices.getPrivateEvent({
        index: index,
        pageSize: size,
        orderOptions: orderOptions,
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
      if (req.query.type && req.query.event_id) {
        if (req.query.type == "public") {
          const event = await eventServices.getOneEvent({
            event_id: req.query.event_id,
          });
          updateOptions.seat_left = event.max_people;
          updateOptions.type = req.query.type;
        } else {
          updateOptions.type = req.query.type;
        }
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
        updateOptions.seat_left = db.sequelize.literal(`seat_left + (${req.query.max_people} - max_people)`)
        console.log(updateOptions.seat_left,"<-----Seat left");
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

async function addVipUser(req,res){
  try {

    if (req.userdata.type == "Admin") {
      const idArray = req.body.user_id;
      const vipUser = await eventServices.addVipUser({
        event_name : req.body.event_name,
        user_id : idArray
      })
      res.json({
        message : `Vip User Added`,
        data : vipUser
      })
    } else {
      res.status(403).json({
        message: `Permission denied. You must be an admin to add a VIP user.`
      });
    }
  } catch (error) {
    console.log(error,"<----Error occured");
    res.status(500).json({
      message: `Server error`
    })
  }
  
}

async function getOneEvent(req,res){
  try {
    const event = await eventServices.getOneEvent({
      event_id : req.query.event
    })
    if(event == null || event == undefined){
      res.status(404).json({
        message : `No data found`
      })
    } 
  } catch (error) {
    console.log(error,"<<-- Error occured");
    res.status(500).json({
      message : `An internal error occured`,
      error: error
    })
  }
}

module.exports = {
  getPublicEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  getPrivateEvent,
  seatBooking,
  getEventForUser,
  addVipUser,
  getOneEvent
};
