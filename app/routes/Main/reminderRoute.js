const express = require('express');

const router = express.Router();
const controller = require("../../controllers/Main/reminderController")

router.post("/create_reminder" , controller.create_reminder);
router.put("/update_reminder" , controller.update_reminder);
router.delete("/deleteReminder" , controller.deleteReminder);
router.get("/get_reminder" , controller.get_reminder);
router.get("/getAllUserReminders" , controller.getAllUserReminders);




module.exports = router;