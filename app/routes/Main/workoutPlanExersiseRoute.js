const express = require('express');

const router = express.Router();
const controller = require("../../controllers/Main/workoutPlanExersisesController")

router.post("/addExersise" , controller.addExersise);
router.put("/updateExersise" , controller.updateWorkoutPlan_exersise);
router.delete("/deleteExersise" , controller.deleteWorkoutPlanExersise);
router.get("/getAllExersises" , controller.getAllplanExersise);
router.get("/getExersise" , controller.getAnWorkoutPlanExersise);
router.put("/like_exersise" , controller.like_exersise);
router.delete("/unLike_exersise" , controller.unLike_exersise);
router.get("/checkUserLikeStatusForExersise" , controller.checkUserLikeStatusForExersise);
router.get("/get_user_liked_exersises" , controller.get_user_liked_exersises);
router.get("/exersise_of_day" , controller.exersise_of_day);


router.put("/deleteTemporarily" , controller.deleteTemporarily);
router.put("/recover_record" , controller.recover_record);
router.get("/getAllTrashRecords" , controller.getAllTrashRecords);


module.exports = router;