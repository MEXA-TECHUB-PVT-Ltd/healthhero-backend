
const { array } = require("joi");
const { pool } = require("../../config/db.config");


exports.Addweek_goal = async (req, res) => {
    const client = await pool.connect();
    try {
        const user_id = req.body.user_id;
        const no_of_days = req.body.no_of_days;
        const created_at = req.body.created_at;

        if(!created_at || !user_id){
            return(
                res.json({
                    message: "user_id and created_at must be provided",
                    status : false
                })
            )
        }


        if (parseInt(no_of_days) > 7) {
            return (res.json({
                message: "no_of_days cannot be greater than 7",
                status: false
            }))
        }

        if (!user_id) {
            return (
                res.json({
                    message: "Must provide user_id",
                    status: false
                })
            )
        }

        const foundQuery = 'SELECT * FROM week_goals WHERE user_id = $1 AND no_of_days = $2';
        const foundResult = await pool.query(foundQuery, [user_id, no_of_days]);

        if (foundResult) {
            if (foundResult.rowCount > 0) {
                return (
                    res.json({
                        message: "week goals for user already added , Now user can only update it",
                        status: false
                    })
                )
            }
        }

        const query = 'INSERT INTO week_goals (user_id , no_of_days , created_at) VALUES ($1 , $2 , $3) RETURNING*'
        const result = await pool.query(query,
            [
                user_id ? user_id : null,
                no_of_days ? no_of_days : null,
                created_at ? created_at : null
            ]);



        if (result.rows[0]) {
            res.status(201).json({
                message: "Week Goal saved in database",
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
exports.updateUserWeekGoals = async (req, res) => {
    const client = await pool.connect();
    try {
        const user_id = req.body.user_id;
        const no_of_days = req.body.no_of_days;



        if (parseInt(no_of_days) > 7) {
            return (res.json({
                message: "no_of_days cannot be greater than 7",
                status: false
            }))
        }


        if (!user_id) {
            return (
                res.json({
                    message: "Please provide user_id ",
                    status: false
                })
            )
        }



        let query = 'UPDATE week_goals SET ';
        let index = 2;
        let values = [user_id];


        if (no_of_days) {
            query += `no_of_days = $${index} , `;
            values.push(no_of_days)
            index++
        }


        query += 'WHERE user_id = $1 RETURNING*'
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

exports.getDaysOfTraining = async (req, res) => {
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

        const query = 'SELECT * FROM week_goals WHERE user_id = $1'
        const result = await pool.query(query, [user_id]);

        if (result.rowCount > 0) {
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
exports.setFirstDayOfWeek = async (req, res) => {
    const client = await pool.connect();
    try {
        const user_id = req.body.user_id;
        const day = req.body.day;


        if (parseInt(day) > 7) {
            return (res.json({
                message: "day cannot be greater than 7",
                status: false
            }))
        }

        if (!user_id) {
            return (
                res.json({
                    message: "Please provide user_id ",
                    status: false
                })
            )
        }

        let query = 'UPDATE week_goals SET ';
        let index = 2;
        let values = [user_id];


        if (day) {
            query += `first_day_of_week = $${index} , `;
            values.push(day)
            index++
        }


        query += 'WHERE user_id = $1 RETURNING*'
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
exports.updateFirstDayOfWeek = async (req, res) => {
    const client = await pool.connect();
    try {
        const user_id = req.body.user_id;
        const day = req.body.day;

        if (parseInt(day) > 7) {
            return (res.json({
                message: "day cannot be greater than 7",
                status: false
            }))
        }


        if (!user_id) {
            return (
                res.json({
                    message: "Please provide user_id ",
                    status: false
                })
            )
        }

        let query = 'UPDATE week_goals SET ';
        let index = 2;
        let values = [user_id];


        if (day) {
            query += `first_day_of_week = $${index} , `;
            values.push(day)
            index++
        }


        query += 'WHERE user_id = $1 RETURNING*'
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
exports.getFirstDayOfWeek = async (req, res) => {
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

        const query = 'SELECT * FROM week_goals WHERE user_id = $1'
        const result = await pool.query(query, [user_id]);

        if (result.rowCount > 0) {
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
exports.getProgressOfThisWeek = async (req, res) => {
    const client = await pool.connect();
    try {

        const user_id = req.query.user_id;
        let array = [];
        if (!user_id) {
            return (
                res.json({
                    message: "User id must be provided",
                    status: false
                })
            )
        }

        const datesOfWeek = getCurrentWeekDates();
        console.log(datesOfWeek);
        let day_01 ;
        let day_02;
        let day_03;
        let day_04;
        let day_05;
        let day_06;
        let day_07;
        for (let i = 1; i < datesOfWeek.length+1; i++) {
            const element = datesOfWeek[i];
            

            const query = `
            SELECT *
            FROM user_inActionWorkouts
            WHERE DATE(created_at) = $2::date
              AND user_id = $1;
          `;
          const result = await pool.query(query , [user_id,element])

          console.log(result.rows)

          if(result.rows[0]){
                    day = {
                        day: i,
                        exersise_done : true,
                        total_count : result.rows.length
                    }
                    array.push(day , i)
                
           }
           else{
                day = {
                    day : i,
                    exersise_done : false,
                    total_count : 0
                }     
                array.push(day , i)       
       }
            
        }
       

      

        if (datesOfWeek) {
            res.json({
                message: "Fetched",
                status: true,
                result: array
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

function getCurrentWeekDates() {
    const today = new Date();
    const currentDay = today.getDay(); // Get the current day of the week (0-6, where 0 is Sunday)
    const startOfWeek = new Date(today); // Create a new date object with the current date
    startOfWeek.setDate(today.getDate() - currentDay); // Set the date to the start of the week
  
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);
      weekDates.push(currentDate.toISOString().split('T')[0]); // Push the formatted date to the array
    }
  
    return weekDates;
  }