const express = require('express');

const router = express.Router();
const controller = require("../../controllers/Main/reminderController")

router.post("/create_reminder" , controller.create_reminder);
router.put("/update_reminder" , controller.update_reminder);
router.delete("/deleteReminder" , controller.deleteReminder);
router.get("/get_reminder" , controller.get_reminder);
router.get("/getAllUserReminders" , controller.getAllUserReminders);
router.put("/active_reminder" , controller.active_reminder);
router.put("/in_active_reminder" , controller.in_active_reminder);






module.exports = router;