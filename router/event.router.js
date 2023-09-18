const eventController = require('../controller/event.controller');
const express = require('express');
const router = express.Router();

router.get("/getPublicEvent",eventController.getPublicEvent);
router.post("/createEvent", eventController.createEvent);
router.put("/updateEvent",eventController.updateEvent);
router.delete("/deleteEvent",eventController.deleteEvent);

module.exports = router;