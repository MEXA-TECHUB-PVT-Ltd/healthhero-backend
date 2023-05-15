
const { pool } = require("../../config/db.config");
var moment = require('moment');


exports.addworkoutPlan = async (req, res) => {
    const client = await pool.connect();
    try {
        const category_id = req.body.category_id;
        const workout_title = req.body.workout_title;
        const description = req.body.description;
        const image = req.body.image;
        const focus_area = req.body.focus_area;
        const paid_status = req.body.paid_status;
        const level_of_workout = req.body.level_of_workout;
        const time = req.body.time;
        const calories_burnt = req.body.calories_burnt;



        if (!category_id) {
            return (
                res.json({
                    message: "Must provide category_id",
                    status: false
                })
            )
        }


        if (level_of_workout) {
            if (level_of_workout == 'beginner' || level_of_workout == 'advance' || level_of_workout == 'intermediate') {

            }
            else {
                return (
                    res.json({
                        message: "level of work must be one of these  [beginner , advance , intermediate",
                        status: false
                    })
                )
            }
        }
        const query = 'INSERT INTO workout_plans (category_id , workout_title , description , image ,focus_area , paid_status , level_of_workout , time , calories_burnt ) VALUES ($1 , $2 , $3 , $4 , $5 , $6 , $7 , $8 , $9) RETURNING*'
        const result = await pool.query(query,
            [
                category_id ? category_id : null,
                workout_title ? workout_title : null,
                description ? description : null,
                image ? image : null,
                focus_area ? focus_area : null,
                paid_status ? paid_status : null,
                level_of_workout ? level_of_workout : null,
                time ? time : null,
                calories_burnt ? calories_burnt : null


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
        const description = req.body.description;
        const image = req.body.image;
        const focus_area = req.body.focus_area;
        const paid_status = req.body.paid_status;
        const level_of_workout = req.body.level_of_workout;
        const time = req.body.time;
        const calories_burnt = req.body.calories_burnt;



        if (!workout_plan_id) {
            return (
                res.json({
                    message: "Please provide workout_plan_id ",
                    status: false
                })
            )
        }



        if (level_of_workout) {
            if (level_of_workout == 'beginner' || level_of_workout == 'advance' || level_of_workout == 'intermediate') {

            }
            else {
                return (
                    res.json({
                        message: "level of work must be one of these  [beginner , advance , intermediate",
                        status: false
                    })
                )
            }
        }

        let query = 'UPDATE workout_plans SET ';
        let index = 2;
        let values = [workout_plan_id];


        if (workout_title) {
            query += `workout_title = $${index} , `;
            values.push(workout_title)
            index++
        }
        if (description) {
            query += `description = $${index} , `;
            values.push(description)
            index++
        }
        if (image) {
            query += `image = $${index} , `;
            values.push(image)
            index++
        }
        if (focus_area) {
            query += `focus_area = $${index} , `;
            values.push(focus_area)
            index++
        }
        if (paid_status) {
            query += `paid_status = $${index} , `;
            values.push(paid_status)
            index++
        }
        if (level_of_workout) {
            query += `level_of_workout = $${index} , `;
            values.push(level_of_workout)
            index++
        }
        if (category_id) {
            query += `category_id = $${index} , `;
            values.push(category_id)
            index++
        }

        if (time) {
            query += `time = $${index} , `;
            values.push(time)
            index++
        }
        if (calories_burnt) {
            query += `calories_burnt = $${index} , `;
            values.push(calories_burnt)
            index++
        }

        query += 'WHERE workout_plan_id = $1 RETURNING*'
        query = query.replace(/,\s+WHERE/g, " WHERE");
        console.log(query);

        const result = await pool.query(query, values);

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

exports.deleteWorkoutPlan = async (req, res) => {
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
        const result = await pool.query(query, [workout_plan_id]);

        if (result.rowCount > 0) {
            res.status(200).json({
                message: "Deletion successfull",
                status: true,
                deletedRecord: result.rows[0]
            })
        }
        else {
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
            const query = `SELECT f.workout_plan_id, 
            row_to_json(c.*) AS  category_details,
            f.workout_title, 
            f.description,
            f.image,
            f.focus_area,
            f.paid_status,
            f.level_of_workout,
            f.time,
            f.calories_burnt,
            f.created_at, 
            f.updated_at
            FROM workout_plans f
            LEFT OUTER JOIN workout_categories c ON f.category_id = c.workout_category_id
            WHERE f.trash=$1
             GROUP BY f.workout_plan_id, c.workout_category_id;
            `
            result = await pool.query(query , [false]);

        }

        if (page && limit) {
            limit = parseInt(limit);
            let offset = (parseInt(page) - 1) * limit

            const query = `SELECT f.workout_plan_id, 
        row_to_json(c.*) AS  category_details,
        f.workout_title, 
        f.description,
        f.image,
        f.focus_area,
        f.paid_status,
        f.level_of_workout,
        f.time,
        f.calories_burnt,
        f.created_at, 
        f.updated_at
        FROM workout_plans f
        LEFT OUTER JOIN workout_categories c ON f.category_id = c.workout_category_id
        WHERE f.trash=$3
        GROUP BY f.workout_plan_id, c.workout_category_id LIMIT $1 OFFSET $2`
            result = await pool.query(query, [limit, offset , false]);
        }

        if (result.rows) {
            res.json({
                message: "Fetched",
                status: true,
                count: result.rows.length,
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

exports.getWorkoutPlanById = async (req, res) => {
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
        const result = await pool.query(query, [workout_plan_id]);


        const likesCountQuery = 'SELECT * FROM user_likes_workouts WHERE workout_plan_id = $1 ';
        const foundLikes = await pool.query(likesCountQuery, [workout_plan_id]);
        let likesCount;
        if (foundLikes) {
            likesCount = foundLikes.rowCount;
        };

        if (result.rowCount > 0) {
            res.json({
                message: "Fetched",
                status: true,
                total_likes: likesCount,
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
            const query = 'SELECT * FROM workout_plans WHERE level_of_workout=$1 AND trash=$2'
            result = await pool.query(query, ["intermediate" , false]);

        }

        if (page && limit) {
            limit = parseInt(limit);
            let offset = (parseInt(page) - 1) * limit

            const query = 'SELECT * FROM workout_plans WHERE level_of_workout=$3 AND trash=$4 LIMIT $1 OFFSET $2 '
            result = await pool.query(query, [limit, offset, "intermediate", false]);

        }

        if (result.rows) {
            res.json({
                message: "Fetched",
                status: true,
                count: result.rows.length,
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
            const query = 'SELECT * FROM workout_plans  WHERE level_of_workout=$1  AND trash=$2'
            result = await pool.query(query, ["beginner" , false]);

        }

        if (page && limit) {
            limit = parseInt(limit);
            let offset = (parseInt(page) - 1) * limit

            const query = 'SELECT * FROM workout_plans workout_plans  WHERE level_of_workout=$3 AND trash=$4 LIMIT $1 OFFSET $2'
            result = await pool.query(query, [limit, offset, 'beginner', false]);

        }

        if (result.rows) {
            res.json({
                message: "Fetched",
                status: true,
                count: result.rows.length,
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
            const query = 'SELECT * FROM workout_plans workout_plans  WHERE level_of_workout=$1 AND trash=$2'
            result = await pool.query(query, ["advance" , false]);

        }

        if (page && limit) {
            limit = parseInt(limit);
            let offset = (parseInt(page) - 1) * limit

            const query = 'SELECT * FROM workout_plans workout_plans  WHERE level_of_workout=$3 AND trash=$4 LIMIT $1 OFFSET $2'
            result = await pool.query(query, [limit, offset, 'advance' , false]);

        }

        if (result.rows) {
            res.json({
                message: "Fetched",
                status: true,
                count: result.rows.length,
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
        if (!category_id) {
            return (
                res.json({
                    message: "Please must provide category_id",
                    status: false
                })
            )
        }


        let limit = req.query.limit;
        let page = req.query.page

        let result;

        if (!page || !limit) {
            const query = 'SELECT * FROM workout_plans WHERE category_id= $1'
            result = await pool.query(query, [category_id]);

        }

        if (page && limit) {
            limit = parseInt(limit);
            let offset = (parseInt(page) - 1) * limit

            const query = 'SELECT * FROM workout_plans WHERE category_id= $3 LIMIT $1 OFFSET $2'
            result = await pool.query(query, [limit, offset, category_id]);

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

        if (!user_id || !workout_plan_id) {
            return (
                res.json({
                    message: "user_id and workout_plan_id must be provided",
                    status: false
                })
            )
        }

        const foundQuery = 'SELECT * FROM user_likes_workouts WHERE user_id = $1 AND workout_plan_id = $2';
        const foundResult = await pool.query(foundQuery, [user_id, workout_plan_id]);

        if (foundResult.rows[0]) {
            return (
                res.json({
                    message: "User Has already like this plan",
                    status: false
                })
            )
        }

        const query = 'INSERT INTO user_likes_workouts (user_id , workout_plan_id) VALUES ($1 , $2) RETURNING*';
        const result = await pool.query(query, [user_id, workout_plan_id]);

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

        if (!user_id || !workout_plan_id) {
            return (
                res.json({
                    message: "user_id and workout_plan_id must be provided",
                    status: false
                })
            )
        }

        const query = 'DELETE FROM user_likes_workouts WHERE user_id = $1 AND workout_plan_id = $2 RETURNING*';
        const result = await pool.query(query, [user_id, workout_plan_id]);

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

        if (!user_id || !workout_plan_id) {
            return (
                res.json({
                    message: "user_id and workout_plan_id must be provided",
                    status: false
                })
            )
        }

        const query = 'SELECT * FROM user_likes_workouts WHERE user_id = $1 AND workout_plan_id = $2';
        const result = await pool.query(query, [user_id, workout_plan_id]);

        if (result.rows[0]) {
            res.json({
                message: "Fethced",
                liked_the_plan: true,
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

        if (!user_id || !workout_plan_id) {
            return (
                res.json({
                    message: "user_id and workout_plan_id must be provided",
                    status: false
                })
            )
        }


        const foundQuery = 'SELECT * FROM user_inActionWorkouts WHERE user_id = $1 AND workout_plan_id = $2';
        const foundResult = await pool.query(foundQuery, [user_id, workout_plan_id]);

        if (foundResult.rowCount > 0) {
            return (
                res.json({
                    message: "This User already started this workout",
                    status: false
                })
            )
        }

        const query = 'INSERT INTO user_inActionWorkouts (user_id , workout_plan_id , status) VALUES ($1 , $2 , $3) RETURNING*';
        const result = await pool.query(query, [user_id, workout_plan_id, "inprogress"]);

        if (result.rows[0]) {
            res.json({
                message: "User Started this workout",
                status: true,
                result: result.rows[0]
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

        if (!user_inaction_workout_id) {
            return (
                res.json({
                    message: " user_inaction_workout_id must be provided",
                    status: false
                })
            )
        }


        const query = 'UPDATE user_inActionWorkouts SET status = $1 WHERE user_inaction_workout_id = $2 RETURNING*';
        const result = await pool.query(query, ["completed", user_inaction_workout_id]);

        if (result.rows[0]) {
            res.json({
                message: "Updated Staus to completed",
                status: true,
                result: result.rows[0]
            })
        }
        else {
            res.json({
                message: "Could not Update",
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

exports.workoutsPlanCompletedByUser = async (req, res) => {
    const client = await pool.connect();
    try {
        const user_id = req.query.user_id;

        let limit = req.query.limit;
        let page = req.query.page

        let result;

        if (!page || !limit) {
            const query = 'SELECT * FROM user_inActionWorkouts WHERE user_id = $1 AND status = $2'
            result = await pool.query(query, [user_id, 'completed']);

        }

        if (page && limit) {
            limit = parseInt(limit);
            let offset = (parseInt(page) - 1) * limit

            const query = 'SELECT * FROM user_inActionWorkouts WHERE user_id = $1 AND status = $2  LIMIT $3 OFFSET $4'
            result = await pool.query(query, [user_id, "completed", limit, offset]);
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

exports.addExersiseToPlan = async (req, res) => {
    const client = await pool.connect();
    try {
        const workout_plan_id = req.body.workout_plan_id;
        let array = req.body.array;

        let resultArray = [];;

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
                message: "Exersises saved in database",
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

exports.getAllExersisesOfWorkoutPlan = async (req, res) => {
    const client = await pool.connect();
    try {

        let limit = req.query.limit;
        let page = req.query.page
        const workout_plan_id = req.query.workout_plan_id;

        if (!workout_plan_id) {
            return (
                res.json({
                    message: "Workout plan id must be provided",
                    status: false
                })
            )
        }

        const foundQuery = 'SELECT * FROM workout_plans WHERE workout_plan_id = $1';
        const foundResult = await pool.query(foundQuery, [workout_plan_id]);

        let workout_out_plan_details = null;
        if (foundResult.rows[0]) {
            workout_out_plan_details = foundResult.rows[0]
        }




        let result;

        if (!page || !limit) {
            const query = `SELECT 
            workout_plan_exersises.workout_plan_exersise_id, 
            workout_plan_exersises.exersise_id, 
            workout_plan_exersises.workout_plan_id, 
            workout_plan_exersises.reps, 
            workout_plan_exersises.time, 
            workout_plan_exersises.created_at, 
            workout_plan_exersises.updated_at
          FROM 
            workout_plan_exersises 
            JOIN exersises ON workout_plan_exersises.exersise_id = exersises.exersise_id 
          WHERE 
            workout_plan_exersises.workout_plan_id =$1;
            `
            result = await pool.query(query, [workout_plan_id]);

        }

        if (page && limit) {
            limit = parseInt(limit);
            let offset = (parseInt(page) - 1) * limit

            const query = `SELECT 
        workout_plan_exersises.workout_plan_exersise_id, 
        workout_plan_exersises.exersise_id, 
        exersises.name AS exersise_name, 
        workout_plan_exersises.workout_plan_id, 
        workout_plan_exersises.reps, 
        workout_plan_exersises.time, 
        workout_plan_exersises.created_at, 
        workout_plan_exersises.updated_at
      FROM 
        workout_plan_exersises 
        JOIN exersises ON workout_plan_exersises.exersise_id = exersises.exersise_id 
      WHERE 
        workout_plan_exersises.workout_plan_id =$1 LIMIT $1 OFFSET $2`
            result = await pool.query(query, [limit, offset]);
        }

        if (result.rows) {
            res.json({
                message: "Fetched",
                status: true,
                result: {
                    count: result.rows.length,
                    workout_plan_details: workout_out_plan_details,
                    exersises: result.rows
                }
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


exports.deleteAllExersisesOfWorkoutPlan = async (req, res) => {
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

        const query = 'DELETE FROM workout_plan_exersises WHERE workout_plan_id = $1 RETURNING *';
        const result = await pool.query(query, [workout_plan_id]);

        if (result.rowCount > 0) {
            res.status(200).json({
                message: "Deletion successfull",
                status: true,
                deletedRecords: result.rows
            })
        }
        else {
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

exports.getWeeklyReportOfUser = async (req, res) => {
    const client = await pool.connect();

    try {
        const user_id = req.query.user_id;
        let date = req.query.date;


        date = new Date(date);

        const dayNoQuery= 'SELECT * FROM week_goals WHERE user_id = $1';
        const day_no_result = await pool.query(dayNoQuery , [user_id]);

        let day_no;

        if(day_no_result.rows[0]){
            if(day_no_result.rows[0].first_day_of_week){
                day_no = day_no_result.rows[0].first_day_of_week;
            }else{
                return(
                    res.json({
                        message: "first day of week is not set by user",
                        status :false
                    })
                )
            }
        }
        else{
            return(
                res.json({
                    message: "Week Goal is not set by user",
                    status :false
                })
            )
        }



        let startDate = getStartDateOfWeek(date, day_no);
        const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);

        console.log(`Start date of the week: ${startDate}`);
        console.log(`End date of the week: ${endDate}`);

        let current_date = new Date(Date.now());

        startDate = moment(startDate).format('YYYY-MM-DD');

        current_date = moment(current_date).format('YYYY-MM-DD')

        console.log(startDate);
        console.log(current_date)



        const query = `SELECT 
        DATE_TRUNC('week', date_trunc('day', uiw.created_at)) AS week_start_date,
        DATE_TRUNC('week', date_trunc('day', uiw.created_at)) + INTERVAL '6 days' AS week_end_date,
        array_agg(json_build_object(
            'user_inAction_workout_id', uiw.user_inAction_workout_id,
            'user_id', uiw.user_id,
            'workout_plan', COALESCE(
                (
                    SELECT  json_build_object(
                        'workout_plan_id' , wp.workout_plan_id,
                        'category_id' , wp.category_id,
                        'workout_title' , wp.workout_title,
                        'description' , wp.description,
                        'image' , wp.image,
                        'focus_area' , wp.focus_area,
                        'paid_status' , wp.paid_status,
                        'level_of_workout' , wp.level_of_workout,
                        'time' , wp.time ,
                        'calories_burnt' , wp.calories_burnt,
                        'added_by', 'admin',
                        'created_at' , wp.created_at,
                        'updated_at' , wp.updated_at,
                        'workout_plan_exercises' , (
                            SELECT json_agg(
                                json_build_object(
                                    'exersise_id', e.exersise_id,
                                     'title', e.title,
                                    'description', e.description,
                                    'animation', e.animation,
                                    'video_link', e.video_link,
                                    'created_at', e.created_at
                                )
                            )
                            FROM exersises e
                            JOIN workout_plan_exersises wpe ON e.exersise_id = wpe.exersise_id
                            WHERE wpe.workout_plan_id = wp.workout_plan_id
                        )
                    ) 
                    FROM workout_plans wp 
                    WHERE wp.workout_plan_id = uiw.workout_plan_id
                ),
                (
                    SELECT  json_build_object(
                        'workout_plan_id' , up.workout_plan_id,
                        'plan_name' , up.plan_name,
                        'description' , up.description,
                        'workout_plan_exercises', (
                            SELECT json_agg(
                                         json_build_object(
                                             'exersise_id', e.exersise_id,
                                             'title', e.title,
                                             'description', e.description,
                                             'animation', e.animation,
                                             'video_link', e.video_link,
                                             'created_at', e.created_at
                                         )
                                     )
                            FROM exersises e
                            WHERE e.exersise_id = ANY(up.exersise_ids)
                        ),
                        'status' , up.status,
                        'added_by' , 'user',
                        'created_at' , up.created_at,
                        'updated_at' , up.updated_at
                    ) 
                    FROM user_plans up 
                    WHERE up.workout_plan_id = uiw.workout_plan_id
                )
            ),
            'status', uiw.status,
            'completed_at', uiw.completed_at,
            'created_at', uiw.created_at,
            'updated_at', uiw.updated_at
        )) AS records
    FROM 
        user_inActionWorkouts uiw
    WHERE 
        uiw.created_at BETWEEN $1 AND $2
        AND uiw.user_id = $3
    GROUP BY 
        DATE_TRUNC('week', date_trunc('day', uiw.created_at))
    ORDER BY 
        week_start_date;
    `;




        current_date = new Date(current_date);
        current_date.setDate(current_date.getDate() + 1)
        console.log(startDate);
        console.log(current_date)

        const result = await pool.query(query, [startDate, current_date, user_id])



let totalTime = 0
let totalCaloriesBurnt = 0
let records;
let formatted_time;
if(result.rows){
    records = result.rows
}
let count =0

for (let i = 0; i < records.length; i++) {
    const record = records[i].records;

    if(record){
        for (let j = 0; j < record.length; j++) {
            const element = record[j];
            console.log(element.workout_plan)
        if (element.workout_plan) {
    
            const { time, calories_burnt } = element.workout_plan;
            console.log(time);
            console.log(calories_burnt)
           
            if (time) {
                console.log(time)
              const [hours, minutes, seconds] = time.split(':').map(Number)
              totalTime += hours * 3600 + minutes * 60 + seconds;
               formatted_time = new Date(totalTime * 1000).toISOString().slice(11, 19);
              console.log(formatted_time); // 👉️ "00:10:00" (hh:mm:ss)
             
            }
            if (calories_burnt) {
              totalCaloriesBurnt += calories_burnt
            }
            count++;
          }
            
        }   
    }

    

}
console.log(count)



console.log(`Total time: ${formatted_time}`)
console.log(`Total calories burnt: ${totalCaloriesBurnt}`)


        if (result.rows) {
            res.json({
                message: "Fetched",
                status: true,
                totalCaloriesBurnt : totalCaloriesBurnt,
                totalTime : formatted_time,
                result: result.rows,
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

exports.searchWorkoutPlan= async (req, res) => {
    const client = await pool.connect();
    try {
        let name = req.query.name;

        if(!name){
            return(
                res.json({
                    message: "name must be provided",
                    status : false
                })
            )
        }

        const query = `SELECT * FROM workout_plans WHERE workout_title ILIKE $1`;
        let result = await pool.query(query , [name.concat("%")]);

        if(result.rows){
            result = result.rows
        }
       
        if (result) {
            res.json({
                message: "Fetched",
                status: true,
                result : result
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

//trash 

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

        const query = 'UPDATE workout_plans SET trash=$2 WHERE workout_plan_id = $1 RETURNING *';
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

        const query = 'UPDATE workout_plans SET trash=$2 WHERE workout_plan_id = $1 RETURNING *';
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

        const query = 'SELECT * FROM workout_plans WHERE trash = $1';
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


function getStartDateOfWeek(date, day_no) {
    // Get the day of the week for the specified date (0 = Sunday, 1 = Monday, etc.)
    const dayOfWeek = date.getDay();

    // Calculate the difference between the specified day number and the current day of the week
    const diff = day_no - dayOfWeek;

    // If the difference is negative, add 7 to get the number of days until the next specified day of the week
    const daysUntilNextDayNo = diff < 0 ? diff + 7 : diff;

    // Add the number of days until the next specified day of the week to the current date to get the start date of the week
    const startDate = new Date(date.getTime() + daysUntilNextDayNo * 24 * 60 * 60 * 1000);

    return startDate;
}

// take user first workout date , like first ever time he started . 
// get user first day of week . so like if user has set 3 means wednesday , Then get all weeks of the user . 
// get all user data of by weeks . 




//in my plans , add added_by , added_by_id ,
// get all workoutplans added by user