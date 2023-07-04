const express = require('express');
const app = express();
const {pool} = require('./app/config/db.config')


const PORT = process.env.PORT || 3005;
const bodyParser = require('body-parser');
require('dotenv').config()
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