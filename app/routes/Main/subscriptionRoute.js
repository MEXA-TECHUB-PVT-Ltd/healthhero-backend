const express = require('express');

const router = express.Router();
const controller = require("../../controllers/Stripe/subscription")

router.post("/subscribe" , controller.subscribe);
router.get("/getUserSubscriptions" , controller.getUserSubscriptions);
router.get("/getAllSubscriptions" , controller.getAllSubscriptions);


module.exports = router;