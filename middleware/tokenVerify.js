const { sign, verify } = require("jsonwebtoken");
const userServices = require("../services/user.services");

async function userProfile(req, res, next) {
  const data = req.headers["authorization"];
  const blockedToken = userServices.blockedToken;

  if (data) {
    if (blockedToken.includes(data)) {
      res.status(401).json({
        message: "You are not logged in!!!!...",
      });
      return;
    } else {
      verify(data, "createJwtToken", (err, authData) => {
        if (err) {
          res.status(401).json({
            message: "Unauthorized",
          });
          return;
        } else {
          req.userdata = authData;
          // console.log(req.userdata);
          next();
        }
      });
    }
  } else {
    res.json({
      message: `You are not logged in yet`,
    });
    return;
  }
}

module.exports = {
  userProfile,
};
