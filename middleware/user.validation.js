const userServices = require('../services/user.services');
const vipUserServices = require('../services/vip_users.services');
const db = require('../models/index');

async function validationUser(req, res, next) {
    const data = req.body
    const count = await userServices.validateUser({
        email_address: data.email_address
    });

    if (count.count == 0 || count.count == undefined || count.count == null) {
        next();
    }
    else {
        res.status(409).json({
            message: `${data.email_address} already signed up`
        })
    }
}

async function validationUserId(req, res, next) {
    const data = req.body;
    const event = await db.Event.findOne({
        where: {
            event_name: data.event_name
        }
    });
    const event_id = event.event_id;
    const userData = await vipUserServices.validationUserId({
        event_id: event_id,
        user_id: data.user_id
    })
    if (userData.count > 0) {
        return res.status(409).json({
            message: `Already added to vip user`
        })
    }
    else {
        next();
    }
}

module.exports = {
    validationUser,
    validationUserId
}