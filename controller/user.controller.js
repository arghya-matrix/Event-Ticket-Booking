const userServices = require("../services/user.services");
const generateNumber = require("../services/generatenumber");
const jwtServices = require("../services/jwt.services");

async function getAllUser(req, res) {
  try {
    if (req.userdata.type == "Admin") {
        const user = await userServices.getAllUser();
        res.json({
          message: `${user.count} users found`,
          data: user.rows,
        });
    }
    else{
        res.status(401).json({
            message: `You are not an Admin`
        })
    }
  } catch (error) {
    console.log(error,"<---Error");
    res.status(500).json({
      message: `Server Error`,
      err: error,
    });
  }
}

async function signUp(req, res) {
  try {
    const data = req.body;
    const stringWithSpaces = data.Name.toLowerCase();
    const userName = stringWithSpaces.replace(/\s/g, "");

    const number = generateNumber();
    const user = await userServices.addUser({
      email_address: data.email_address,
      Name: data.Name,
      password: data.password,
      user_name: userName.concat(number),
    });
    // console.log(user);
    res.json({
      message: `You are Signed Up....`,
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      message: `Server Error`,
      err: error,
    });
  }
}

async function updateUser(req, res) {
  try {
    const data = req.userdata;
    const updateOptions = {};

    if (req.body.Name) {
      // Name : req.body.Name
      updateOptions.Name = req.body.Name;
    }
    if (req.body.email_address) {
      updateOptions.email_address = req.body.email_address;
    }
    if (req.body.password) {
      updateOptions.password = req.body.password;
    }

    const user = await userServices.updateUser({
      updateOptions: updateOptions,
      user_name: data.user_name,
    });

    res.json({
      message: `${data.user_name} Updated`,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: `Server Error`,
      err: error,
    });
  }
}

async function deleteUser(req, res) {
  try {
    const user = await userServices.deleteUser({
      user_name: data.user_name,
    });
    res.json({
      message: user,
    });
  } catch (error) {
    res.status(500).json({
      message: `Server Error`,
      err: error,
    });
  }
}

async function getUser(req, res) {
  try {
    const data = req.userdata
    const user = await userServices.getUser({
      user_name: data.user_name,
    });
    res.json({
      data: user,
    });
  } catch (error) {
    console.log(error, "<----- error!!!!!");
    res.status(500).json({
      message: `Server Error`,
      err: error,
    });
  }
}

async function signIn(req, res) {
  try {
    const data = req.body;
    const user = await userServices.signIn({
      email_address: data.email_address,
    });
    const dbUser = user.rows[0];
    // console.log(dbUser);
    // console.log(data);

    if (dbUser == undefined) {
      res.json({
        message: `!!!!You are not Signed Up!!!!`,
      });
    } else if (
      data.email_address == dbUser.email_address &&
      data.password == dbUser.password
    ) {
      const jwt = jwtServices.createToken({
        user_id: dbUser.user_id,
        email_address: dbUser.email_address,
        user_name: dbUser.user_name,
        type: dbUser.user_type,
      });
      const userdata = user.rows[0];
      delete userdata.password;
      delete userdata.user_id;
      res.json({
        message: "Logged In",
        Profile: userdata,
        JWTtoken: jwt,
      });
    } else {
      res.json({
        message: "Invalid Combination",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: `Server Error`,
      err: error,
    });
  }
}

async function logOut(req, res) {
 try {
     const data = req.headers["authorization"];
     if (data) {
       const user = await userServices.logOut({
         jwt: data,
       });
       res.json({
         message: `User logged out.`,
       });
     } else {
       res.json({
         message: `To LogOut, LogIn fitst. `,
       });
     }
 } catch (error) {
    res.status(500).json({
        message: `Server Error`,
        err: error,
      });
 }
}

async function userProfile(req,res){
    const data = req.userdata;
    // console.log(data);
    const userData = await userServices.userProfile({
        user_id : data.user_id
    })
    res.json({
      "Seat already booked": userData.bookedSeat,
        data: userData.userData
    })
}

module.exports = {
  updateUser,
  signUp,
  deleteUser,
  getUser,
  signIn,
  logOut,
  getAllUser,
  userProfile
};
