

const {pool} = require("../../config/db.config");


exports.addSeven_by_four = async (req, res) => {
    const client = await pool.connect();
    try {
        const week_no = req.body.week_no;
        const exersise_ids = req.body.exersise_ids;




        const countQuery = 'SELECT COUNT(*) FROM seven_by_four_challenges';
        const foundResult = await pool.query(countQuery);

        console.log(foundResult)

        if(parseInt(foundResult.rows[0].count) > 0){
            return (res.json({
                message: "Already added seven by four challenge",
                status : false
            }))
        }

        const query = 'INSERT INTO seven_by_four_challenges (week_no , exersise_ids) VALUES ($1 , $2) RETURNING*'
        const result = await pool.query(query , 
            [
                week_no ? week_no : null,
                exersise_ids ? exersise_ids : null
              
            ]);


            
        if (result.rows[0]) {
            res.status(201).json({
                message: "workout category saved in database",
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