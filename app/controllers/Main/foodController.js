const {pool} = require("../../config/db.config");
const fitness_calculator = require("fitness-calculator");
const { use } = require("../../routes/Main/FoodRoute");

exports.addFood = async (req, res) => {
    const client = await pool.connect();
    try {
        const added_by = req.body.added_by ;
        let added_by_id = req.body.added_by_id;
        const food_name = req.body.food_name;
        const energy_calories = req.body.energy_calories;
        const measure  = req.body.measure;
        const units  = req.body.units;
        const protein = req.body.protein;
        const carbs = req.body.carbs;
        const fats = req.body.fats;
        const monosaturated_fats = req.body.monosaturated_fats;
        const saturated_fats = req.body.saturated_fats ;
        const suger = req.body.suger;
        const fiber = req.body.fiber;
        const sodium = req.body.sodium;
        const calcium = req.body.calcium ;
        const iron = req.body.iron;
        const vitamin_A = req.body.vitamin_A;
        const vitamin_b = req.body.vitamin_b;
        const vitamin_c = req.body.vitamin_c ;
        const cholestrol = req.body.cholestrol ;


        
        

        if(!added_by || !food_name || !energy_calories || !measure || !units || ! protein || !carbs || !fats){
            return(
                res.json({
                    message: "added_by , added_by_id , food_name ,energy_calories ,measure , units , protein , carbs , fats must be provided" ,
                    status : false
                })
            )
        }

        
        if(added_by == 'admin' || added_by == 'user'){
        }else{
            return(res.json({
                message: "added_by must be admin or user",
                status :false
            }))
        }

        if(measure == 'gram' || measure == 'cup' || measure == 'lb'){
        }else{
            return(res.json({
                message: "measure must be gram , cup or lb",
                status :false
            }))
        }

        if(added_by == 'admin'){
            added_by_id= 0
        }else{
            if(!added_by_id){
                return(
                    res.json({
                        message: "added_by_id is required",
                        status : false
                    })
                )
            }
        }

        console.log(added_by_id)

       

        const query = `INSERT INTO food 
                (added_by , added_by_id  , food_name , energy_calories , measure , units , protein , carbs , fats , 
                    monosaturated_fats ,saturated_fats , suger , fiber  , sodium, calcium , iron , vitamin_A , vitamin_b,
                    vitamin_c , cholestrol
                    )
                VALUES ($1 , $2, $3 , $4 , $5, $6, $7 , $8 , $9 , $10 , $11 , $12 , $13 , $14 , $15 , $16 , $17 , $18 , $19 , $20) RETURNING *            
        `
        const result = await pool.query(query , 
            [
                added_by ? added_by : null,
                added_by_id,
                food_name ?food_name : null,
                energy_calories ? energy_calories : null,
                measure ? measure : null,
                units ? units : null,
                protein ? protein : null,
                carbs ? carbs : null,
                fats ? fats : null,
                monosaturated_fats ? monosaturated_fats : null,
                saturated_fats ? saturated_fats : null,
                suger ?suger : null,
                fiber ? fiber : null,
                sodium ? sodium : null,
                calcium ? calcium : null,
                iron ? iron : null,
                vitamin_A ? vitamin_A : null,
                vitamin_b ? vitamin_b : null,
                vitamin_c ? vitamin_c : null,
                cholestrol ? cholestrol : null

            ]);


            if(result.rows[0]){
                res.json({
                    message: "Food Added",
                    status : true,
                    result : result.rows[0]
                })
            }
            else{
                res.json({
                    message : "Could not add" ,
                    status : false
                    
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

exports.updateFood = async (req, res) => {
    const client = await pool.connect();
    try {
        const food_id = req.body.food_id;
        const food_name = req.body.food_name;
        const energy_calories = req.body.energy_calories;
        const measure  = req.body.measure;
        const units  = req.body.units;
        const protein = req.body.protein;
        const carbs = req.body.carbs;
        const fats = req.body.fats;
        const monosaturated_fats = req.body.monosaturated_fats;
        const saturated_fats = req.body.saturated_fats ;
        const suger = req.body.suger;
        const fiber = req.body.fiber;
        const sodium = req.body.sodium;
        const calcium = req.body.calcium ;
        const iron = req.body.iron;
        const vitamin_A = req.body.vitamin_A;
        const vitamin_b = req.body.vitamin_b;
        const vitamin_c = req.body.vitamin_c ;
        const cholestrol = req.body.cholestrol ;

        if( !food_id){
            return(
                res.json({
                    message: "food_id must be provided" ,
                    status : false
                })
            )
        }



        if(measure){
            if(measure == 'gram' || measure == 'cup' || measure == 'lb'){
            }else{
                return(res.json({
                    message: "measure must be gram , cup or lb",
                    status :false
                }))
            }
        }

      
        let query = 'UPDATE food SET ';
        let index = 2;
        let values =[food_id];

        
        if(food_name){
            query+= `food_name = $${index} , `;
            values.push(food_name)
            index ++
        }
        if(energy_calories){
            query+= `energy_calories = $${index} , `;
            values.push(energy_calories)
            index ++
        }
        if(units){
            query+= `units = $${index} , `;
            values.push(units)
            index ++
        }
        if(protein){
            query+= `protein = $${index} , `;
            values.push(protein)
            index ++
        }
        if(carbs){
            query+= `carbs = $${index} , `;
            values.push(carbs)
            index ++
        }
        if(fats){
            query+= `fats = $${index} , `;
            values.push(fats)
            index ++
        }
        if(monosaturated_fats){
            query+= `monosaturated_fats = $${index} , `;
            values.push(monosaturated_fats)
            index ++
        }
        if(saturated_fats){
            query+= `saturated_fats = $${index} , `;
            values.push(saturated_fats)
            index ++
        }
        if(suger){
            query+= `suger = $${index} , `;
            values.push(suger)
            index ++
        }
        
        if(fiber){
            query+= `fiber = $${index} , `;
            values.push(fiber)
            index ++
        }
        if(sodium){
            query+= `sodium = $${index} , `;
            values.push(sodium)
            index ++
        }
        
      
      


        if(calcium){
            query+= `calcium = $${index} , `;
            values.push(calcium)
            index ++
        }
        if(iron){
            query+= `iron = $${index} , `;
            values.push(iron)
            index ++
        }
        if(vitamin_A){
            query+= `vitamin_A = $${index} , `;
            values.push(vitamin_A)
            index ++
        }
        if(vitamin_b){
            query+= `vitamin_b = $${index} , `;
            values.push(vitamin_b)
            index ++
        }
        
        if(vitamin_c){
            query+= `vitamin_c = $${index} , `;
            values.push(vitamin_c)
            index ++
        }
        if(cholestrol){
            query+= `cholestrol = $${index} , `;
            values.push(cholestrol)
            index ++
        }
        


        query += 'WHERE food_id = $1 RETURNING*'
        query = query.replace(/,\s+WHERE/g, " WHERE");
        console.log(query);
        

        let result= await pool.query(query , values);

    
        if(result.rows[0]){
                res.json({
                    message: "Food Updated successfully", 
                    status : true,
                   result : result.rows[0]
                })
            
        }
        else{
            res.json({
                message : "Could not Updated" ,
                status : false
                
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


exports.deleteFood= async (req, res) => {
    const client = await pool.connect();
    try {
        const food_id = req.query.food_id;


        if (!food_id) {
            return (
                res.json({
                    message: "Please provide user_id and food_id ",
                    status: false
                })
            )
        }

        const query = 'DELETE FROM food WHERE food_id = $1 RETURNING *';
        const result = await pool.query(query , [food_id]);

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


exports.getFood= async (req, res) => {
    const client = await pool.connect();
    try {
        const food_id = req.query.food_id;


        if (!food_id) {
            return (
                res.json({
                    message: "Please provide food_id ",
                    status: false
                })
            )
        }

        const query = `SELECT * FROM food Where food_id = $1 AND trash = $2`;
 
        let result = await pool.query(query , [food_id , false]);

        if(result.rows[0]){
            result = result.rows[0]
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

exports.getAllFoods= async (req, res) => {
    const client = await pool.connect();
    try {

        const query = `SELECT * FROM food WHERE trash = $1`;
 
        let result = await pool.query(query , [false]);

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

exports.searchFood= async (req, res) => {
    const client = await pool.connect();
    try {

        const user_id = req.query.user_id;
        let food_name_text = req.query.food_name_text;


        if(!user_id || !food_name_text){
            return(
                res.json({
                    message: "user_id and food_name_text must be provided",
                    status : false
                })
            )
        }

        const userAddedQuery = 'SELECT * FROM food WHERE added_by_id = $1 AND  food_name ILIKE $2';
        let userAdded = await pool.query(userAddedQuery , [user_id ,   food_name_text.concat("%")  ])
        const query = `SELECT * FROM food WHERE added_by = $1 AND food_name ILIKE $2`;
        let result = await pool.query(query , ['admin' ,food_name_text.concat("%")]);



        if(result.rows){
            result = result.rows
        }
        if(userAdded){
            userAdded = userAdded.rows;
        }

        let array = userAdded.concat(result);

        if (array) {
            res.json({
                message: "Fetched",
                status: true,
                result : array
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
        const food_id = req.query.food_id;
        if (!food_id) {
            return (
                res.status(400).json({
                    message: "Please Provide food_id",
                    status: false
                })
            )
        }

        const query = 'UPDATE food SET trash=$2 WHERE food_id = $1 RETURNING *';
        const result = await pool.query(query , [food_id , true]);

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
        const food_id = req.query.food_id;
        if (!food_id) {
            return (
                res.status(400).json({
                    message: "Please Provide food_id",
                    status: false
                })
            )
        }

        const query = 'UPDATE food SET trash=$2 WHERE food_id = $1 RETURNING *';
        const result = await pool.query(query , [food_id , false]);

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

        const query = 'SELECT * FROM food WHERE trash = $1';
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
