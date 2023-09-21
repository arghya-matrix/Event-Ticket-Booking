const db = require('../models/index');

async function createSession({ user_id }) {
    const session = await db.Sessions.create({
        user_id: user_id
    });
    return session.toJSON();
}

async function updateSession({ login_date, expiry_date, sessions_id }) {
    await db.Sessions.update({
        login_date: login_date,
        expiry_date: expiry_date
    }, {
        where: {
            id: sessions_id
        }
    })
}

async function logoutSession({ date, sessions_id }) {
    const [numUpdatedRows, updatedRows]= await db.Sessions.update({ logout_date: date }, {
        where: {
            id: sessions_id
        }
    })
    return {numUpdatedRows};
}

async function findSession({sessions_id}){
    const session = await db.Sessions.findOne({
        where : {
            id : sessions_id
        }
    })
    return session
}

module.exports = {
    createSession,
    updateSession,
    logoutSession,
    findSession
}