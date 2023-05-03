const express = require('express');

const router = express.Router();
const controller = require("../../controllers/Main/user_plansController")

router.post("/create_my_plan" , controller.create_my_plan);
router.put("/update_user_plan" , controller.update_user_plan);
router.put("/addExersise_in_myPlan" , controller.addExersise_in_myPlan);
router.put("/removeExersise_in_myPlan" , controller.removeExersise_in_myPlan);
router.delete("/deleteAllUserPlans" , controller.deleteAllUserPlans);
router.get("/get_plan" , controller.get_plan);
router.get("/getAllUserPlans" , controller.getAllUserPlans);


module.exports = router;