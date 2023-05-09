

const {pool} = require("../../config/db.config");


exports.addSeven_by_four = async (req, res) => {
    const client = await pool.connect();
    try {
        const name = req.body.name;
        const description = req.body.description;
        const image = req.body.image;

        let array = req.body.inputArray;
        let seven_by_four_challenge_id;
        let week_id
        let day_id;

        let week_details;
        let day_details;

        for (let i = 0; i < array.length; i++) {
            const element = array[i];
        if(!element.week_no || !element.day || !element.exercises){
            return(
                res.json({
                    message: "week_no,day and exersises(Array) must be passed , It seems in one or many of these array of documents have a problem",
                    status :false
                })
            )
        }
        }

        const challenge_query = 'INSERT INTO SevenByFourChallenge (name , description , image ) VALUES ($1 ,$2 ,$3) RETURNING *';
        const challenge_result = await pool.query(challenge_query , [
            name ? name : null,
            description ?description : null,
            image ? image : null
        ]);


        if(challenge_result.rows[0]){
            if(challenge_result.rows[0].seven_by_four_challenge_id){
                seven_by_four_challenge_id  = challenge_result.rows[0].seven_by_four_challenge_id;
            }
        }
        else{return(res.json({message : "There is some issue in creating seven_by_fourchallenge" , status : false}))}


        if(seven_by_four_challenge_id){
            for (let i = 0; i < array.length; i++) {
                const element = array[i];
                if(element.week_no){
                    let query= 'INSERT INTO SevenByFourChallenge_weeks (seven_by_four_challenge_id , week_no ) VALUES ($1 , $2 ) RETURNING *';
                    const result = await pool.query(query , [seven_by_four_challenge_id, element.week_no]);

                    if(result.rows[0]){
                        week_details= result.rows[0];
                        if(result.rows[0].week_id){
                            week_id = result.rows[0].week_id
                        }
                    }
                    else{
                        let  deletePreviousQuery = 'DELETE FROM SevenByFourChallenge WHERE seven_by_four_challenge_id = $1 RETURNING * ';
                        if(deletePreviousQuery.rowCount >0){
                            console.log("previously created seven by challenge also deleted as due to error occurred in weeks");
                        }
                        return(
                            res.json({
                                message : "Issue Occurred in creating week for this challenge", status :false
                            })
                        )
                    }
                }
                
            }
        }


        if(seven_by_four_challenge_id && week_id){
            for (let i = 0; i < array.length; i++) {
                const element = array[i];
                if(element.day){
                    let query= 'INSERT INTO SevenByFourChallenge_week_days (week_id , seven_by_four_challenge_id , day , exercises ) VALUES ($1 , $2 , $3 , $4 ) RETURNING *';
                    const result = await pool.query(query , [week_id, seven_by_four_challenge_id , element.day , element.exercises]);
                    if(result.rows[0]){
                        day_details = result.rows[0];
                        if(result.rows[0].day_id){
                            day_id = result.rows[0].day_id;
                        }
                    }
                    else{
                        // let  deletePreviousQuery = 'DELETE FROM SevenByFourChallenge WHERE seven_by_four_challenge_id = $1 RETURNING * ';
                        // if(deletePreviousQuery.rowCount >0){
                        //     console.log("previously created seven by challenge also deleted as due to error occurred in weeks");
                        // }
                        // return(
                        //     res.json({
                        //         message : "Issue Occurred in creating week for this challenge", status :false
                        //     })
                        // )
                    }
                }
                
   
            }
        }
            
        if (day_details && week_details && seven_by_four_challenge_id) {
            res.status(201).json({
                message: "7X4 challenge created",
                status: true,
                seven_by_four_challenge :challenge_result.rows[0],
                week_details : week_details ,
                day_details : day_details,
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


exports.update_sevenByFour = async (req, res) => {
    const client = await pool.connect();
    try {

        const seven_by_four_challenge_id = req.body.seven_by_four_challenge_id;
        const week_no = req.body.week_no;
        const exersise_ids = req.body.exersise_ids;



        if (!seven_by_four_challenge_id) {
            return (
                res.json({
                    message: "Please provide seven_by_four_challenge_id ",
                    status: false
                })
            )
        }


    
        let query = 'UPDATE seven_by_four_challenges SET ';
        let index = 2;
        let values =[seven_by_four_challenge_id];

        
        if(week_no){
            query+= `week_no = $${index} , `;
            values.push(week_no)
            index ++
        }
      
        if(exersise_ids){
            query+= `exersise_ids = $${index} , `;
            values.push(exersise_ids)
            index ++
        }

        query += 'WHERE seven_by_four_challenge_id = $1 RETURNING*'
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
exports.deleteSevenByFour = async (req, res) => {
    const client = await pool.connect();
    try {
        const seven_by_four_challenge_id = req.query.seven_by_four_challenge_id;
        if (!seven_by_four_challenge_id) {
            return (
                res.json({
                    message: "Please provide seven_by_four_challenge_id ",
                    status: false
                })
            )
        }

        const query = 'DELETE FROM seven_by_four_challenges WHERE seven_by_four_challenge_id = $1 RETURNING *';
        const result = await pool.query(query , [seven_by_four_challenge_id]);

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



exports.getSevenByFour= async (req, res) => {
    const client = await pool.connect();
    try {
        const seven_by_four_challenge_id = req.query.seven_by_four_challenge_id;
        if (!seven_by_four_challenge_id) {
            return (
                res.json({
                    message: "Please provide seven_by_four_challenge_id ",
                    status: false
                })
            )
        }

        const query = `SELECT 
        seven_by_four_challenge_id,
        week_no,
        json_agg(
          json_build_object(
            'workout_plan_exersise_id', workoutPlanExersises.workout_plan_exersise_id,
            'title', workoutPlanExersises.title,
            'description', workoutPlanExersises.description,
            'animation', workoutPlanExersises.animation,
            'video_link', workoutPlanExersises.video_link
          )
        ) AS exersises
      FROM seven_by_four_challenges
      JOIN workoutPlanExersises ON workoutPlanExersises.workout_plan_exersise_id = ANY(seven_by_four_challenges.exersise_ids)
      WHERE seven_by_four_challenge_id= $1
      GROUP BY seven_by_four_challenge_id, week_no;`;
 
        const result = await pool.query(query , [seven_by_four_challenge_id]);

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


exports.add_ExersisesInto_7x4= async (req, res) => {
    const client = await pool.connect();
    try {

        const seven_by_four_challenge_id = req.body.seven_by_four_challenge_id;
        const exersise_ids = req.body.exersise_ids;
        let updatedArray;

        if (!seven_by_four_challenge_id || !exersise_ids) {
            return (
                res.json({
                    message: "Please provide seven_by_four_challenge_id , exersise_ids ",
                    status: false
                })
            )
        }

        const foundResut = await pool.query('SELECT * FROM seven_by_four_challenges WHERE seven_by_four_challenge_id = $1' , [seven_by_four_challenge_id])
        if(foundResut){
            if(foundResut.rows[0]){
                if(foundResut.rows[0].exersise_ids){
                    let prev_exersiseIds = foundResut.rows[0].exersiseIds;
                    updatedArray = prev_exersiseIds.concat(exersise_ids);

                }
            }
        }

    
        let query = 'UPDATE seven_by_four_challenges SET ';
        let index = 2;
        let values =[seven_by_four_challenge_id];

        
        if(week_no){
            query+= `week_no = $${index} , `;
            values.push(week_no)
            index ++
        }
      
        if(updatedArray){
            query+= `exersise_ids = $${index} , `;
            values.push(updatedArray)
            index ++
        }

        query += 'WHERE seven_by_four_challenge_id = $1 RETURNING*'
        query = query.replace(/,\s+WHERE/g, " WHERE");
        console.log(query);

       const result = await pool.query(query , values);

        if (result.rows[0]) {
            res.json({
                message: "Added exersise ids into previous",
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