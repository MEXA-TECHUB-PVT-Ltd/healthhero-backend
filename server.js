const express = require('express');
const app = express();
require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECRET);

const functions = require('./app/utils/stripePayFns');
 const {sendEmail , updateSubscriptionStatus , getEmail , addSubscription , isWithinLast31Days ,getLastSubscription } = functions;

const PORT = process.env.PORT || 3005;
const bodyParser = require('body-parser');
// const auth = require('./app/middlewares/auth')


   app.use("/user_profile_images" , express.static("user_profile_images"))
   app.use("/animations" , express.static("animations"))
   app.use("/video_links" , express.static("video_links"))
   app.use("/workout_plan_images" , express.static("workout_plan_images"))
   app.use("/admin_profile_images" , express.static("admin_profile_images"))

  
const cors = require("cors");

app.use(cors({
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));

  //-----------------------------------------WEB Hooks Handled Here-----------------------------------------------------


const endpointSecret = "whsec_e5efa915672267bc1eb79a94eea99f9ece0c0d98d5055be6645f684bddf6f499";
  app.post('/hooks', express.raw({type: 'application/json'}), async(request, response) => {
    const sig = request.headers['stripe-signature'];
    const rawBody = request.body;
  
    let event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    } catch (err) {
      console.log(err);
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
  
    // Handle the event
    switch (event.type) {
      case 'invoice.payment_failed':{
        const invoicePaymentFailed = event.data.object;
        console.log("payment_failed", invoicePaymentFailed);
        // Then define and call a function to handle the event invoice.payment_failed

        let customer_id = invoicePaymentFailed.customer;
        console.log(customer_id);
        if(!customer_id){
          console.log("no any customer_id found")
          return false
        }

        let email = await getEmail(customer_id);
        if(!email) {
          console.log("Email not found for this customer id");
          return false
        }
        console.log("email", email);

        const getLatestSubscription = await getLastSubscription(customer_id);
        console.log(getLatestSubscription);
        let shouldSubscribe = false;
        if(getLatestSubscription){
          if(getLatestSubscription.startingdate && getLatestSubscription.endDate){
            const checkvalidity = await isWithinLast31Days(getLatestSubscription.startingdate, getLatestSubscription.endDate);
            console.log(checkvalidity);
            if(checkvalidity){
              console.log("Found that latest subscription is in last month so we will keep the subscribe status true here")
            }
            else{
              shouldSubscribe = false;
              if(shouldSubscribe==false){
                isSubscribeStatuUpdated = updateSubscriptionStatus(email , false);
                if(isSubscribeStatuUpdated){
                  console.log("Subscribe status turns to false");
                }
                const isSendEmail = await sendEmail(email , "Subscription Expired , Renewe Subscription to enjoy premium features");
                if(isSendEmail){
                  console.log("subscription expired email sent to user");
                }
              }
            }
          }
        }
        else{
            console.log("No any previous subscription found and payment failed")
        }
      }
        
        break;
      case 'invoice.payment_succeeded':{
        const invoicePaymentSucceeded = event.data.object;
        console.log(invoicePaymentSucceeded.date.object);
        console.log("payment_succeeded", invoicePaymentSucceeded);

        let customer_id = invoicePaymentSucceeded.customer;
        console.log(customer_id);
        if(!customer_id){
          console.log("no any customer_id found")
          return false
        }
        let email = await getEmail(customer_id);
        if(!email) {
          console.log("Email not found for this customer id");
          return false
        }
        console.log("email", email);
        let isSend =await sendEmail(email, "Payment Successfull , Enjoy using app");
        if(!isSend){
          console.log("Error in sending email")
          return false;
        }
        //set subscription status

        if(invoicePaymentSucceeded.amount_paid){
        let isUpdated = await updateSubscriptionStatus(email , true);
        if(!isUpdated) {
          console.log("Could not update subscription status")
        }
        let startingdate = new Date(Date.now());
        let endDate = new Date(new Date().setMonth(new Date().getMonth() + 1));
        startingdate=startingdate.toISOString().split("T")[0];
        endDate=endDate.toISOString().split("T")[0];

        console.log(startingdate)

        let storeRecord = await addSubscription(email , invoicePaymentSucceeded.subscription , customer_id, "usd" , startingdate , endDate , invoicePaymentSucceeded.amount_paid);
        if(storeRecord) {
          console.log("added subscription")
        }else{
          console.log("failed to add subscription")
        }
      }
      else{
        let isUpdated = await updateSubscriptionStatus(email , true);
        if(!isUpdated) {
          console.log("Could not update subscription status")
        }
      }
    }
        // Then define and call a function to handle the event invoice.payment_succeeded
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  
    // Return a 200 response to acknowledge receipt of the event
    response.send();
  });
  


  //------------------------------------------Web Hooks ended----------------------------------------------------

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true , limit:'1000mb'}));
app.use(bodyParser.urlencoded({ extended: true , limit:'1000mb' }));

app.use(bodyParser.json())

app.use(cors({
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));

app.get("/" , (req,res)=>{
  res.json("Home Page Server , server is running")
})

 app.use("/fileUpload", require("./app/routes/ImageUpload/imageUploadRoute"))
  app.use("/admin", require("./app/routes/Users/adminRoute"))
  app.use("/user", require("./app/routes/Users/userRoute"))
  app.use("/emailVerification", require("./app/routes/EmailVerification/EmailVerificationRoute"))
  app.use("/workout_category", require("./app/routes/Main/workoutCategoryRoute"))
  app.use("/workout_plan", require("./app/routes/Main/workoutPlanRoute"))
  app.use("/countdown", require("./app/routes/Main/countDownRoute"))
  app.use("/restTime", require("./app/routes/Main/restTimeRoute"))
  app.use("/workout_plan_exersises", require("./app/routes/Main/workoutPlanExersiseRoute"))
  app.use("/seven_by_four", require("./app/routes/Main/seven_by_fourChallenge"))
  app.use("/week_goals", require("./app/routes/Main/weekGoalsRoute"))
  app.use("/user_plans", require("./app/routes/Main/userPlanRoute"));
  app.use("/feedback", require("./app/routes/Main/feedbackRoute"))
  app.use("/test_voice", require("./app/routes/Main/test_voiceRoute"))
  app.use("/privacy_policy" , require("./app/routes/Main/privacy_policyRoute"))
  app.use("/reminder" , require("./app/routes/Main/reminderRoute"))
  app.use("/water_tracking" , require("./app/routes/Main/water_trackerRoute"))
  app.use("/diet_plan" , require("./app/routes/Main/dietPlanRoute"))
  app.use("/food" , require("./app/routes/Main/FoodRoute"))
  app.use("/faq" , require("./app/routes/Main/faqRoute"))
  app.use("/height_weight" , require("./app/routes/Main/height_weightRoute"))
  app.use("/payment" , require("./app/routes/Main/confirmPayment")) 
  app.use("/subscription" , require("./app/routes/Main/subscriptionRoute")) 


//  app.use(auth)


//  app.use("/terms_and_condtions" , require("./app/routes/Main/terms_and_conditionsRoute"))
//  app.use("/about_us" , require("./app/routes/Main/about_usRoute"));
//  app.use("/faq" , require("./app/routes/Main/faqRoute"))


const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


//for water tracking . 
// user will add water tracker . only one will be created for one user . user will add quantitiy , and units etc.
// water tracking details . user will will add its id , water tracker id ,and quantity he consumed . also user automatically actual quantity of that time will be added in record . 
// along with this date will be also inserted so that we can use it in daily tracking and in history . when user adds record for one date it should be only one and then it will be automatclaly updates
// 
// get daily tracking , as input there will be based upon current date . API will get data according to this date with actual quantity and consumed quantity 
//