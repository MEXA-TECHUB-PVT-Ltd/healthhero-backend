const express = require('express');

const router = express.Router();
const controller = require("../../controllers/Main/countdownController")

router.post("/addCountDown" , controller.addCountDown);
router.delete("/deleteCountDown" , controller.deleteCountDown);
router.get("/getCountDownTimeOfUser" , controller.getCountDownTimeOfUser);


module.exports = router;