const express = require('express');

const router = express.Router();
const controller = require("../../controllers/Main/seven_by_four_challengeController")

router.post("/addSeven_by_four" , controller.addSeven_by_four);
router.put("/update_sevenByFour" , controller.update_sevenByFour);
router.put("/addExersiseToSevenByFourChallenge" , controller.addExersiseToSevenByFourChallenge);
router.put("/deleteExersiseFromSevenByFour" , controller.deleteExersiseFromSevenByFour);
router.delete("/remove_day" , controller.remove_day);
router.delete("/remove_week" , controller.remove_week);
router.post("/add_day_in_week" , controller.add_day_in_week);
router.delete("/deleteSevenByFour" , controller.deleteSevenByFour);
router.get("/getSevenByFour" , controller.getSevenByFour);
router.get("/getAllSevenByFour" , controller.getAllSevenByFour);
router.put("/deleteTemporarily" , controller.deleteTemporarily);
router.put("/recover_record" , controller.recover_record);
router.get("/getAllTrashRecords" , controller.getAllTrashRecords);


module.exports = router;