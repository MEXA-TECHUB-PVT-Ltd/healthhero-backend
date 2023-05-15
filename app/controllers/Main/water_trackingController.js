
const {pool} = require("../../config/db.config");
const { use } = require("../../routes/Main/workoutPlanRoute");


exports.add_water_tracker = async (req, res) => {
    const client = await pool.connect();
    try {
        const user_id = req.body.user_id;
        const measure = req.body.measure;
        const measuring_unit = req.body.measuring_unit ;
        const quantity = req.body.quantity;




        if(!user_id){
            return(
                res.json({
                    message: "Must provide user_id",
                    status : false
                })
            )
        }

          
        if(measure){
            if(measure == 'glass' || measure == 'bottle'){

            }
            else{
                return(
                    res.json({
                        message : "measure must be one of these  [bottle , glass]",
                        status : false
                    })
                )
            }
        }



        const foundQuery = 'SELECT * FROM water_tracker WHERE user_id = $1';
        const foundResult = await pool.query(foundQuery , [user_id]);

        if(foundResult.rowCount>0){
            return(res.json({
                message :"Water tracker already added for You , You can update it with update option",
                status : false
            }))
        }


        const query = 'INSERT INTO water_tracker ( user_id , measure , measuring_unit ,quantity ) VALUES ($1 , $2 , $3 , $4) RETURNING*'
        const result = await pool.query(query , 
            [
                user_id ? user_id : null,
                measure ? measure : null,
                measuring_unit ? measuring_unit : null,
                quantity ? quantity : null,
  
              
            ]);


            
        if (result.rows[0]) {
            res.status(201).json({
                message: "water tracker saved in database For this user",
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
            error: err.message
        })
    }
    finally {
        client.release();
      }

}
exports.update_water_tracker = async (req, res) => {
    const client = await pool.connect();
    try {
        const water_tracker_id = req.body.water_tracker_id;
        const user_id = req.body.user_id;
        const measure = req.body.measure;
        const measuring_unit = req.body.measuring_unit ;
        const quantity = req.body.quantity;





        if (!water_tracker_id) {
            return (
                res.json({
                    message: "Please provide water_tracker_id ",
                    status: false
                })
            )
        }


        if(measure){
            if(measure == 'glass' || measure == 'bottle'){

            }
            else{
                return(
                    res.json({
                        message : "measure must be one of these  [bottle , glass]",
                        status : false
                    })
                )
            }
        }

        let query = 'UPDATE water_tracker SET ';
        let index = 2;
        let values =[water_tracker_id];

        
        if(user_id){
            query+= `user_id = $${index} , `;
            values.push(user_id)
            index ++
        }
        if(measure){
            query+= `measure = $${index} , `;
            values.push(measure)
            index ++
        }
        if(measuring_unit){
            query+= `measuring_unit = $${index} , `;
            values.push(measuring_unit)
            index ++
        }
        if(quantity){
            query+= `quantity = $${index} , `;
            values.push(quantity)
            index ++
        }
  

        query += 'WHERE water_tracker_id = $1 RETURNING*'
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
exports.deleteWater_tracker= async (req, res) => {
    const client = await pool.connect();
    try {
        const water_tracker_id = req.query.water_tracker_id;
        const user_id = req.query.user_id;

        if (!water_tracker_id || !user_id) {
            return (
                res.json({
                    message: "Please provide water_tracking_id , user_id ",
                    status: false
                })
            )
        }

        const query = 'DELETE FROM water_tracker WHERE water_tracker_id = $1 AND user_id = $2 RETURNING *';
        const result = await pool.query(query , [water_tracker_id , user_id]);

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


exports.add_record_water_tracker = async (req, res) => {
    const client = await pool.connect();
    try {
        const user_id = req.body.user_id;
        const water_tracker_id = req.body.water_tracker_id ;
        const quantity = req.body.quantity;
        let result;
        let query;




        if(!user_id || !water_tracker_id){
            return(
                res.json({
                    message: "Must provide user_id and water_tracker_id",
                    status : false
                })
            )
        }

        const foundQuery = 'SELECT * FROM water_tracker_records WHERE user_id = $1 AND water_tracker_id = $2 AND DATE(created_at) = CURRENT_DATE;';
        const foundResult = await pool.query(foundQuery , [user_id , water_tracker_id]);

        if(foundResult.rowCount>0){
            console.log('updated')
            query =   `UPDATE water_tracker_records SET quantity = $1 WHERE user_id = $2 AND water_tracker_id = $3 RETURNING*`;
            result = await pool.query(query , [quantity , user_id , water_tracker_id])
        }
        else{
            query = 'INSERT INTO water_tracker_records ( user_id , water_tracker_id ,quantity ) VALUES ($1 , $2 , $3) RETURNING*'
            result = await pool.query(query , 
               [
                   user_id ? user_id : null,
                   water_tracker_id ? water_tracker_id : null,
                   quantity ? quantity : null,
               ]);
        }


            
        if (result.rows[0]) {
            res.status(201).json({
                message: "Record Added , If record For this user and water_tracker added previously then it is updated now",
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
            error: err.message
        })
    }
    finally {
        client.release();
      }

}

exports.deleteWater_tracker_record= async (req, res) => {
    const client = await pool.connect();
    try {
        const water_tracker_record_id = req.query.water_tracker_record_id;

        if(!water_tracker_record_id){
            return(
                res.json({
                    message: "Must provide user_id and water_tracker_record_id",
                    status : false
                })
            )
        }

        const query = 'DELETE FROM water_tracker_records WHERE water_tracker_record_id = $1 RETURNING *';
        const result = await pool.query(query , [water_tracker_record_id]);

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
exports.get_daily_tracking= async (req, res) => {
    const client = await pool.connect();
    try {
        const water_tracker_id = req.query.water_tracker_id;
        const user_id = req.query.user_id;

        
        if(!user_id || !water_tracker_id){
            return(
                res.json({
                    message: "Must provide user_id and water_tracker_id",
                    status : false
                })
            )
        }

        const query = `SELECT json_build_object(
            'water_tracker_record_id', wtr.water_tracker_record_id,
            'user_id', wtr.user_id,
            'quantity', wtr.quantity,
            'created_at', wtr.created_at,
            'updated_at', wtr.updated_at,
            'water_tracker', json_build_object(
                'water_tracker_id', wt.water_tracker_id,
                'user_id', wt.user_id,
                'measure', wt.measure,
                'measuring_unit', wt.measuring_unit,
                'quantity', wt.quantity,
                'created_at', wt.created_at,
                'updated_at', wt.updated_at
            )
        )
        FROM water_tracker_records wtr
        JOIN water_tracker wt ON wtr.water_tracker_id = wt.water_tracker_id
          WHERE wtr.water_tracker_id = $1 AND wtr.user_id = $2 AND DATE(wtr.created_at) = CURRENT_DATE;`
        const result = await pool.query(query , [water_tracker_id , user_id ]);

        if (result.rowCount>0) {
            res.json({
                message: "Fetched",
                status: true,
                result: result.rows[0].json_build_object
            })
        }
        else {
            res.json({
                message: "No any daily intake water record is added for today",
                result: null,
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

exports.get_weekly_history= async (req, res) => {
    const client = await pool.connect();
    try {
        const water_tracker_id = req.query.water_tracker_id;
        const user_id = req.query.user_id;

        
        if(!user_id || !water_tracker_id){
            return(
                res.json({
                    message: "Must provide user_id and water_tracker_id",
                    status : false
                })
            )
        }

        const query = `SELECT json_build_object(
            'water_tracker_record_id', wtr.water_tracker_record_id,
            'user_id', wtr.user_id,
            'quantity', wtr.quantity,
            'created_at', wtr.created_at,
            'updated_at', wtr.updated_at,
            'water_tracker', json_build_object(
                'water_tracker_id', wt.water_tracker_id,
                'user_id', wt.user_id,
                'measure', wt.measure,
                'measuring_unit', wt.measuring_unit,
                'quantity', wt.quantity,
                'created_at', wt.created_at,
                'updated_at', wt.updated_at
            )
        )
        FROM water_tracker_records wtr
        JOIN water_tracker wt ON wtr.water_tracker_id = wt.water_tracker_id
        WHERE wtr.water_tracker_id = $1 AND  wtr.user_id = $2 AND DATE_TRUNC('week', wtr.created_at) = DATE_TRUNC('week', CURRENT_DATE);
        `
        const result = await pool.query(query , [water_tracker_id , user_id ]);

        if (result.rowCount>0) {
            res.json({
                message: "Fetched",
                status: true,
                result: result.rows
            })
        }
        else {
            res.json({
                message: "No any water record is added for this tracker id ever.",
                result: null,
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
        const water_tracker_id = req.query.water_tracker_id;
        if (!water_tracker_id) {
            return (
                res.status(400).json({
                    message: "Please Provide water_tracker_id",
                    status: false
                })
            )
        }

        const query = 'UPDATE water_tracker SET trash=$2 WHERE water_tracker_id = $1 RETURNING *';
        const result = await pool.query(query , [water_tracker_id , true]);

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
        const water_tracker_id = req.query.water_tracker_id;
        if (!water_tracker_id) {
            return (
                res.status(400).json({
                    message: "Please Provide water_tracker_id",
                    status: false
                })
            )
        }
        const query = 'UPDATE water_tracker SET trash=$2 WHERE water_tracker_id = $1 RETURNING *';
        const result = await pool.query(query , [water_tracker_id , false]);

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

        const query = 'SELECT * FROM water_tracker WHERE trash = $1';
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
