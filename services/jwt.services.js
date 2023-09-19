const {sign, verify} = require('jsonwebtoken');

const createToken = function ({user_name, user_id, email_address, type}){
    const accessToken = sign({
        user_name, email_address,user_id, type
    }, "createJwtToken", {expiresIn : "1d"})
    return accessToken;
};

module.exports = {
    createToken
}