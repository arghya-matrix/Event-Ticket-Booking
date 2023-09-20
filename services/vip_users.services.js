const db = require('../models/index');

async function validationUserId({ user_id, event_id }){
    const user = await db.Vip.findAndCountAll({
        where : {
            user_id :user_id,
            event_id : event_id
        }
    });
    return user;
}

module.exports = {
    validationUserId
}