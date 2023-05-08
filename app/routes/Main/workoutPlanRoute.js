const express = require('express');

const router = express.Router();
const controller = require("../../controllers/Main/workout_plansController")

router.post("/addworkoutPlan" , controller.addworkoutPlan);
router.put("/updateWorkoutPlans" , controller.updateWorkoutPlans);
router.delete("/deleteWorkoutPlan" , controller.deleteWorkoutPlan);
router.get("/getAllWorkoutPlans" , controller.getAllWorkoutPlans);
router.get("/getWorkoutPlanById" , controller.getWorkoutPlanById);
router.get("/get_for_intermediate" , controller.get_for_intermediate);
router.get("/get_for_beginners" , controller.get_for_beginners);
router.get("/get_for_advance" , controller.get_for_advance);
router.get("/workoutPlansByCategory_id" , controller.workoutPlansByCategory_id);
router.put("/like_plan" , controller.like_plan);
router.put("/unLike_plan" , controller.unLike_plan);
router.get("/checkUserLikeStatusForPlan" , controller.checkUserLikeStatusForPlan);
router.post("/start_workout" , controller.start_workout);
router.put("/complete_workout" , controller.complete_workout);
router.get("/workoutsPlanCompletedByUser" , controller.workoutsPlanCompletedByUser);
router.post("/addExersiseToPlan" , controller.addExersiseToPlan);
router.get("/getAllExersisesOfWorkoutPlan" , controller.getAllExersisesOfWorkoutPlan);
router.delete("/deleteAllExersisesOfWorkoutPlan" , controller.deleteAllExersisesOfWorkoutPlan);



//workout plan exersises 


module.exports = router;