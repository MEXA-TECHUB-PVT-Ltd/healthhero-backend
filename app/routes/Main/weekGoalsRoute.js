const express = require('express');

const router = express.Router();
const controller = require("../../controllers/Main/weekGoalsController")

router.post("/Addweek_goal" , controller.Addweek_goal);
router.put("/updateUserWeekGoals" , controller.updateUserWeekGoals);
router.put("/setFirstDayOfWeek" , controller.setFirstDayOfWeek);
router.put("/updateFirstDayOfWeek" , controller.updateFirstDayOfWeek);
router.get("/getDaysOfTraining" , controller.getDaysOfTraining);
router.get("/getFirstDayOfWeek" , controller.getFirstDayOfWeek);
router.get("/getProgressOfThisWeek" , controller.getProgressOfThisWeek);




module.exports = router;