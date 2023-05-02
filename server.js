const express = require('express');
const app = express();
const {pool} = require('./app/config/db.config')


const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
require('dotenv').config()
// const auth = require('./app/middlewares/auth')


//   app.use("/resume_template_images" , express.static("resume_template_images"))
//   app.use("/user_profile_images" , express.static("user_profile_images"))
  
const cors = require("cors");

app.use(cors({
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));


// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json())

app.use(cors({
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));

app.get("/" , (req,res)=>{
  res.json("Home Page Server , server is running")
})

// app.use("/imageUpload", require("./app/routes/ImageUpload/imageUploadRoute"))
//  app.use("/admin", require("./app/routes/Users/adminRoute"))
  app.use("/user", require("./app/routes/Users/userRoute"))
  app.use("/emailVerification", require("./app/routes/EmailVerification/EmailVerificationRoute"))
  app.use("/workout_category", require("./app/routes/Main/workoutCategoryRoute"))
  app.use("/workout_plan", require("./app/routes/Main/workoutPlanRoute"))
  app.use("/countdown", require("./app/routes/Main/countDownRoute"))
  app.use("/restTime", require("./app/routes/Main/restTimeRoute"))




//  app.use(auth)


//  app.use("/terms_and_condtions" , require("./app/routes/Main/terms_and_conditionsRoute"))
//  app.use("/privacy_policy" , require("./app/routes/Main/privacy_policyRoute"))
//  app.use("/about_us" , require("./app/routes/Main/about_usRoute"));
//  app.use("/faq" , require("./app/routes/Main/faqRoute"))


const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


