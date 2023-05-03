
const {pool} = require("../../config/db.config");
const { use } = require("../../routes/Users/userRoute");


exports.create_my_plan = async (req, res) => {
    const client = await pool.connect();
    try {
        const user_id = req.body.user_id;
        const plan_name = req.body.plan_name;
        const description = req.body.description;
        const exersise_ids = req.body.exersise_ids;



        const query = 'INSERT INTO user_plans (user_id ,plan_name,description, exersise_ids) VALUES ($1 , $2 , $3 , $4) RETURNING*'
        const result = await pool.query(query , 
            [
                user_id ? user_id : null,
                plan_name ? plan_name : null,
                description ?description : null,
                exersise_ids ? exersise_ids : null
              
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

        const user_plan_id = req.body.user_plan_id;
        const user_id = req.body.user_id;
        const plan_name = req.body.plan_name;
        const description = req.body.description;



        if (!user_plan_id) {
            return (
                res.json({
                    message: "Please provide user_plan_id ",
                    status: false
                })
            )
        }


    
        let query = 'UPDATE user_plans SET ';
        let index = 2;
        let values =[user_plan_id];

        
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

        query += 'WHERE user_plan_id = $1 RETURNING*'
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

    
        let query = 'UPDATE user_plans SET exersise_ids = ARRAY_APPEND(exersise_ids , $3) WHERE user_id = $1 AND user_plan_id = $2 RETURNING*';
        let values =[user_id , plan_id , exersise_id ];

       const result = await pool.query(query , values);

        if (result.rows[0]) {
            res.json({
                message: "Appended exersise ids into previous",
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

    
        let query = 'UPDATE user_plans SET exersise_ids = ARRAY_REMOVE(exersise_ids , $3) WHERE user_id = $1 AND user_plan_id = $2 RETURNING *';
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

        const query = 'SELECT * FROM user_plans WHERE user_id = $1 AND user_plan_id = $2';
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
            const query = 'SELECT * FROM user_plans WHERE user_id = $1'
            result = await pool.query(query , [user_id]);
           
        }

        if(page && limit){
            limit = parseInt(limit);
            let offset= (parseInt(page)-1)* limit

        const query = 'SELECT * FROM user_plans WHERE user_id = $3 LIMIT $1 OFFSET $2'
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
