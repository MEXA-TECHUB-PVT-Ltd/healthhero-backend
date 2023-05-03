
const {pool} = require("../../config/db.config");


exports.addExersise = async (req, res) => {
    const client = await pool.connect();
    try {
        const workout_plan_id = req.body.workout_plan_id;
        const title = req.body.title;
        const description = req.body.description ;
        const animation = req.body.animation ;
        const video_link = req.body.video_link;


        if(!workout_plan_id){
            return(
                res.json({
                    message: "Must provide workout_plan_id",
                    status : false
                })
            )
        }

   
        const query = 'INSERT INTO workoutPlanExersises (workout_plan_id , title , description ,animation , video_link ) VALUES ($1 , $2 , $3 , $4 , $5 ) RETURNING*'
        const result = await pool.query(query , 
            [
                workout_plan_id ? workout_plan_id : null,
                title ? title : null,
                description ? description : null,
                animation ? animation : null,
                video_link ? video_link : null,
    
            ]);


            
        if (result.rows[0]) {
            res.status(201).json({
                message: "workout plan exersise saved in database",
                status: true,
                result: result.rows[0]
            })
        }
        else {
            res.status(400).json({
                message: "Could not save",
                status: false
            })
        }
    }
    catch (err) {
        console.log(err)
        res.json({
            message: "Error",
            status: false,
            error: err.messagefalse
        })
    }
    finally {
        client.release();
      }

}

exports.updateWorkoutPlan_exersise = async (req, res) => {
    const client = await pool.connect();
    try {
        const workout_plan_exersise_id = req.body.workout_plan_exersise_id;
        const workout_plan_id = req.body.workout_plan_id;
        const title = req.body.title;
        const description = req.body.description ;
        const animation = req.body.animation ;
        const video_link = req.body.video_link;



        if (!workout_plan_exersise_id) {
            return (
                res.json({
                    message: "Please provide workout_plan_exersise_id ",
                    status: false
                })
            )
        }


    
        let query = 'UPDATE workoutPlanExersises SET ';
        let index = 2;
        let values =[workout_plan_exersise_id];

        
        if(workout_plan_id){
            query+= `workout_plan_id = $${index} , `;
            values.push(workout_plan_id)
            index ++
        }
        if(title){
            query+= `title = $${index} , `;
            values.push(title)
            index ++
        }
        if(description){
            query+= `description = $${index} , `;
            values.push(description)
            index ++
        }
       
        if(animation){
            query+= `animation = $${index} , `;
            values.push(animation)
            index ++
        }
        if(video_link){
            query+= `video_link = $${index} , `;
            values.push(video_link)
            index ++
        }
  
      

        query += 'WHERE workout_plan_exersise_id = $1 RETURNING*'
        query = query.replace(/,\s+WHERE/g, " WHERE");
        console.log(query);

       const result = await pool.query(query , values);

        if (result.rows[0]) {
            res.json({
                message: "Updated",
                status: true,
                result: result.rows[0]
            })
        }
        else {
            res.json({
                message: "Could not update . Record With this Id may not found or req.body may be empty",
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


exports.deleteWorkoutPlanExersise= async (req, res) => {
    const client = await pool.connect();
    try {
        const workout_plan_exersise_id = req.query.workout_plan_exersise_id;

        if (!workout_plan_exersise_id) {
            return (
                res.json({
                    message: "Please provide workout_plan_exersise_id ",
                    status: false
                })
            )
        }

        const query = 'DELETE FROM workoutPlanExersises WHERE workout_plan_exersise_id = $1 RETURNING *';
        const result = await pool.query(query , [workout_plan_exersise_id]);

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


exports.getAllplanExersise = async (req, res) => {
    const client = await pool.connect();
    try {

        let limit = req.query.limit;
        let page = req.query.page

        let result;

        if (!page || !limit) {
            const query = 'SELECT * FROM workoutPlanExersises'
            result = await pool.query(query);
           
        }

        if(page && limit){
            limit = parseInt(limit);
            let offset= (parseInt(page)-1)* limit

        const query = 'SELECT * FROM workoutPlanExersises LIMIT $1 OFFSET $2'
        result = await pool.query(query , [limit , offset]);

      
        }
       
        if (result.rows) {
            res.json({
                message: "Fetched",
                status: true,
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

exports.getAnWorkoutPlanExersise= async (req, res) => {
    const client = await pool.connect();
    try {
        const workout_plan_exersise_id = req.query.workout_plan_exersise_id;

        if (!workout_plan_exersise_id) {
            return (
                res.json({
                    message: "Please provide workout_plan_exersise_id ",
                    status: false
                })
            )
        }


        const query = 'SELECT * FROM workoutPlanExersises WHERE workout_plan_exersise_id = $1'
        const result = await pool.query(query , [workout_plan_exersise_id]);

        if (result.rowCount>0) {
            res.json({
                message: "Fetched",
                status: true,
                result: result.rows[0]
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

exports.planExersiseByWorkoutPlan_id= async (req, res) => {
    const client = await pool.connect();
    try {


        const workout_plan_id = req.query.workout_plan_id;
        if(!workout_plan_id){
            return(
                res.json({
                    message : "Please must provide workout_plan_id",
                    status : false
                })
            )
        }


        let limit = req.query.limit;
        let page = req.query.page

        let result;

        if (!page || !limit) {
            const query = 'SELECT * FROM workoutPlanExersises WHERE workout_plan_id= $1'
            result = await pool.query(query , [workout_plan_id]);
           
        }

        if(page && limit){
            limit = parseInt(limit);
            let offset= (parseInt(page)-1)* limit

        const query = 'SELECT * FROM workoutPlanExersises WHERE workout_plan_id= $3 LIMIT $1 OFFSET $2'
        result = await pool.query(query , [limit , offset , workout_plan_id]);

        }
       
        if (result.rows) {
            res.json({
                message: "Fetched",
                status: true,
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

exports.deleteAllWorkoutPlanExersises= async (req, res) => {
    const client = await pool.connect();
    try {
        const workout_plan_id = req.query.workout_plan_id;
        if(!workout_plan_id){
            return(
                res.json({
                    message : "Please must provide workout_plan_id",
                    status : false
                })
            )
        }

        const query = 'DELETE FROM workoutPlanExersises WHERE workout_plan_id = $1 RETURNING *';
        const result = await pool.query(query , [workout_plan_id]);

        if(result.rowCount>0){
            res.status(200).json({
                message: "Deletion successfull",
                status: true,
                deletedRecord: result.rows
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

exports.like_exersise = async (req, res) => {
    const client = await pool.connect();
    try {
        const user_id = req.query.user_id;
        const workout_plan_exersise_id = req.query.workout_plan_exersise_id;
        
        if(!user_id  || !workout_plan_exersise_id){
            return(
                res.json({
                    message : "user_id and workout_plan_exersise_id must be provided",
                    status : false
                })
            )
        }

        const foundQuery = 'SELECT * FROM liked_exersises_of_user WHERE user_id = $1 AND exersise_id = $2';
        const foundResult = await pool.query(foundQuery , [user_id , workout_plan_exersise_id]);

        if(foundResult.rows[0]){
            return(
                res.json({
                    message: "User Has already like this exersise",
                    status : false
                })
            )
        }   

        const query = 'INSERT INTO liked_exersises_of_user (user_id , exersise_id) VALUES ($1 , $2) RETURNING*';
        const result = await pool.query(query , [user_id , workout_plan_exersise_id]);
        
        if (result.rows[0]) {
            res.json({
                message: "Liked Successfull",
                status: true,
                result: result.rows[0]
            })
        }
        else {
            res.json({
                message: "could not Liked",
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
exports.unLike_exersise = async (req, res) => {
    const client = await pool.connect();
    try {
        const user_id = req.query.user_id;
        const workout_plan_exersise_id = req.query.workout_plan_exersise_id;
        
        if(!user_id  || !workout_plan_exersise_id){
            return(
                res.json({
                    message : "user_id and workout_plan_exersise_id must be provided",
                    status : false
                })
            )
        }

        const query = 'DELETE FROM liked_exersises_of_user WHERE user_id = $1 AND exersise_id = $2 RETURNING*';
        const result = await pool.query(query , [user_id , workout_plan_exersise_id]);
        
        if (result.rows[0]) {
            res.json({
                message: "UNLIKED Successfull",
                status: true,
                deletedRecord: result.rows[0]
            })
        }
        else {
            res.json({
                message: "could not Unliked",
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
exports.checkUserLikeStatusForExersise = async (req, res) => {
    const client = await pool.connect();
    try {
        const user_id = req.query.user_id;
        const workout_plan_exersise_id = req.query.workout_plan_exersise_id;
        
        if(!user_id  || !workout_plan_exersise_id){
            return(
                res.json({
                    message : "user_id and workout_plan_exersise_id must be provided",
                    status : false
                })
            )
        }

        const query = 'SELECT * FROM liked_exersises_of_user WHERE user_id = $1 AND exersise_id = $2';
        const result = await pool.query(query , [user_id , workout_plan_exersise_id]);
        
        if (result.rows[0]) {
            res.json({
                message: "Fethced",
                liked_the_plan : true,
            })
        }
        else {
            res.json({
                message: "Fethced",
                liked_the_plan: false
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

exports.get_user_liked_exersises = async (req, res) => {
    const client = await pool.connect();
    try {
        const user_id = req.query.user_id;
        
        if(!user_id ){
            return(
                res.json({
                    message : "user_id  must be provided",
                    status : false
                })
            )
        }

        const query = `SELECT 
        json_build_object(
          'workout_plan_exersise_id', ex.workout_plan_exersise_id,
          'workout_plan_id', ex.workout_plan_id,
          'title', ex.title,
          'description', ex.description,
          'animation', ex.animation,
          'video_link' , ex.video_link
        ) AS exercise_details
      FROM 
      liked_exersises_of_user le 
        JOIN workoutPlanExersises ex ON le.exersise_id = ex.workout_plan_exersise_id
      WHERE 
        le.user_id = $1;
      `;
        const result = await pool.query(query , [user_id]);
        
        if (result.rows[0]) {
            res.json({
                message: "Fethced",
                status : true,
                result : result.rows
            })
        }
        else {
            res.json({
                message: "Fethced",
                status : false
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