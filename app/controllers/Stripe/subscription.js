const {pool} = require("../../config/db.config");

exports.subscribe= async (req, res) => {
    const client = await pool.connect();
    try {
        const user_id = req.body.user_id;
        const unit_amount = req.body.unit_amount;
        const ephemeralKey = req.body.ephemeralKey;
        const stripe_subscription_id = req.body.stripe_subscription_id;
        const customer_Stripe_Id = req.body.customer_Stripe_Id;
        const subscription_client_secret = req.body.subscription_client_secret;
        const paymentIntent_Secret = req.body.paymentIntent_Secret;
        const startingdate = req.body.startingdate;
        const endDate = req.body.endDate;
        const priceId =req.body.priceId;

        
        if(!user_id || !unit_amount || !ephemeralKey || !stripe_subscription_id || ! customer_Stripe_Id || !subscription_client_secret
            || !paymentIntent_Secret || !startingdate || !endDate || !priceId 
            ) {
            return(
                res.json({
                    message: `user_id , unit_amount , ephemeralKey , stripe_subscription_id , customer_Stripe_Id , subscription_client_secret ,
                    paymentIntent_Secret , startingdate , endDate  , priceId must be provided`,
                    status : false
                })
            )
        }
        const query = `INSERT INTO subscription 
        (user_id, amount, ephemeralKey, stripe_subscription_id, customer_Stripe_Id, subscription_client_secret, paymentIntent_Secret, currency, startingdate, endDate, priceId)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING*;`
  
          const result =await pool.query(query , [
              user_id ? user_id : null,
              unit_amount ? unit_amount : null,
              ephemeralKey ? ephemeralKey : null,
              stripe_subscription_id ? stripe_subscription_id : null,
              customer_Stripe_Id ? customer_Stripe_Id: null,
              subscription_client_secret ? subscription_client_secret : null,
              paymentIntent_Secret ? paymentIntent_Secret: null,
              'usd' ? 'usd' : null,
              startingdate ? startingdate : null,
              endDate? endDate : null,
              priceId ? priceId : null,
          ])


   
        
        if (result.rows[0]) {
            res.status(201).json({
                message: "Subscription Recorded successfully",
                status: true,
                result: result.rows[0]
            })
        }
        else {
            res.status(400).json({
                message: "Could not save ",
                status: false
            })
        }
    }
    catch (err) {
        console.log(err)
        res.json({
            message: "Error",
            status: false,
            error: err.message
        })
    }
    finally {
        client.release();
      }

}

exports.getUserSubscriptions =async (req,res)=>{
    const client = await pool.connect();
    try{
        const user_id = req.query.user_id;
        if(!user_id){
            return (
                res.json({
                    message: "user_id must be provided",
                    status : false
                })
            )
        }

        const query = 'SELECT * FROM subscription WHERE user_id = $1';
        const result = await pool.query(query, [user_id]);

        if(result.rows[0]){
            res.json({
                message: "All subscriptions of user",
                status : true,
                result : result.rows
            })
        }
        else{
            res.json({
                message: "Could not get any subscription",
                status : false
            })
        }
    }
    catch(err){
        res.json({
            mesasge : "Error Occurred",
            status : false,
            error : err.message
        })
    } finally {
        client.release();
      }

}

exports.getAllSubscriptions =async (req,res)=>{
    const client = await pool.connect();
    try{
        const query = 'SELECT * FROM subscription';
        const result = await pool.query(query);

        if(result.rows){
            res.json({
                message: "All subscriptions of users",
                status : true,
                result : result.rows
            })
        }
        else{
            res.json({
                message: "Could not get any subscription",
                status : false
            })
        }
    }
    catch(err){
        res.json({
            mesasge : "Error Occurred",
            status : false,
            error : err.message
        })
    } finally {
        client.release();
      }

}

