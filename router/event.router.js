const eventController = require('../controller/event.controller');
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/tokenVerify');
const userValidation = require('../middleware/user.validation')

router.get("/getEvents", verifyToken.userProfile, eventController.getPublicEventForUser);
router.get("/getEventForAdmin", verifyToken.userProfile, eventController.getEventForAdmin)
router.post("/createEvent", verifyToken.userProfile, eventController.createEvent);
// router.get("/getOneEvent",verifyToken.userProfile, eventController.getOneEvent);

router.put("/updateEvent", verifyToken.userProfile, eventController.updateEvent);
router.delete("/deleteEvent", verifyToken.userProfile, eventController.deleteEvent);
router.post("/addVipUser", verifyToken.userProfile, userValidation.validationUserId, eventController.addVipUser);

module.exports = router;