const {pool}  = require("../../config/db.config");

const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
const {thankYouEmailBody} = require('../../utils/emailOTPBody')
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },

});

exports.registerUser = async (req, res, next) => {
    const client = await pool.connect();
    try {
        const email = req.body.email;
        const password = req.body.password;
        const { error } = registerSchema.validate(req.body);
        if (error) {
            return (
                res.status(400).json({
                    message: "Error occurred",
                    error: error.details[0].message,
                    status: false
                })
            )
        }
        

        // const found_email_query = 'SELECT * FROM users WHERE email = $1'
        // const emailExists = await pool.query(found_email_query , [email])
        


        // if (emailExists.rowCount>0) {
        //     return (
        //         res.status(400).json({
        //             message: "user with this email already exists",
        //             status: false
        //         })
        //     )
        // }


        const query = 'INSERT INTO users (email , password) VALUES ($1 , $2) RETURNING*'
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);


        const result = await pool.query(query , [email , hashPassword]);
        console.log(result.rows[0])

        if(result.rows[0]){
            const createSubscriptionQuery = `INSERT INTO user_subscription (user_id , subscription_status , add_removal_status) VALUES ($1 , $2 , $3) RETURNING *`;
            const subResult = await pool.query(createSubscriptionQuery , [result.rows[0].user_id , false ,false] )
            if(subResult.rows[0]){
                console.log("user subscription created automatically while signing up")
            }
        }
        if(result.rows[0]){
            let sendEmailResponse = await transporter.sendMail({
                from: process.env.EMAIL_USERNAME,
                to: email,
                subject: 'Welcome to Health Hero - Let\'s Get Started!',
                html: thankYouEmailBody("Health-Hero", result.rows[0].user_name)
    
            });

            if(!sendEmailResponse){
                return res.json({
                    message: "User Has been registered successfully but email was not sent",
                    status : true,
                    result:result.rows[0]
                })
            }
            res.json({
                message: "User Has been registered successfully",
                status : true,
                result:result.rows[0]
            })
        }
        else{
            res.json({
                message: "Could not Register user",
                status :false,
            })
        }

    }
    catch (err) {
        console.log(err)
        res.json({
            message: "Error Occurred",
            status: false,
            error: err.message
        })
    }finally {
        client.release();
      }

}
exports.login = async (req, res) => {
    try {
        const email = req.body.email;
        let password = req.body.password;

  
        if (!email || !password) {
            return (
                res.status(400).json({
                    message: "email and password must be provided",
                    status: false
                })
            )
        }

        const query = 'SELECT * FROM users WHERE email = $1';
        const foundResult = await pool.query(query  , [email]);

        console.log(foundResult)


        if (foundResult.rowCount == 0) {
            return (
                res.status(400).json({
                    message: "Wrong email or password",
                    status: false
                })
            )
        }

        const vaildPass = await bcrypt.compare(password, foundResult.rows[0].password);

        if (!vaildPass) {
            return (
                res.status(401).json({
                    message: "Wrong email or password",
                    status: false
                })
            )
        }

        const token = jwt.sign({ id: foundResult.rows[0].user_id }, process.env.TOKEN, { expiresIn: '30d' });
        res.json({
            message: "Logged in Successfully",
            status: true,
            result: foundResult.rows[0],
            jwt_token: token
        });

    }
    catch (err) {
        console.log(err)
        res.json({
            message: "Error Occurred",
            status: false,
            error: err.message
        })
    }
}
exports.updateProfile= async (req,res)=>{
    try{
        const user_id = req.body.user_id;

         if(!user_id){
            return(res.json({message : "Please provide user_id" , status : false}))
         }

        const user_name= req.body.user_name;
        const gender = req.body.gender ;
        const focusedAreas = req.body.focusedAreas;
        const device_id = req.body.device_id;
        const height = req.body.height;
        const weight = req.body.weight;
        const height_unit = req.body.height_unit;
        const weight_unit = req.body.weight_unit;


        if(height_unit){
            if(height_unit == 'in' || height_unit == 'ft'){
            }
            else{return(res.json({message: "height unit can only be in or ft" , status :false}))}
        }
       
        if(weight_unit){
            if(weight_unit == 'kg' || weight_unit == 'gm'){
            }
            else{return(res.json({message: "weight unit can only be kg or gm" , status :false}))}
        }


        if(gender){
            if(gender=='male' || gender == 'female' || gender =='other'){

            }
            else{
                return(res.json({
                    message : "gender must be male , femal "
                }))
            }
        }


        let query = 'UPDATE users SET ';
        let index = 2;
        let values =[user_id];


        if(user_name){
            query+= `user_name = $${index} , `;
            values.push(user_name)
            index ++
        }
        if(gender){
            query+= `gender = $${index} , `;
            values.push(gender)
            index ++
        }
        if(focusedAreas){
            query+= `focused_areas = $${index} , `;
            values.push(focusedAreas)
            index ++
        }  
        if(device_id){
            query+= `device_id = $${index} , `;
            values.push(device_id)
            index ++
        }

        if(height){
            query+= `height = $${index} , `;
            values.push(height)
            index ++
        }
        if(weight){
            query+= `weight = $${index} , `;
            values.push(weight)
            index ++
        }
        if(height_unit){
            query+= `height_unit = $${index} , `;
            values.push(height_unit)
            index ++
        }  
        if(weight_unit){
            query+= `weight_unit = $${index} , `;
            values.push(weight_unit)
            index ++
        }

        query += 'WHERE user_id = $1 RETURNING*'

        query = query.replace(/,\s+WHERE/g, " WHERE");
        console.log(query);


      const result = await pool.query(query , values);

      if(result.rows[0]){
        res.json({
            message: "Profile Updated successfully",
            status : true ,
            result : result.rows[0]
        })
      }
      else{
        res.json({
            message: "Profile could not be updated successfully",
            status : false,
        })
      }
      
    }
    catch (err) {
        console.log(err)
        res.json({
            message: "Error Occurred",
            status: false,
            error: err.message
        })
    }
}
exports.updatePassword = async(req,res)=>{
    try{
        const email = req.body.email ;
        const password = req.body.password;

        const query = 'UPDATE users SET password = $1 WHERE email = $2 RETURNING*';
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const result = await pool.query(query , [hashPassword , email]);

        if(result.rows[0]){
            res.json({message: "Update successfully" , status :true , result : result.rows[0]})
        }
        else{
            res.json({message: "Could not Update" , status : false })
        }
    }
    catch (err) {
        console.log(err)
        res.json({
            message: "Error Occurred",
            status: false,
            error: err.message
        })
    }
}
exports.viewProfile = async(req,res)=>{
    try{
        const user_id = req.query.user_id;
        if(!user_id){
            return(res.json({message : "Please provide user_id" , status : false}))
         }


         const query = `SELECT
         u.user_id,
         u.user_name,
         u.email,
         u.password,
         u.focused_areas,
         u.gender,
         u.device_id,
         u.block,
         u.height,
         u.weight,
         u.height_unit,
         u.weight_unit,
         u.created_at,
         u.trash,
         u.updated_at,
         u.subscribe_status
       FROM
         users u
       WHERE
         u.trash = false AND u.user_id = $1`;
         const result = await pool.query(query , [user_id]);


         if(result.rowCount>0){
            res.json({
                message: "User profile fetched",
                status : true,
                result : result.rows[0]
            })
         }
         else{
            res.json({
                message: "Could not Fetch profile , may be the user_id is wrong",
                status : false
            })
         }
        
    }
    catch (err) {
        console.log(err)
        res.json({
            message: "Error Occurred",
            status: false,
            error: err.message
        })
    }
}
exports.getAllUsers = async (req, res) => {
    const client = await pool.connect();
    try {
        let limit = req.query.limit;
        let page = req.query.page

        let result;

        if (!page || !limit) {
            const query = `SELECT
            u.user_id,
            u.user_name,
            u.email,
            u.password,
            u.focused_areas,
            u.gender,
            u.device_id,
            u.block,
            u.height,
            u.weight,
            u.height_unit,
            u.weight_unit,
            u.created_at,
            u.trash,
            u.updated_at,
            u.subscribe_status

            FROM
            users u
          WHERE
            u.trash = false`
           result = await pool.query(query);
        }

        if(page && limit){
            limit = parseInt(limit);
            let offset= (parseInt(page)-1)* limit;

            const query = `SELECT
            u.user_id,
            u.user_name,
            u.email,
            u.password,
            u.focused_areas,
            u.gender,
            u.device_id,
            u.block,
            u.height,
            u.weight,
            u.height_unit,
            u.weight_unit,
            u.created_at,
            u.trash,
            u.updated_at,
            u.subscribe_status
          FROM
            users u
          WHERE
            u.trash = false
            LIMIT $1 OFFSET $2`
            result = await pool.query(query , [limit , offset]);
        }   
      
        if (result.rows) {
            res.json({
                message: "Fetched",
                status: true,
                users_counts: result.rows.length,
                result: result.rows
            })
        }
        else {
            res.json({
                message: "could not fetch",
                status: false
            })
        }
    }
    catch (err) {
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
exports.deleteUser= async (req, res) => {
    const client = await pool.connect();
    try {
        const user_id = req.query.user_id;
        if (!user_id) {
            return (
                res.json({
                    message: "Please Provide user_id",
                    status: false
                })
            )
        }
        const query = 'DELETE FROM users WHERE user_id = $1 RETURNING *';
        const result = await pool.query(query , [user_id]);

        if(result.rowCount>0){
            res.status(200).json({
                message: "Deletion successfull",
                status: true,
                deletedRecord: result.rows[0]
            })
        }
        else{
            res.status(404).json({
                message: "Could not delete . Record With this Id may not found or req.body may be empty",
                status: false,
            })
        }

    }
    catch (err) {
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
exports.updateBlockStatus = async(req,res)=>{
    try{
        const user_id = req.query.user_id ;
        const block_status = req.query.block_status;


        if(!user_id && !block_status){
            return(
                res.json({
                    message: "User Id and block status must be provided",
                    status :false
                })
            )
        }


        const query = 'UPDATE users SET block = $1 WHERE user_id = $2 RETURNING*';

        const result = await pool.query(query , [block_status , user_id]);

        if(result.rows[0]){
            res.json({message: "Update successfully" , status :true , result : result.rows[0]})
        }
        else{
            res.json({message: "Could not Update" , status : false })
        }
    }
    catch (err) {
        console.log(err)
        res.json({
            message: "Error Occurred",
            status: false,
            error: err.message
        })
    }
}

exports.getUsersByMontsAndYear = async (req, res) => {
    const client = await pool.connect();
    try {
        let limit = req.query.limit;
        let page = req.query.page

        let result;

        if (!page || !limit) {
            const query = `SELECT 
            extract(year from created_at) as year,
            to_char(created_at, 'MM') as month,
            COUNT(*) as user_count,
            array_agg(json_build_object(
              'user_id', user_id,
              'user_name', user_name,
              'email', email,
              'password', password,
              'focused_areas', focused_areas,
              'gender', gender,
              'device_id', device_id,
              'block', block,
              'height', height,
              'weight', weight,
              'height_unit', height_unit,
              'weight_unit', weight_unit,
              'created_at', created_at,
              'updated_at', updated_at
            )) as users
          FROM users
          GROUP BY year, month
          ORDER BY year DESC, month DESC;`
           result = await pool.query(query);
        }

        if(page && limit){
            limit = parseInt(limit);
            let offset= (parseInt(page)-1)* limit;

            const query = `SELECT 
            extract(year from created_at) as year,
            to_char(created_at, 'MM') as month,
            COUNT(*) as user_count,
            array_agg(json_build_object(
              'user_id', user_id,
              'user_name', user_name,
              'email', email,
              'password', password,
              'focused_areas', focused_areas,
              'gender', gender,
              'device_id', device_id,
              'block', block,
              'height', height,
              'weight', weight,
              'height_unit', height_unit,
              'weight_unit', weight_unit,
              'created_at', created_at,
              'updated_at', updated_at
            )) as users
          FROM users
          GROUP BY year, month
          ORDER BY year DESC, month DESC LIMIT $1 OFFSET $2`
            result = await pool.query(query , [limit , offset]);
        }   
      
        if (result.rows) {
            res.json({
                message: "Fetched",
                status: true,
                users_counts: result.rows.length,
                result: result.rows
            })
        }
        else {
            res.json({
                message: "could not fetch",
                status: false
            })
        }
    }
    catch (err) {
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

exports.deleteTemporarily = async (req, res) => {
    const client = await pool.connect();
    try {
        const user_id = req.query.user_id;
        if (!user_id) {
            return (
                res.status(400).json({
                    message: "Please Provide user_id",
                    status: false
                })
            )
        }

        const query = 'UPDATE users SET trash=$2 WHERE user_id = $1 RETURNING *';
        const result = await pool.query(query , [user_id , true]);

        if(result.rowCount>0){
            res.status(200).json({
                message: "Temporaily Deleted",
                status: true,
                Temporarily_deletedRecord: result.rows[0]
            })
        }
        else{
            res.status(404).json({
                message: "Could not delete . Record With this Id may not found or req.body may be empty",
                status: false,
            })
        }

    }
    catch (err) {
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
 
exports.recover_record = async (req, res) => {
    const client = await pool.connect();
    try {
        const user_id = req.query.user_id;
        if (!user_id) {
            return (
                res.status(400).json({
                    message: "Please Provide user_id",
                    status: false
                })
            )
        }
        const query = 'UPDATE users SET trash=$2 WHERE user_id = $1 RETURNING *';
        const result = await pool.query(query , [user_id , false]);

        if(result.rowCount>0){
            res.status(200).json({
                message: "Recovered",
                status: true,
                recovered_record: result.rows[0]
            })
        }
        else{
            res.status(404).json({
                message: "Could not recover . Record With this Id may not found or req.body may be empty",
                status: false,
            })
        }

    }
    catch (err) {
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
 
exports.getAllTrashRecords = async (req, res) => {
    const client = await pool.connect();
    try {

        const query = 'SELECT * FROM users WHERE trash = $1';
        const result = await pool.query(query , [true]);

        if(result.rowCount>0){
            res.status(200).json({
                message: "Recovered",
                status: true,
                trashed_records: result.rows
            })
        }
        else{
            res.status(404).json({
                message: "Could not find trash records",
                status: false,
            })
        }

    }
    catch (err) {
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


exports.updateSubscribeStatus= async (req, res) => {
    const client = await pool.connect();
    try {

        const user_id = req.body.user_id;
        const subscription_status = req.body.subscription_status;
        const created_at = req.body.created_at;

        if(!subscription_status  || !user_id){
            return(
                res.json({
                    message: "subscription status and user_id must be provided",
                    status : false
                })
            )
        }

           
        let query = 'UPDATE user_subscription SET ';
        let index = 2;
        let values =[user_id];

        
        if(subscription_status){
            query+= `subscription_status = $${index} , `;
            values.push(subscription_status)
            index ++
        }

        if(created_at){
            query+= `created_at = $${index} , `;
            values.push(created_at)
            index ++
        }

        query += 'WHERE user_id = $1 RETURNING*'
        query = query.replace(/,\s+WHERE/g, " WHERE");
        console.log(query);
      
        const result = await pool.query(query , values)
        if(result.rowCount>0){
            res.status(200).json({
                message: "Updated subscription status",
                status: true,
                result: result.rows
            })
        }
        else{
            res.status(404).json({
                message: "Unable to update, make sure that while use is signed up",
                status: false,
            })
        }

    }
    catch (err) {
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

exports.getUserSubscribedDetails = async (req, res) => {
    const client = await pool.connect();
    try {
        const user_id = req.query.user_id;

        if(!user_id){
            return(
                res.json({
                    message: "user_id must be provided",
                    status : false
                })
            )
        }
        const query = `SELECT
        json_agg(json_build_object(
          'user_id', u.user_id,
          'user_name', u.user_name,
          'email', u.email,
          'password', u.password,
          'focused_areas', u.focused_areas,
          'gender', u.gender,
          'device_id', u.device_id,
          'block', u.block,
          'height', u.height,
          'weight', u.weight,
          'height_unit', u.height_unit,
          'weight_unit', u.weight_unit,
          'created_at', u.created_at,
          'trash', u.trash,
          'updated_at', u.updated_at,
          'user_subscription', (
            SELECT json_agg(json_build_object(
              'user_subscription_id', us.user_subscription_id,
              'subscription_status', us.subscription_status,
              'add_removal_status', us.add_removal_status,
              'created_at', us.created_at
            ))
            FROM user_subscription us
            WHERE us.user_id = u.user_id
          )
        )) AS records
      FROM users u
      WHERE u.user_id = $1
      GROUP BY u.user_id;
      ;
      ;
      `;
        const result = await pool.query(query , [user_id]);

        if(result.rowCount>0){
            res.status(200).json({
                message: "Fethced",
                status: true,
                result: result.rows[0].records[0]
            })
        }
        else{
            res.status(404).json({
                message: "Could not find",
                status: false,
            })
        }

    }
    catch (err) {
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

exports.getSubscribedUsers = async (req, res) => {
    const client = await pool.connect();
    try {
        const query = `SELECT
        json_agg(
            json_build_object(
                'user_subscription_id', us.user_subscription_id,
                'subscription_status', us.subscription_status,
                'add_removal_status', us.add_removal_status,
                'created_at', us.created_at,
                'user_details',
                CASE
                    WHEN u.user_id IS NOT NULL THEN (
                        SELECT json_agg(
                            json_build_object(
                                'user_id', u.user_id,
                                'user_name', u.user_name,
                                'email', u.email,
                                'password', u.password,
                                'focused_areas', u.focused_areas,
                                'gender', u.gender,
                                'device_id', u.device_id,
                                'block', u.block,
                                'height', u.height,
                                'weight', u.weight,
                                'height_unit', u.height_unit,
                                'weight_unit', u.weight_unit,
                                'created_at', u.created_at,
                                'trash', u.trash,
                                'updated_at', u.updated_at
                            )
                        )
                        FROM users u
                        WHERE u.user_id = us.user_id
                    )
                    ELSE NULL
                END
            )
        ) 
    FROM user_subscription us
    LEFT JOIN users u ON u.user_id = us.user_id
    WHERE us.subscription_status = $1
      AND u.user_id IS NOT NULL;
    ;

      `;
        const result = await pool.query(query , [true]);

        if(result.rowCount>0){
            res.status(200).json({
                message: "All subscribed users ",
                status: true,
                result: result.rows[0].json_agg
            })
        }
        else{
            res.status(404).json({
                message: "Could not find",
                status: false,
            })
        }

    }
    catch (err) {
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

exports.updateAdRemovalStatus= async (req, res) => {
    const client = await pool.connect();
    try {

        const user_id = req.body.user_id;
        const add_removal_status = req.body.add_removal_status;
        const created_at = req.body.created_at;

        if(!add_removal_status  || !user_id){
            return(
                res.json({
                    message: " add_removal_status and user_id must be provided",
                    status : false
                })
            )
        }

           
        let query = 'UPDATE user_subscription SET ';
        let index = 2;
        let values =[user_id];

        
        if(add_removal_status){
            query+= `add_removal_status = $${index} , `;
            values.push(add_removal_status)
            index ++
        }

        if(created_at){
            query+= `created_at = $${index} , `;
            values.push(created_at)
            index ++
        }

        query += 'WHERE user_id = $1 RETURNING*'
        query = query.replace(/,\s+WHERE/g, " WHERE");
        console.log(query);
      
        const result = await pool.query(query , values)

        if(result.rowCount>0){
            res.status(200).json({
                message: "Updated add removal status",
                status: true,
                result: result.rows
            })
        }
        else{
            res.status(404).json({
                message: "Could not updated. Make sure that user is signed up previously",
                status: false,
            })
        }

    }
    catch (err) {
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



const registerSchema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),

});

