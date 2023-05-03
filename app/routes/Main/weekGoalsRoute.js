const express = require('express');

const router = express.Router();
const controller = require("../../controllers/Main/seven_by_four_challengeController")

router.post("/addSeven_by_four" , controller.addSeven_by_four);
router.put("/update_sevenByFour" , controller.update_sevenByFour);
router.delete("/deleteSevenByFour" , controller.deleteSevenByFour);
router.get("/getSevenByFour" , controller.getSevenByFour);
router.get("/add_ExersisesInto_7x4" , controller.add_ExersisesInto_7x4);


module.exports = router;