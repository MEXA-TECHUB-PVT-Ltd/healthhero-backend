const {pool} = require("../../config/db.config");


exports.addRestTime = async (req, res) => {
    const client = await pool.connect();
    try {
        const user_id = req.body.user_id;
        const time = req.body.time ;

        if(!user_id || !time){
            return(
                res.json({
                    message: "user_id and time must be provided",
                    status : false
                })
            )
        }

        let query;
        let result ;

        const foundQuery = 'SELECT * FROM rest_times WHERE user_id = $1'
        const foundResult = await pool.query(foundQuery , [user_id ]);

        if(foundResult.rows[0]){
            query = 'Update rest_times SET time=$1 WHERE user_id = $2 RETURNING*';
            result = await pool.query(query  , [time , user_id])
        }

        query = 'INSERT INTO rest_times (user_id , time) VALUES ($1 , $2) RETURNING*'
         result = await pool.query(query , 
            [
                user_id ? user_id : null,
                time ? time : null
              
            ]);

        if (result.rows[0]) {
            res.status(201).json({
                message: "rest time saved in database",
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


exports.getRestTimeOfUser= async (req, res) => {
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
        const query = 'SELECT * FROM rest_times WHERE user_id = $1'
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

exports.deleteRestTime = async (req, res) => {
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

        const query = 'DELETE FROM rest_times WHERE user_id = $1 RETURNING *';
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
