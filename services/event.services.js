const db = require('../models/index');


async function getPublicEvent(){
    const event = await db.Event.findAndCountAll({
        where : {
            type: 'public'
        }
    })
    return event;
}

async function updateEvent({updateOptions, whereOptions}){
    await db.Event.update(updateOptions,{
        where : whereOptions
    })
    const event = await db.Event.findAll({
        where: whereOptions,
        raw: true
    })
    return event
}

async function createEvent({event_details}){
    const event = await db.Event.create(
        event_details
    );
    return event;
}

async function deleteEvent({event_name}){
    await db.Event.destroy({
        where: {
            event_name: event_name
        }
    })
    return (`${event_name} Name is deleted.`);
}

module.exports = {
    getPublicEvent,
    updateEvent,
    createEvent,
    deleteEvent
}