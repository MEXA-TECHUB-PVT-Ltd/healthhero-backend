const express = require('express');

const router = express.Router();
const controller = require("../../controllers/Main/workout_category_Controller")

router.post("/addCategory" , controller.addworkout);
router.put("/updateCategory" , controller.updateWorkoutCategory);
router.delete("/deleteCategory" , controller.deleteCategory);
router.get("/getAllcategories" , controller.getAllCategories);
router.get("/getCategoryById" , controller.getWorkoutCategoryById);


module.exports = router;