const express = require('express');
const router = express.Router();
const userController = require('../controller/user.controller');
const userValidation = require('../middleware/user.validation');
const verifyToken = require('../middleware/tokenVerify');
const eventController = require('../controller/event.controller')

router.post("/signup",userValidation.validationUser,userController.signUp);
router.post("/login", userController.signIn);
router.put("/update",verifyToken.userProfile,userController.updateUser);
router.get("/getall",verifyToken.userProfile,userController.getAllUser);

router.delete("/delete",verifyToken.userProfile,userController.deleteUser);
router.get("/getuser",verifyToken.userProfile,userController.getUser);
router.post("/bookseat",verifyToken.userProfile, eventController.seatBooking);
router.get("/getevents",eventController.getEventForUser);

// router.get("/profile",userMiddleware.userProfile,userController.userProfile);

module.exports = router