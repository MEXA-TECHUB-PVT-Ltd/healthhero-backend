
const {pool} = require("../../config/db.config");
const { use } = require("../../routes/Users/userRoute");


exports.create_my_plan = async (req, res) => {
    const client = await pool.connect();
    try {
        const user_id = req.body.user_id;
        const plan_name = req.body.plan_name;
        const description = req.body.description;
        const created_at = req.body.created_at;

        if(!created_at || !user_id){
            return(
                res.json({
                    message: "created_at and user_id must be provided",
                    status : false
                })
            )
        }



        const query = 'INSERT INTO user_plans (user_id ,plan_name,description , created_at) VALUES ($1 , $2 , $3 , $4) RETURNING*'
        const result = await pool.query(query , 
            [
                user_id ? user_id : null,
                plan_name ? plan_name : null,
                description ?description : null,
                created_at ? created_at : null
              
            ]);


            
        if (result.rows[0]) {
            res.status(201).json({
                message: "user plan saved in database",
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

exports.update_user_plan = async (req, res) => {
    const client = await pool.connect();
    try {

        const workout_plan_id = req.body.workout_plan_id;
        const user_id = req.body.user_id;
        const plan_name = req.body.plan_name;
        const description = req.body.description;



        if (!workout_plan_id) {
            return (
                res.json({
                    message: "Please provide workout_plan_id ",
                    status: false
                })
            )
        }


    
        let query = 'UPDATE user_plans SET ';
        let index = 2;
        let values =[workout_plan_id];

        
        if(user_id){
            query+= `user_id = $${index} , `;
            values.push(user_id)
            index ++
        }
      
        if(plan_name){
            query+= `plan_name = $${index} , `;
            values.push(plan_name)
            index ++
        }

        if(description){
            query+= `description = $${index} , `;
            values.push(description)
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

exports.addExersise_in_myPlan= async (req, res) => {
    const client = await pool.connect();
    try {
        const user_id = req.body.user_id;
        const workout_plan_id = req.body.workout_plan_id;
        let array = req.body.array;

        let resultArray = [];

        for (let i = 0; i < array.length; i++) {
            const element = array[i];
            element.workout_plan_id = workout_plan_id
        }

        const values = array.map(obj => [obj.exersise_id, obj.time, obj.reps, obj.workout_plan_id]);
        console.log(values)


        for (let i = 0; i < values.length; i++) {
            const element = values[i];

            let foundQuuery = 'SELECT * FROM workout_plan_exersises WHERE exersise_id= $1 AND workout_plan_id = $2';
            let foundResult = await pool.query(foundQuuery, [element[0], element[3]]);

            console.log(foundResult.rows)
            if (foundResult.rowCount > 0) {
                return (res.json({
                    message: `Exersise with exersise_id : ${element[0]} And workout_plan_id : ${element[3]} already exists`,
                    status: 'false'
                }));
            }

        }
        for (let i = 0; i < values.length; i++) {
            const element = values[i];
            let query = 'INSERT INTO workout_plan_exersises (exersise_id , time , reps , workout_plan_id ) VALUES ($1 , $2 , $3 , $4) RETURNING*';
            let result = await pool.query(query, element);
            resultArray.push(result.rows[0])
        }

        if (resultArray) {
            res.status(201).json({
                message: "Exersises saved in database for user plan",
                status: true,
                result: resultArray
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

exports.removeExersise_in_myPlan= async (req, res) => {
    const client = await pool.connect();
    try {
        const user_id = req.body.user_id;
        const plan_id = req.body.plan_id;
        const exersise_id = req.body.exersise_id


        if (!user_id || !plan_id || !exersise_id) {
            return (
                res.json({
                    message: "Please provide user_id , exersise_id , plan_id",
                    status: false
                })
            )
        }

    
        let query = 'UPDATE user_plans SET exersise_ids = ARRAY_REMOVE(exersise_ids , $3) WHERE user_id = $1 AND workout_plan_id = $2 RETURNING *';
        let values =[user_id , plan_id , exersise_id ];

       const result = await pool.query(query , values);

        if (result.rows[0]) {
            res.json({
                message: "deleted exersise id from previous",
                status: true,
                result: result.rows[0]
            })
        }
        else {
            res.json({
                message: "Could not add",
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

exports.deleteAllUserPlans= async (req, res) => {
    const client = await pool.connect();
    try {
        const user_id = req.query.user_id;
        if (!user_id) {
            return (
                res.json({
                    message: "Please provide user_id ",
                    status: false
                })
            )
        }

        const query = 'DELETE FROM user_plans WHERE user_id = $1 RETURNING *';
        const result = await pool.query(query , [user_id]);

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

exports.get_plan= async (req, res) => {
    const client = await pool.connect();
    try {
        const user_id = req.query.user_id;
        const plan_id = req.query.plan_id;
        if (!user_id || !plan_id) {
            return (
                res.json({
                    message: "Please provide user_id & plan_id",
                    status: false
                })
            )
        }

        const query = `
  SELECT
    up.*,
    (
        SELECT json_agg(
          json_build_object(
            'exersise_id', e.exersise_id,
            'workout_plan_exersise_id', e.workout_plan_exersise_id,
              'reps' , e.reps,
              'time' , e.time,
              'trash' , e.trash,
              'created_at' , e.created_at,
              'updated_at' , e.updated_at,
              'exersise_details' , (  SELECT 
              json_build_object(
                    'exersise_id', ex.exersise_id,
                    'title', ex.title,
                    'description' , ex.description,
                    'animation' , ex.animation,
                    'video_link' , ex.video_link,
                    'trash' , ex.trash,
                    'created_at' , ex.created_at,
                    'updated_at' , ex.updated_at
                )
                FROM exersises ex
                  WHERE ex.exersise_id = e.exersise_id
              )
          )
        )
        FROM workout_plan_exersises e
        WHERE e.workout_plan_id = up.workout_plan_id
      ) AS workout_plan_exersises
  FROM user_plans up
  WHERE up.user_id = $1 AND up.workout_plan_id = $2;
`;

        const result = await pool.query(query , [user_id , plan_id]);

        if(result.rowCount>0){
            res.status(200).json({
                message: "Fetched",
                status: true,
                result: result.rows[0]
            })
        }
        else{
            res.status(404).json({
                message: "Could not Fetch",
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

exports.getAllUserPlans = async (req, res) => {
    const client = await pool.connect();
    try {

        let limit = req.query.limit;
        let page = req.query.page;
        const user_id = req.query.user_id;

        if(!user_id){
            return(
                res.json({
                    message : "user_id must be provided",
                    status : false
                })
            )
        }
        let result;

        if (!page || !limit) {
            const query = ` SELECT
            up.*,
            (
                SELECT json_agg(
                  json_build_object(
                    'exersise_id', e.exersise_id,
                    'workout_plan_exersise_id', e.workout_plan_exersise_id,
                      'reps' , e.reps,
                      'time' , e.time,
                      'trash' , e.trash,
                      'created_at' , e.created_at,
                      'updated_at' , e.updated_at,
                      'exersise_details' , (  SELECT 
                      json_build_object(
                            'exersise_id', ex.exersise_id,
                            'title', ex.title,
                            'description' , ex.description,
                            'animation' , ex.animation,
                            'video_link' , ex.video_link,
                            'trash' , ex.trash,
                            'created_at' , ex.created_at,
                            'updated_at' , ex.updated_at
                        )
                        FROM exersises ex
                          WHERE ex.exersise_id = e.exersise_id
                      )
                  )
                )
                FROM workout_plan_exersises e
                WHERE e.workout_plan_id = up.workout_plan_id
              ) AS workout_plan_exersises
          FROM user_plans up
          WHERE up.user_id = $1`
            result = await pool.query(query , [user_id]);
           
        }

        if(page && limit){
            limit = parseInt(limit);
            let offset= (parseInt(page)-1)* limit

        const query = ` SELECT
        up.*,
        (
            SELECT json_agg(
              json_build_object(
                'exersise_id', e.exersise_id,
                'workout_plan_exersise_id', e.workout_plan_exersise_id,
                  'reps' , e.reps,
                  'time' , e.time,
                  'trash' , e.trash,
                  'created_at' , e.created_at,
                  'updated_at' , e.updated_at,
                  'exersise_details' , (  SELECT 
                  json_build_object(
                        'exersise_id', ex.exersise_id,
                        'title', ex.title,
                        'description' , ex.description,
                        'animation' , ex.animation,
                        'video_link' , ex.video_link,
                        'trash' , ex.trash,
                        'created_at' , ex.created_at,
                        'updated_at' , ex.updated_at
                    )
                    FROM exersises ex
                      WHERE ex.exersise_id = e.exersise_id
                  )
              )
            )
            FROM workout_plan_exersises e
            WHERE e.workout_plan_id = up.workout_plan_id
          ) AS workout_plan_exersises
      FROM user_plans up
      WHERE up.user_id = $3 LIMIT $1 OFFSET $2`
        result = await pool.query(query , [limit , offset , user_id]);

      
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

exports.deleteTemporarily = async (req, res) => {
    const client = await pool.connect();
    try {
        const workout_plan_id = req.query.workout_plan_id;
        if (!workout_plan_id) {
            return (
                res.status(400).json({
                    message: "Please Provide workout_plan_id",
                    status: false
                })
            )
        }

        const query = 'UPDATE user_plans SET trash=$2 WHERE workout_plan_id = $1 RETURNING *';
        const result = await pool.query(query , [workout_plan_id , true]);

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
        const workout_plan_id = req.query.workout_plan_id;
        if (!workout_plan_id) {
            return (
                res.status(400).json({
                    message: "Please Provide workout_plan_id",
                    status: false
                })
            )
        }
        const query = 'UPDATE user_plans SET trash=$2 WHERE workout_plan_id = $1 RETURNING *';
        const result = await pool.query(query , [workout_plan_id , false]);

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

        const query = 'SELECT * FROM user_plans WHERE trash = $1';
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
