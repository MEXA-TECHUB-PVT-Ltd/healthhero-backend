const express = require('express');
const functions = require("../../utils/stripePayFns");

const router = express.Router();
const controller = require("../../controllers/Stripe/stripe")

router.post("/createProductAndPricing" , controller.createProductAndPricing);

router.get("/getProductPricings" , controller.getProductPricings);
router.get("/getProducts" , controller.getProducts);

router.post("/initiate_payment" , controller.initiatePayment);
router.post("/initiateFreeTrialPayment" , controller.initiateFreeTrialPayment);
router.post("/cancel_subscription" , controller.cancelSubscription);
router.post("/check_subscription" , controller.checkSubscription);


module.exports = router;