const express = require('express');

const router = express.Router();
const controller = require("../../controllers/Main/foodController")

router.post("/addFood" , controller.addFood);
router.put("/updateFood" , controller.updateFood);
router.delete("/deleteFood" , controller.deleteFood);
router.get("/getFood" , controller.getFood);
router.get("/getAllFoods" , controller.getAllFoods);
router.get("/searchFood" , controller.searchFood);

router.put("/deleteTemporarily" , controller.deleteTemporarily);
router.put("/recover_record" , controller.recover_record);
router.get("/getAllTrashRecords" , controller.getAllTrashRecords);






module.exports = router;