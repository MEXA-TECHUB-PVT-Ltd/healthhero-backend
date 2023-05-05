const express = require('express');

const router = express.Router();
const controller = require("../../controllers/Main/feedbackController")

router.post("/createFeedack" , controller.createFeedack);
router.put("/updateFeedack" , controller.updateFeedack);
router.delete("/deleteFeedback" , controller.deleteFeedback);
router.get("/get_feedback_of_user" , controller.get_feedback_of_user);
router.get("/getAllFeedbacks" , controller.getAllFeedbacks);



module.exports = router;