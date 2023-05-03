const express = require('express');

const router = express.Router();
const controller = require("../../controllers/Main/restTimeController")

router.post("/addRestTime" , controller.addRestTime);
router.delete("/deleteRestTime" , controller.deleteRestTime);
router.get("/getRestTimeOfUser" , controller.getRestTimeOfUser);

module.exports = router;