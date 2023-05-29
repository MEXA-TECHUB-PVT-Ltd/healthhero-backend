const express = require("express"),
router=express.Router();

const controller= require("../../controllers/Main/height_weightController");

router.post("/addWeight",controller.addWeight)
router.put("/updateWeight",controller.updateWeight)
router.get("/getWeightHistory",controller.getWeightHistory)
router.get("/getUserWeight",controller.getUserWeight)
router.delete("/deleteWeight",controller.deleteWeight)
// router.put("/updateStatus",controller.updateStatus)
router.post("/addheight",controller.addheight)
router.put("/updateheight",controller.updateheight)
router.get("/getheightHistory",controller.getheightHistory)
router.get("/getUserheight",controller.getUserheight)
router.delete("/deleteheight",controller.deleteheight)


router.get("/getWeekilyWeightReport",controller.getWeekilyWeightReport)




module.exports=router