const db = require('../models/index');
const blockedToken = [];


async function addUser({ Name, user_name, email_address, password }) {
    const user = await db.User.create({
        Name: Name,
        user_name: user_name,
        password: password,
        email_address: email_address
    },
        // {
        //     returning: true,
        //     attributes: {
        //         exclude: ['password','user_id']
        //     }    }
    )
    const userData = { ...user.get(), password: undefined, user_id: undefined }
    return userData;
}

async function getAllUser() {
    const user = await db.User.findAndCountAll({
        where: {
            user_type: "User"
        }
    })
    return user;
}

async function getUser({ user_name }) {
    const user = await db.User.findAll({
        where: {
            user_name: user_name
        },
        raw: true
    })
    return user;
}

async function deleteUser({ user_name }) {
    await db.User.destroy({
        where: {
            user_name: user_name
        }
    })
    return (`${user_name} deleted`)
}

async function updateUser({ updateOptions, user_name }) {
    await db.User.update(updateOptions, {
        where: {
            user_name: user_name
        }
    });
    const user = await db.User.findAll({
        where: {
            user_name: user_name
        },
        raw: true
    })
    return user;
}

async function validateUser({ email_address }) {
    const user = await db.User.findAndCountAll({
        where: {
            email_address: email_address
        }
    })
    return user;
}

async function signIn({ email_address }) {
    const user = await db.User.findAndCountAll({
        where: {
            email_address: email_address
        },
        raw: true
    })
    return user
}

async function logOut({
    jwt
}) {
    blockedToken.push(jwt);
    return blockedToken;
}

async function userProfile({ user_id }) {
    const bookedSeat = await db.Log.sum('booked_seat')
    const userData = await db.User.findAll({
        attributes: ['uuid', 'Name', 'user_name', 'email_address'],
        include: [
            {
                model: db.Log,
                attributes: ['booked_seat', 'createdAt'],
                include: [
                    {
                        model: db.Event,
                        attributes: ['event_name', 'event_date', 'last_date', 'max_people',
                            'max_booking_per_user', 'createdAt']
                    }
                ]
            },
        ],
        where: {
            user_id: user_id
        }
    })
    return ({ userData, bookedSeat });
}

module.exports = {
    addUser,
    getUser,
    deleteUser,
    updateUser,
    validateUser,
    signIn,
    logOut,
    blockedToken,
    getAllUser,
    userProfile
}