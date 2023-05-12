
const {pool} = require("../../config/db.config");


exports.Addweek_goal = async (req, res) => {
    const client = await pool.connect();
    try {
        const user_id = req.body.user_id;
        const no_of_days = req.body.no_of_days;
   

        if(parseInt(no_of_days)>7){
            return(res.json({
                message: "no_of_days cannot be greater than 7",
                status : false
            }))
        }

        if(!user_id){
            return(
                res.json({
                    message: "Must provide user_id",
                    status : false
                })
            )
        }

          const foundQuery = 'SELECT * FROM week_goals WHERE user_id = $1 AND no_of_days = $2';
          const foundResult = await pool.query(foundQuery , [user_id , no_of_days]);

          if(foundResult){
            if(foundResult.rowCount>0){
                return(
                    res.json({
                        message: "week goals for user already added , Now user can only update it",
                        status :false
                    })
                )
            }
          }
       
        const query = 'INSERT INTO week_goals (user_id , no_of_days) VALUES ($1 , $2) RETURNING*'
        const result = await pool.query(query , 
            [
                user_id ? user_id : null,
                no_of_days ? no_of_days : null,
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



        if(parseInt(no_of_days)>7){
            return(res.json({
                message: "no_of_days cannot be greater than 7",
                status : false
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
        let values =[user_id];

        
        if(no_of_days){
            query+= `no_of_days = $${index} , `;
            values.push(no_of_days)
            index ++
        }
      

        query += 'WHERE user_id = $1 RETURNING*'
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

exports.getDaysOfTraining= async (req, res) => {
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
        const result = await pool.query(query , [user_id]);

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

exports.setFirstDayOfWeek = async (req, res) => {
    const client = await pool.connect();
    try {
        const user_id = req.body.user_id;
        const day = req.body.day;


        if(parseInt(day)>7){
            return(res.json({
                message: "day cannot be greater than 7",
                status : false
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
        let values =[user_id];

        
        if(day){
            query+= `first_day_of_week = $${index} , `;
            values.push(day)
            index ++
        }
      

        query += 'WHERE user_id = $1 RETURNING*'
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

exports.updateFirstDayOfWeek = async (req, res) => {
    const client = await pool.connect();
    try {
        const user_id = req.body.user_id;
        const day = req.body.day;

        if(parseInt(day)>7){
            return(res.json({
                message: "day cannot be greater than 7",
                status : false
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
        let values =[user_id];

        
        if(day){
            query+= `first_day_of_week = $${index} , `;
            values.push(day)
            index ++
        }
      

        query += 'WHERE user_id = $1 RETURNING*'
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

exports.getFirstDayOfWeek= async (req, res) => {
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
        const result = await pool.query(query , [user_id]);

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


