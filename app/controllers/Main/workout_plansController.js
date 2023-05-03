
const {pool} = require("../../config/db.config");


exports.addworkoutPlan = async (req, res) => {
    const client = await pool.connect();
    try {
        const category_id = req.body.category_id;
        const workout_title = req.body.workout_title;
        const description = req.body.description ;
        const image = req.body.image ;
        const focus_area = req.body.focus_area ;
        const paid_status = req.body.paid_status;
        const level_of_workout = req.body.level_of_workout;


        if(!category_id){
            return(
                res.json({
                    message: "Must provide category_id",
                    status : false
                })
            )
        }

          
        if(level_of_workout){
            if(level_of_workout == 'beginner' || level_of_workout == 'advance' || level_of_workout == 'intermediate'){

            }
            else{
                return(
                    res.json({
                        message : "level of work must be one of these  [beginner , advance , intermediate",
                        status : false
                    })
                )
            }
        }
        const query = 'INSERT INTO workout_plans (category_id , workout_title , description , image ,focus_area , paid_status , level_of_workout ) VALUES ($1 , $2 , $3 , $4 , $5 , $6 , $7) RETURNING*'
        const result = await pool.query(query , 
            [
                category_id ? category_id : null,
                workout_title ? workout_title : null,
                description ? description : null,
                image ? image : null,
                focus_area ? focus_area : null,
                paid_status ? paid_status : null,
                level_of_workout ? level_of_workout : null,

              
            ]);


            
        if (result.rows[0]) {
            res.status(201).json({
                message: "workout plan saved in database",
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

exports.updateWorkoutPlans = async (req, res) => {
    const client = await pool.connect();
    try {
        const workout_plan_id = req.body.workout_plan_id;
        const workout_title = req.body.workout_title;
        const category_id = req.body.category_id;
         const description = req.body.description ;
        const image = req.body.image ;
        const focus_area = req.body.focus_area ;
        const paid_status = req.body.paid_status;
        const level_of_workout = req.body.levellevel_of_workout_of_work;



        if (!workout_plan_id) {
            return (
                res.json({
                    message: "Please provide workout_plan_id ",
                    status: false
                })
            )
        }


    
        if(level_of_workout){
            if(level_of_workout == 'beginner' || level_of_workout == 'advance' || level_of_workout == 'intermediate'){

            }
            else{
                return(
                    res.json({
                        message : "level of work must be one of these  [beginner , advance , intermediate",
                        status : false
                    })
                )
            }
        }

        let query = 'UPDATE workout_plans SET ';
        let index = 2;
        let values =[workout_plan_id];

        
        if(workout_title){
            query+= `workout_title = $${index} , `;
            values.push(workout_title)
            index ++
        }
        if(description){
            query+= `description = $${index} , `;
            values.push(description)
            index ++
        }
        if(image){
            query+= `image = $${index} , `;
            values.push(image)
            index ++
        }
        if(focus_area){
            query+= `focus_area = $${index} , `;
            values.push(focus_area)
            index ++
        }
        if(paid_status){
            query+= `paid_status = $${index} , `;
            values.push(paid_status)
            index ++
        }
        if(level_of_workout){
            query+= `level_of_workout = $${index} , `;
            values.push(level_of_workout)
            index ++
        }
        if(category_id){
            query+= `category_id = $${index} , `;
            values.push(category_id)
            index ++
        }
     
      

        query += 'WHERE workout_plan_id = $1 RETURNING*'
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


exports.deleteWorkoutPlan= async (req, res) => {
    const client = await pool.connect();
    try {
        const workout_plan_id = req.query.workout_plan_id;

        if (!workout_plan_id) {
            return (
                res.json({
                    message: "Please provide workout_plan_id ",
                    status: false
                })
            )
        }

        const query = 'DELETE FROM workout_plans WHERE workout_plan_id = $1 RETURNING *';
        const result = await pool.query(query , [workout_plan_id]);

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


exports.getAllWorkoutPlans = async (req, res) => {
    const client = await pool.connect();
    try {

        let limit = req.query.limit;
        let page = req.query.page

        let result;

        if (!page || !limit) {
            const query = 'SELECT * FROM workout_plans'
            result = await pool.query(query);
           
        }

        if(page && limit){
            limit = parseInt(limit);
            let offset= (parseInt(page)-1)* limit

        const query = 'SELECT * FROM workout_plans LIMIT $1 OFFSET $2'
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

exports.getWorkoutPlanById= async (req, res) => {
    const client = await pool.connect();
    try {
        const workout_plan_id = req.query.workout_plan_id;

        if (!workout_plan_id) {
            return (
                res.json({
                    message: "Please provide workout_plan_id ",
                    status: false
                })
            )
        }

        const query = 'SELECT * FROM workout_plans WHERE workout_plan_id = $1'
        const result = await pool.query(query , [workout_plan_id]);

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

exports.get_for_intermediate = async (req, res) => {
    const client = await pool.connect();
    try {

        let limit = req.query.limit;
        let page = req.query.page

        let result;

        if (!page || !limit) {
            const query = 'SELECT * FROM workout_plans WHERE level_of_workout=$1'
            result = await pool.query(query , ["intermediate"]);
           
        }

        if(page && limit){
            limit = parseInt(limit);
            let offset= (parseInt(page)-1)* limit

        const query = 'SELECT * FROM workout_plans WHERE level_of_workout=$3 LIMIT $1 OFFSET $2'
        result = await pool.query(query , [limit , offset , "intermediate"]);

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


exports.get_for_beginners = async (req, res) => {
    const client = await pool.connect();
    try {

        let limit = req.query.limit;
        let page = req.query.page

        let result;

        if (!page || !limit) {
            const query = 'SELECT * FROM workout_plans  WHERE level_of_workout=$1'
            result = await pool.query(query , ["beginner"]);
           
        }

        if(page && limit){
            limit = parseInt(limit);
            let offset= (parseInt(page)-1)* limit

        const query = 'SELECT * FROM workout_plans workout_plans  WHERE level_of_workout=$3 LIMIT $1 OFFSET $2'
        result = await pool.query(query , [limit , offset , 'beginner']);

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

exports.get_for_advance = async (req, res) => {
    const client = await pool.connect();
    try {

        let limit = req.query.limit;
        let page = req.query.page

        let result;

        if (!page || !limit) {
            const query = 'SELECT * FROM workout_plans workout_plans  WHERE level_of_workout=$1'
            result = await pool.query(query , ["advance"]);
           
        }

        if(page && limit){
            limit = parseInt(limit);
            let offset= (parseInt(page)-1)* limit

        const query = 'SELECT * FROM workout_plans workout_plans  WHERE level_of_workout=$3 LIMIT $1 OFFSET $2'
        result = await pool.query(query , [limit , offset , 'advance']);

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


exports.workoutPlansByCategory_id = async (req, res) => {
    const client = await pool.connect();
    try {


        const category_id = req.query.category_id;
        if(!category_id){
            return(
                res.json({
                    message : "Please must provide category_id",
                    status : false
                })
            )
        }


        let limit = req.query.limit;
        let page = req.query.page

        let result;

        if (!page || !limit) {
            const query = 'SELECT * FROM workout_plans WHERE category_id= $1'
            result = await pool.query(query , [category_id]);
           
        }

        if(page && limit){
            limit = parseInt(limit);
            let offset= (parseInt(page)-1)* limit

        const query = 'SELECT * FROM workout_plans WHERE category_id= $3 LIMIT $1 OFFSET $2'
        result = await pool.query(query , [limit , offset , category_id]);

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

exports.like_plan = async (req, res) => {
    const client = await pool.connect();
    try {
        const user_id = req.query.user_id;
        const workout_plan_id = req.query.workout_plan_id;
        
        if(!user_id  || !workout_plan_id){
            return(
                res.json({
                    message : "user_id and workout_plan_id must be provided",
                    status : false
                })
            )
        }

        const foundQuery = 'SELECT * FROM user_likes_workouts WHERE user_id = $1 AND workout_plan_id = $2';
        const foundResult = await pool.query(foundQuery , [user_id , workout_plan_id]);

        if(foundResult.rows[0]){
            return(
                res.json({
                    message: "User Has already like this plan",
                    status : false
                })
            )
        }   

        const query = 'INSERT INTO user_likes_workouts (user_id , workout_plan_id) VALUES ($1 , $2) RETURNING*';
        const result = await pool.query(query , [user_id , workout_plan_id]);
        
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
exports.unLike_plan = async (req, res) => {
    const client = await pool.connect();
    try {
        const user_id = req.query.user_id;
        const workout_plan_id = req.query.workout_plan_id;
        
        if(!user_id  || !workout_plan_id){
            return(
                res.json({
                    message : "user_id and workout_plan_id must be provided",
                    status : false
                })
            )
        }

        const query = 'DELETE FROM user_likes_workouts WHERE user_id = $1 AND workout_plan_id = $2 RETURNING*';
        const result = await pool.query(query , [user_id , workout_plan_id]);
        
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
exports.checkUserLikeStatusForPlan = async (req, res) => {
    const client = await pool.connect();
    try {
        const user_id = req.query.user_id;
        const workout_plan_id = req.query.workout_plan_id;
        
        if(!user_id  || !workout_plan_id){
            return(
                res.json({
                    message : "user_id and workout_plan_id must be provided",
                    status : false
                })
            )
        }

        const query = 'SELECT * FROM user_likes_workouts WHERE user_id = $1 AND workout_plan_id = $2';
        const result = await pool.query(query , [user_id , workout_plan_id]);
        
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


exports.start_workout = async (req, res) => {
    const client = await pool.connect();
    try {
        const user_id = req.body.user_id;
        const workout_plan_id = req.body.workout_plan_id;
        
        if(!user_id  || !workout_plan_id){
            return(
                res.json({
                    message : "user_id and workout_plan_id must be provided",
                    status : false
                })
            )
        }


        const foundQuery = 'SELECT * FROM user_inActionWorkouts WHERE user_id = $1 AND workout_plan_id = $2';
        const foundResult = await pool.query(foundQuery , [user_id , workout_plan_id]);

        if(foundResult.rowCount > 0){
            return(
                res.json({
                    message: "This User already started this workout",
                    status : false
                })
            )
        }

        const query = 'INSERT INTO user_inActionWorkouts (user_id , workout_plan_id , status) VALUES ($1 , $2 , $3) RETURNING*';
        const result = await pool.query(query , [user_id , workout_plan_id , "inprogress"]);
        
        if (result.rows[0]) {
            res.json({
                message: "User Started this workout",
                status : true,
                result : result.rows[0]
            })
        }
        else {
            res.json({
                message: "could not start a workout for this user",
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

exports.complete_workout = async (req, res) => {
    const client = await pool.connect();
    try {
        const user_inaction_workout_id = req.query.user_inaction_workout_id;
        
        if(!user_inaction_workout_id){
            return(
                res.json({
                    message : " user_inaction_workout_id must be provided",
                    status : false
                })
            )
        }


        const query = 'UPDATE user_inActionWorkouts SET status = $1 WHERE user_inaction_workout_id = $2 RETURNING*';
        const result = await pool.query(query , ["completed" , user_inaction_workout_id ]);
        
        if (result.rows[0]) {
            res.json({
                message: "Updated Staus to completed",
                status : true ,
                result : result .rows[0]
            })
        }
        else {
            res.json({
                message: "Could not Update",
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

exports.workoutsPlanCompletedByUser= async (req, res) => {
    const client = await pool.connect();
    try {
        const user_id = req.query.user_id;

        let limit = req.query.limit;
        let page = req.query.page

        let result;

        if (!page || !limit) {
            const query = 'SELECT * FROM user_inActionWorkouts WHERE user_id = $1 AND status = $2'
            result = await pool.query(query , [user_id , 'completed']);
           
        }

        if(page && limit){
            limit = parseInt(limit);
            let offset= (parseInt(page)-1)* limit

        const query = 'SELECT * FROM user_inActionWorkouts WHERE user_id = $1 AND status = $2  LIMIT $3 OFFSET $4'
        result = await pool.query(query , [user_id ,"completed" , limit , offset]);      
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

