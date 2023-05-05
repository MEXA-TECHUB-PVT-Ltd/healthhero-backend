const {pool} = require("../../config/db.config");


exports.create_reminder = async (req, res) => {
    const client = await pool.connect();
    try {
        const user_id = req.body.user_id;
        const time = req.body.time;
        const days = req.body.days;



        const query = 'INSERT INTO reminder (user_id ,time,days) VALUES ($1 , $2 , $3) RETURNING*'
        const result = await pool.query(query , 
            [
                user_id ? user_id : null,
                time ? time : null,
                days ?days : null,
         
              
            ]);


            
        if (result.rows[0]) {
            res.status(201).json({
                message: "Reminder saved in database",
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
exports.update_reminder = async (req, res) => {
    const client = await pool.connect();
    try {

        const reminder_id = req.body.reminder_id;
        const time = req.body.time;
        const days = req.body.days;
        const user_id = req.body.user_id;

      

        if (!reminder_id) {
            return (
                res.json({
                    message: "Please provide reminder_id ",
                    status: false
                })
            )
        }


    
        let query = 'UPDATE reminder SET ';
        let index = 2;
        let values =[reminder_id];

        
        if(time){
            query+= `time = $${index} , `;
            values.push(time)
            index ++
        }
      
        if(days){
            query+= `days = $${index} , `;
            values.push(days)
            index ++
        }
      
        if(user_id){
            query+= `user_id = $${index} , `;
            values.push(user_id)
            index ++
        }
      

        query += 'WHERE reminder_id = $1 RETURNING*'
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

exports.get_reminder= async (req, res) => {
    const client = await pool.connect();
    try {
        const reminder_id = req.query.reminder_id;
       
        if (!reminder_id) {
            return (
                res.json({
                    message: "Please provide reminder_id ",
                    status: false
                })
            )
        }

        const query = 'SELECT * FROM reminder WHERE reminder_id = $1'
        const result = await pool.query(query , [reminder_id]);

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

exports.getAllUserReminders = async (req, res) => {
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
            const query = 'SELECT * FROM reminder WHERE user_id = $1'
            result = await pool.query(query , [user_id]);
           
        }

        if(page && limit){
            limit = parseInt(limit);
            let offset= (parseInt(page)-1)* limit

        const query = 'SELECT * FROM reminder WHERE user_id = $3 LIMIT $1 OFFSET $2'
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
exports.deleteReminder = async (req, res) => {
    const client = await pool.connect();
    try {
        const reminder_id = req.query.reminder_id;
        if (!reminder_id) {
            return (
                res.json({
                    message: "Please provide reminder_id ",
                    status: false
                })
            )
        }

        const query = 'DELETE FROM reminder WHERE reminder_id = $1 RETURNING *';
        const result = await pool.query(query , [reminder_id]);

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
