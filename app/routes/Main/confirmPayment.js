const express = require('express');

const router = express.Router();
const controller = require("../../controllers/Stripe/stripe")

router.post("/createProductAndPricing" , controller.createProductAndPricing);

router.get("/getProductPricings" , controller.getProductPricings);
router.get("/getProducts" , controller.getProducts);

router.post("/initiate_payment" , controller.initiatePayment);
router.post("/cancel_subscription" , controller.cancelSubscription);




module.exports = router;