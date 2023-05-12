const express = require('express');

const router = express.Router();
const controller = require("../../controllers/Main/water_trackingController")

router.post("/add_water_tracker" , controller.add_water_tracker);
router.put("/update_water_tracker" , controller.update_water_tracker);
router.delete("/deleteWater_tracker" , controller.deleteWater_tracker);
router.post("/add_record_water_tracker" , controller.add_record_water_tracker);
router.delete("/deleteWater_tracker_record" , controller.deleteWater_tracker_record);
router.get("/get_daily_tracking" , controller.get_daily_tracking);
router.get("/get_weekly_history" , controller.get_weekly_history);
router.put("/deleteTemporarily" , controller.deleteTemporarily);
router.put("/recover_record" , controller.recover_record);
router.get("/getAllTrashRecords" , controller.getAllTrashRecords);


module.exports = router;