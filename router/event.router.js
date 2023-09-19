const eventController = require('../controller/event.controller');
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/tokenVerify');

router.get("/getPublicEvent", eventController.getPublicEvent);
router.get("/getPrivateEvent", verifyToken.userProfile, eventController.getPrivateEvent)
router.post("/createEvent", verifyToken.userProfile, eventController.createEvent);
router.put("/updateEvent", verifyToken.userProfile, eventController.updateEvent);
router.delete("/deleteEvent", verifyToken.userProfile, eventController.deleteEvent);

module.exports = router;