const express = require('express');

const router = express.Router();
const controller = require("../../controllers/Main/workoutPlanExersisesController")

router.post("/addExersise" , controller.addExersise);
router.put("/updateWorkoutPlan_exersise" , controller.updateWorkoutPlan_exersise);
router.delete("/deleteWorkoutPlanExersise" , controller.deleteWorkoutPlanExersise);
router.get("/getAllplanExersise" , controller.getAllplanExersise);
router.get("/getAnWorkoutPlanExersise" , controller.getAnWorkoutPlanExersise);
router.get("/planExersiseByWorkoutPlan_id" , controller.planExersiseByWorkoutPlan_id);
router.delete("/deleteAllWorkoutPlanExersises" , controller.deleteAllWorkoutPlanExersises);
router.put("/like_exersise" , controller.like_exersise);
router.delete("/unLike_exersise" , controller.unLike_exersise);
router.get("/checkUserLikeStatusForExersise" , controller.checkUserLikeStatusForExersise);
router.get("/get_user_liked_exersises" , controller.get_user_liked_exersises);








module.exports = router;