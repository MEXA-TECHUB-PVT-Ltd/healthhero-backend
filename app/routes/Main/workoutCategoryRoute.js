const express = require('express');

const router = express.Router();
const controller = require("../../controllers/Main/workout_category_Controller")

router.post("/addCategory" , controller.addworkout);
router.put("/updateCategory" , controller.updateWorkoutCategory);
router.delete("/deleteCategory" , controller.deleteCategory);
router.get("/getAllcategories" , controller.getAllCategories);
router.get("/getCategoryById" , controller.getWorkoutCategoryById);
router.get("/searchCategory" , controller.searchCategory);


router.put("/deleteTemporarily" , controller.deleteTemporarily);
router.put("/recover_record" , controller.recover_record);
router.get("/getAllTrashRecords" , controller.getAllTrashRecords);

module.exports = router;