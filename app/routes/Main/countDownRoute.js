const express = require('express');

const router = express.Router();
const controller = require("../../controllers/Main/countdownController")

router.post("/addCountDown" , controller.addCountDown);
router.delete("/deleteCountDown" , controller.deleteCountDown);
router.get("/getCountDownTimeOfUser" , controller.getCountDownTimeOfUser);
router.put("/deleteTemporarilyCountDown" , controller.deleteTemporarilyCountDown);
router.put("/recover_record" , controller.recover_record);
router.get("/getAllTrashRecords" , controller.getAllTrashRecords);


module.exports = router;