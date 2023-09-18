const eventServices = require('../services/event.services');
const moment = require('moment')

async function getPublicEvent(req,res){
    const event = await eventServices.getPublicEvent();

    res.json({
        message : `${event.count} Events Found`,
        data : event.rows
    })
}

async function createEvent(req,res){
    const event_details = {};

    if(req.query.type){
        event_details.type = req.query.type
    }
    if(req.query.event_date){
        const date = moment(req.query.event_date).format("YYYY-MM-DD");
        event_details.event_date = date
    }
    if(req.query.last_date){
        const date = moment(req.query.last_date).format("YYYY-MM-DD");
        event_details.last_date = date
    }
    if(req.query.max_people){
        event_details.max_people = req.query.max_people
    }
    if(req.query.max_booking){
        event_details.max_booking = req.query.max_booking
    }
    if(req.query.event_name){
        event_details.event_name = req.query.event_name
    }

    const event = await eventServices.createEvent({
        event_details: event_details
    })
    res.json({
        message: `${req.query.event_name} created`,
        data: event
    })
}

async function updateEvent(req,res){
    const updateOptions = {};
    const whereOptions = {};
    if(req.query.type){
        updateOptions.type = req.query.type
    }
    if(req.query.event_date){
        const date = moment(req.query.event_date).format("YYYY-MM-DD");
        updateOptions.event_date = date
    }
    if(req.query.last_date){
        const date = moment(req.query.last_date).format("YYYY-MM-DD");
        updateOptions.last_date = date
    }
    if(req.query.max_people){
        updateOptions.max_people = req.query.max_people
    }
    if(req.query.max_booking){
        updateOptions.max_booking = req.query.max_booking
    }
    if(req.query.event_name){
        updateOptions.event_name = req.query.event_name
    }
    if(req.query.event_id){
        whereOptions.event_id = req.query.event_id
    }

    const event = await eventServices.updateEvent({
        updateOptions: updateOptions,
        whereOptions: whereOptions
    })
    res.json({
        message:`${req.query.event_id} updated`,
        data : event
    })
}

async function deleteEvent(req,res){
    const event = await eventServices.deleteEvent({
        event_name: req.query.event_name
    })
    res.json({
        message: event
    })
}

module.exports = {
    getPublicEvent,
    createEvent,
    updateEvent,
    deleteEvent
}