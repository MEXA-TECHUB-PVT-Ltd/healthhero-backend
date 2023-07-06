 const { pool } = require("../config/db.config");
const nodemailer = require("nodemailer");;
const subsriptionEmailBody = require("./subsriptionEmailBody");
const stripe = require('stripe')(process.env.STRIPE_SECRET);



const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },

});

const sendEmail= async function (email , text){
    try{
        let sendEmailResponse = await transporter.sendMail({
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: 'Payment Info',
            html: subsriptionEmailBody(text, "Health-Hero", "#FF9F00")

        });

        console.log(sendEmailResponse);

        if (sendEmailResponse.accepted.length > 0) {
           console.log("Email sent successfully to this email")
           return true;
        }
        else {
           console.log("Could not send email")
           return false;
        }

    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: `Internal server error occurred`,
            success: false,
        });
    }
}

const updateSubscriptionStatus = async (email , subscribe_status)=>{
    try{
        const query = 'UPDATE users SET subscribe_status = $2 WHERE email = $1 RETURNING*';
        const result = await pool.query(query , [email , subscribe_status]);
        if(result.rows[0]){
            return true;
        }
        else{ return false};
    }
    catch(err){
        console.log(err);
        return false;
    }
}

const getEmail = async (customer_id)=>{
    try{
        const customer = await stripe.customers.retrieve(customer_id);
        const userEmail = customer.email;
        return userEmail;
    }
    catch(err){
        console.log(err);
        return null;
    }
}

const addSubscription = async(email , stripe_subscription_id , customer_Stripe_Id , currency , startingdate , endDate  , amount_paid)=>{
    try{
        const findUserQuery= 'SELECT * FROM users WHERE email = $1';
        const foundResult  = await pool.query(findUserQuery , [email]);
        let user_id;
        if(foundResult.rows[0]){
            user_id = foundResult.rows[0].user_id;
        }

        const query = `INSERT INTO subscription (user_id , stripe_subscription_id , customer_stripe_id , currency , startingdate , enddate , amount) 
            VALUES ($1 , $2 , $3 , $4 , $5 , $6 , $7)  RETURNING *   
        `
        const result = await pool.query(query , [
            user_id ? user_id : null , 
            stripe_subscription_id ? stripe_subscription_id : null ,
            customer_Stripe_Id ? customer_Stripe_Id : null ,
            currency ? currency : null, 
            startingdate ? startingdate : null,
            endDate ? endDate : null,
            amount_paid ? amount_paid : null
        ]);

        if(result.rows[0]){
            return true
        }
        else{
            return false
        }

    }
    catch(err){
        console.log(err);
        return false
    }
}

const isWithinLast31Days= async(startDate, endDate)=> {
    // Calculate the current date
    const currentDate = new Date();
    
    // Calculate the date 31 days ago
    const thirtyOneDaysAgo = new Date();
    thirtyOneDaysAgo.setDate(currentDate.getDate() - 31);
    
    // Parse the start and end dates
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);
    
    // Check if the start and end dates are within the last 31 days
    return parsedStartDate >= thirtyOneDaysAgo && parsedEndDate <= currentDate;
}

const getLastSubscription = async(customer_id)=>{
    try{
        const query = `SELECT *
        FROM subscription
        WHERE customer_Stripe_Id = $1
        ORDER BY created_at DESC
        LIMIT 1`;
        const result = await pool.query(query , [customer_id]);
        if(result.rows[0]){
            return {
                startingdate: result.rows[0].startingdate ? result.rows[0].startingdate : null,
                endDate: result.rows[0].enddate ? result.rows[0].enddate : null
            }
        }
        else {
            return null;
        }
    }
    catch(err){
        console.log(err);
        return null;
    }
}
  
module.exports = {sendEmail , updateSubscriptionStatus , getEmail , addSubscription , isWithinLast31Days ,getLastSubscription }