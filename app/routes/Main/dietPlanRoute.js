const express = require("express"),
router=express.Router();

const controller= require("../../controllers/Main/dietPlanController");

router.post("/add_dietPlan",controller.addDietPlan);
router.put("/update_dietPlan",controller.updateDietPlan)
router.get("/get_dietPlan",controller.getDietPlan)
router.delete("/delete_diet_plan",controller.deleteDietPlan)
router.post("/addFoodIntake",controller.addFoodIntake)
router.get("/getdailyConsumption",controller.getDailyConsumption)
router.get("/getHistory",controller.getHistory)
router.get("/getDietPlanOfUser",controller.getDietPlanOfUser);


router.put("/deleteTemporarily" , controller.deleteTemporarily);
router.put("/recover_record" , controller.recover_record);
router.get("/getAllTrashRecords" , controller.getAllTrashRecords);



module.exports=router