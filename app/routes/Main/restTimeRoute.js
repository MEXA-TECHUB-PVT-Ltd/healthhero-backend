const express = require('express');

const router = express.Router();
const controller = require("../../controllers/Main/restTimeController")

router.post("/addRestTime" , controller.addRestTime);
router.delete("/deleteRestTime" , controller.deleteRestTime);
router.get("/getRestTimeOfUser" , controller.getRestTimeOfUser);
router.put("/deleteTemporarily" , controller.deleteTemporarily);
router.put("/recover_record" , controller.recover_record);
router.get("/getAllTrashRecords" , controller.getAllTrashRecords);


module.exports = router;