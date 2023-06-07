
const { pool } = require("../../config/db.config");
const fitness_calculator = require("fitness-calculator")

exports.addDietPlan = async (req, res) => {
    const client = await pool.connect();
    try {
        const height = req.body.height;
        const weight = req.body.weight;
        const age = req.body.age;
        const user_id = req.body.user_id;
        const gender = req.body.gender;
        const targetted_weight = req.body.targetted_weight;
        const diet_budget = req.body.diet_budget;
        const activity_status = req.body.activity_status;
        const purpose = req.body.purpose;

        const created_at = req.body.created_at;

        if(!created_at){
            return(
                res.json({
                    message: "created_at must be provided",
                    status : false
                })
            )
        }


        if (!height || !weight || !age || !gender || !targetted_weight || !activity_status || !purpose) {
            return (
                res.json({
                    message: "height , weight , age ,gender ,targetted_weight , activity_status , purpose must be provided",
                    status: false
                })
            )
        }


        if (purpose == 'balance' || purpose == 'mildWeightLoss' || purpose == 'mildWeightGain' || purpose == 'heavyWeightLoss' || purpose == 'heavyWeightGain') { } else { return (res.json({ message: " purpose must be one of these  [balance, mildWeightLoss, mildWeightGain, heavyWeightLoss, heavyWeightGain] " })) }
        if (gender == 'male' || gender == 'female' || gender == 'other') { } else { return (res.json({ message: `gender must be male , female or other` })) }

        if (activity_status == 'sedentary' || activity_status == 'light' || activity_status == 'moderate' || activity_status == 'active' || activity_status == 'extreme') { } else { return (res.json({ message: " activity_status must be one of these  [sedentary, light, moderate, active, extreme]." })) }


        const foundQuery = 'SELECT * FROM diet_plan WHERE user_id = $1';
        const foundResult = await pool.query(foundQuery, [user_id]);

        if (foundResult.rows) {
            if (foundResult.rows[0]) {
                return (
                    res.json({
                        message: "Diet plan already added for this user",
                        status: false
                    })
                )
            }
        }

        const query = `INSERT INTO diet_plan 
                (user_id , height  , weight , age , gender , targetted_weight , diet_budget , activity_status , purpose , created_at)
                VALUES ($1 , $2, $3 , $4 , $5, $6, $7 , $8 , $9 , $10) RETURNING *            
        `
        const result = await pool.query(query,
            [
                user_id ? user_id : null,
                height ? height : null,
                weight ? weight : null,
                age ? age : null,
                gender ? gender : null,
                targetted_weight ? targetted_weight : null,
                diet_budget ? diet_budget : null,
                activity_status ? activity_status : null,
                purpose ? purpose : null,
                created_at ? created_at : null
            ]);

        let macros;
        let calories_needed;
        if (result.rows[0]) {
            macros = fitness_calculator.macros(gender, age, height, weight, activity_status, purpose);
            macros = macros.balancedDietPlan;
            let result = fitness_calculator.calorieNeeds(gender, age, height, weight, activity_status)
            if (result) {
                if (purpose == 'balance') {
                    calories_needed = result.balance
                }
                else if (purpose == 'mildWeightLoss') {
                    calories_needed = result.mildWeightLoss
                }
                else if (purpose == 'mildWeightGain') {
                    calories_needed = result.mildWeightGain
                }
                else if (purpose == 'heavyWeightLoss') {
                    calories_needed = result.heavyWeightLoss
                }
                else if (purpose == 'heavyWeightGain') {
                    calories_needed = result.heavyWeightGain
                }
            }

        }

        if (result.rows[0]) {
            res.json({
                message: "Diet plan added successfully",
                status: true,
                result: {
                    addedRecord: result.rows[0],
                    calories_needed_per_day: calories_needed,
                    macros: macros
                }
            })

        }
        else {
            res.json({
                message: "Could not add",
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
exports.updateDietPlan = async (req, res) => {
    const client = await pool.connect();
    try {
        const diet_plan_id = req.body.diet_plan_id;
        const height = req.body.height;
        const weight = req.body.weight;
        const age = req.body.age;
        const user_id = req.body.user_id;
        const gender = req.body.gender;
        const targetted_weight = req.body.targetted_weight;
        const diet_budget = req.body.diet_budget;
        const activity_status = req.body.activity_status;
        const purpose = req.body.purpose;


        if (!diet_plan_id) {
            return (
                res.json({
                    message: "diet_plan_id must be provided",
                    status: false
                })
            )
        }



        if (purpose) {
            if (purpose == 'balance' || purpose == 'mildWeightLoss' || purpose == 'mildWeightGain' || purpose == 'heavyWeightLoss' || purpose == 'heavyWeightGain') { } else { return (res.json({ message: " purpose must be one of these  [balance, mildWeightLoss, mildWeightGain, heavyWeightLoss, heavyWeightGain] " })) }

        }
        if (gender) {
            if (gender == 'male' || gender == 'female' || gender == 'other') { } else { return (res.json({ message: `gender must be male , female or other` })) }

        }

        if (activity_status) {
            if (activity_status == 'sedentary' || activity_status == 'light' || activity_status == 'moderate' || activity_status == 'active' || activity_status == 'extreme') { } else { return (res.json({ message: " activity_status must be one of these  [sedentary, light, moderate, active, extreme]." })) }

        }



        let query = 'UPDATE diet_plan SET ';
        let index = 2;
        let values = [diet_plan_id];


        if (height) {
            query += `height = $${index} , `;
            values.push(height)
            index++
        }
        if (weight) {
            query += `weight = $${index} , `;
            values.push(weight)
            index++
        }
        if (age) {
            query += `age = $${index} , `;
            values.push(age)
            index++
        }
        if (user_id) {
            query += `user_id = $${index} , `;
            values.push(user_id)
            index++
        }
        if (gender) {
            query += `gender = $${index} , `;
            values.push(gender)
            index++
        }
        if (targetted_weight) {
            query += `targetted_weight = $${index} , `;
            values.push(targetted_weight)
            index++
        }
        if (diet_budget) {
            query += `diet_budget = $${index} , `;
            values.push(diet_budget)
            index++
        }
        if (activity_status) {
            query += `activity_status = $${index} , `;
            values.push(activity_status)
            index++
        }
        if (purpose) {
            query += `purpose = $${index} , `;
            values.push(purpose)
            index++
        }



        query += 'WHERE diet_plan_id = $1 RETURNING*'
        query = query.replace(/,\s+WHERE/g, " WHERE");
        console.log(query);


        let result = await pool.query(query, values);

        if (result.rows[0]) {
            result = result.rows[0]
        }

        let calories_needed;
        if (result) {
            macros = fitness_calculator.macros(result.gender, result.age, result.height, result.weight, result.activity_status, result.purpose);
            macros = macros.balancedDietPlan;
            let calories = fitness_calculator.calorieNeeds(gender, age, height, weight, activity_status)

            if (calories) {
                if (result.purpose == 'balance') {
                    calories_needed = calories.balance
                }
                else if (result.purpose == 'mildWeightLoss') {
                    calories_needed = calories.mildWeightLoss
                }
                else if (result.purpose == 'mildWeightGain') {
                    calories_needed = calories.mildWeightGain
                }
                else if (result.purpose == 'heavyWeightLoss') {
                    calories_needed = calories.heavyWeightLoss
                }
                else if (result.purpose == 'heavyWeightGain') {
                    calories_needed = calories.heavyWeightGain
                }
            }
        }


        if (result) {
            res.json({
                message: "Diet plan added successfully",
                status: true,
                result: {
                    updated_record: result,
                    calories_needed_per_day: calories_needed,
                    macros: macros
                }
            })

        }
        else {
            res.json({
                message: "Could not Updated",
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

exports.getDietPlan = async (req, res) => {
    const client = await pool.connect();
    try {
        const diet_plan_id = req.query.diet_plan_id;
        const user_id = req.query.user_id;


        if (!user_id || !diet_plan_id) {
            return (
                res.json({
                    message: "Please provide user_id and diet_plan_id ",
                    status: false
                })
            )
        }

        const query = `SELECT * FROM diet_plan Where diet_plan_id = $1 AND user_id = $2 AND trash=$3`;

        let result = await pool.query(query, [diet_plan_id, user_id , false]);

        if (result.rows[0]) {
            result = result.rows[0]
        }

        let calories_needed;
        if (result) {
            macros = fitness_calculator.macros(result.gender, result.age, result.height, result.weight, result.activity_status, result.purpose);
            macros = macros.balancedDietPlan;
            let calories = fitness_calculator.calorieNeeds(result.gender, result.age, result.height, result.weight, result.activity_status)

            if (calories) {
                if (result.purpose == 'balance') {
                    calories_needed = calories.balance
                }
                else if (result.purpose == 'mildWeightLoss') {
                    calories_needed = calories.mildWeightLoss
                }
                else if (result.purpose == 'mildWeightGain') {
                    calories_needed = calories.mildWeightGain
                }
                else if (result.purpose == 'heavyWeightLoss') {
                    calories_needed = calories.heavyWeightLoss
                }
                else if (result.purpose == 'heavyWeightGain') {
                    calories_needed = calories.heavyWeightGain
                }
            }
        }

        if (result.rows[0]) {
            res.json({
                message: "Fetched",
                status: true,
                result: {
                    fetched_record: result.rows[0],
                    calories_needed_per_day: calories_needed,
                    macros: macros
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

exports.deleteDietPlan = async (req, res) => {
    const client = await pool.connect();
    try {
        const diet_plan_id = req.query.diet_plan_id;
        const user_id = req.query.user_id;


        if (!user_id || !diet_plan_id) {
            return (
                res.json({
                    message: "Please provide user_id and diet_plan_id ",
                    status: false
                })
            )
        }

        const query = 'DELETE FROM diet_plan WHERE user_id = $1 AND diet_plan_id=$2 RETURNING *';
        const result = await pool.query(query, [user_id, diet_plan_id]);

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

exports.addFoodIntake = async (req, res) => {
    const client = await pool.connect();
    try {
        const user_id = req.body.user_id;
        const diet_plan_id = req.body.diet_plan_id;
        const meal_time = req.body.meal_time;
        const food_id = req.body.food_id;
        const quantity = req.body.quantity;
        const unit = req.body.unit;
        const created_at = req.body.created_at;

        if(!created_at){
            return(
                res.json({
                    message: "created_at must be provided",
                    status : false
                })
            )
        }


        if (!user_id || !food_id || !diet_plan_id) {
            return (
                res.json({
                    message: "user_id And food_id  , diet_plan_id must be provided",
                    status: false
                })
            )
        }

        if (meal_time) {
            if (meal_time == 'break_fast' || meal_time == 'lunch' || meal_time == 'snacks' || meal_time == "dinner") {
            }
            else {
                return (
                    res.json({
                        message: "meal time can be one of these : break_fast , lunch , snacks , dinner",
                        status: false
                    })
                )
            }
        }


        const diet_query = `SELECT * FROM diet_plan Where user_id = $1`;

        let dietPlan = await pool.query(diet_query, [user_id]);

        if (dietPlan.rows[0]) {
            dietPlan = dietPlan.rows[0]
        }
        else{
            return(res.json({
                message: "Please add diet plan for the user first",
                status : false
            }))
        }



        const query = `INSERT INTO daily_food_intake 
                (user_id , diet_plan_id  , meal_time , food_id , quantity , unit , created_at)
                VALUES ($1 , $2, $3 , $4 , $5, $6 , $7) RETURNING *            
        `
        const result = await pool.query(query,
            [
                user_id ? user_id : null,
                diet_plan_id ? diet_plan_id : null,
                meal_time ? meal_time : null,
                food_id ? food_id : null,
                quantity ? quantity : null,
                unit ? unit : null,
                created_at ? created_at : null
            ]);
        console.log(result.rows);


        const todaysIntakesQuery = `SELECT 
        daily_food_intake.*, 
        ROW_TO_JSON(food.*) AS food_details 
      FROM 
        daily_food_intake 
        LEFT OUTER JOIN food ON food.food_id = daily_food_intake.food_id        
       WHERE user_id = $1 AND  TO_DATE(daily_food_intake.created_at, 'YYYY-MM-DD') = CURRENT_DATE;`;


       

        const todayIntake = await pool.query(todaysIntakesQuery, [user_id]);
        console.log(todayIntake.rows)

        let intakes;
        if (todayIntake.rows) {
            intakes = todayIntake.rows
        }

        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFats = 0;
        if (intakes) {
            for (let i = 0; i < intakes.length; i++) {
                const foodDetails = intakes[i].food_details;
                if (foodDetails) {
                    totalProtein += foodDetails.protein * (intakes[i].quantity ? intakes[i].quantity:1) || 0;
                    totalCarbs += foodDetails.carbs * (intakes[i].quantity ? intakes[i].quantity:1) || 0;
                    totalFats += foodDetails.fats * (intakes[i].quantity ? intakes[i].quantity:1) || 0;
                }
            }
        };

        console.log(`Total protein: ${totalProtein}g`);
        console.log(`Total carbs: ${totalCarbs}g`);
        console.log(`Total fats: ${totalFats}g`);

        const macrosTaken = {
            protein : totalProtein ,
            carbs : totalCarbs,
            fats : totalFats
        }

    
        let macros;
        let calories_needed;
        if (dietPlan) {
            macros = fitness_calculator.macros(dietPlan.gender, dietPlan.age, dietPlan.height, dietPlan.weight, dietPlan.activity_status, dietPlan.purpose);
            macros = macros.balancedDietPlan;
            let calories = fitness_calculator.calorieNeeds(result.dietPlan, result.dietPlan, result.dietPlan, result.dietPlan, result.dietPlan)

            if (calories) {
                if (result.purpose == 'balance') {
                    calories_needed = calories.balance
                }
                else if (result.purpose == 'mildWeightLoss') {
                    calories_needed = calories.mildWeightLoss
                }
                else if (result.purpose == 'mildWeightGain') {
                    calories_needed = calories.mildWeightGain
                }
                else if (result.purpose == 'heavyWeightLoss') {
                    calories_needed = calories.heavyWeightLoss
                }
                else if (result.purpose == 'heavyWeightGain') {
                    calories_needed = calories.heavyWeightGain
                }
            }
        }


        if(result.rows){
            res.json({
                message : "Food intake recorded",
                status : true,
                result: {
                    food_intake : result.rows,
                    macrosTaken : macrosTaken ,
                    macrosRequired : macros
                }
            })
        }
        else{
            res.json({
                message: "Could not insert food intake record of user",
                stauts : false
            })
        }
        

        // if(result.rows){

        // }


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

exports.getDailyConsumption = async (req,res)=>{
    const client = await pool.connect();

    try{
        const user_id = req.query.user_id;
        const diet_plan_id = req.query.diet_plan_id;

        if (!user_id || !diet_plan_id) {
            return (
                res.json({
                    message: "user_id , diet_plan_id must be provided",
                    status: false
                })
            )
        }

        const query = `SELECT * FROM diet_plan Where user_id = $1 AND trash=$2 AND diet_plan_id=$3`;

        let result = await pool.query(query, [user_id , false , diet_plan_id]);

        if (result.rows[0]) {
            result = result.rows[0]
        }else{
            result = null
        }

        let calories_needed;
        let macrosRequired;
        if (result) {
            macros = fitness_calculator.macros(result.gender, result.age, result.height, result.weight, result.activity_status, result.purpose);
            macros = macros.balancedDietPlan;
            macrosRequired= macros;
            let calories = fitness_calculator.calorieNeeds(result.gender, result.age, result.height, result.weight, result.activity_status)

            if (calories) {
                if (result.purpose == 'balance') {
                    calories_needed = calories.balance
                }
                else if (result.purpose == 'mildWeightLoss') {
                    calories_needed = calories.mildWeightLoss
                }
                else if (result.purpose == 'mildWeightGain') {
                    calories_needed = calories.mildWeightGain
                }
                else if (result.purpose == 'heavyWeightLoss') {
                    calories_needed = calories.heavyWeightLoss
                }
                else if (result.purpose == 'heavyWeightGain') {
                    calories_needed = calories.heavyWeightGain
                }
            }
        }
        
        
        const todaysIntakesQuery = `SELECT 
            daily_food_intake.*, 
            ROW_TO_JSON(food.*) AS food_details 
          FROM 
            daily_food_intake 
            LEFT OUTER JOIN food ON food.food_id = daily_food_intake.food_id        
           WHERE user_id = $1 AND diet_plan_id = $2 AND DATE(daily_food_intake.created_at) = CURRENT_DATE;`


        const todayIntake = await pool.query(todaysIntakesQuery, [user_id , diet_plan_id]);
        console.log(todayIntake.rows)

        let intakes;
        if (todayIntake.rows) {
            intakes = todayIntake.rows
        }

        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFats = 0;
        let caloriesTaken = 0;
        if (intakes) {
            for (let i = 0; i < intakes.length; i++) {
                const foodDetails = intakes[i].food_details;
                if (foodDetails) {
                    totalProtein += foodDetails.protein * (intakes[i].quantity ? intakes[i].quantity:1) || 0;
                    totalCarbs += foodDetails.carbs * (intakes[i].quantity ? intakes[i].quantity:1) || 0;
                    totalFats += foodDetails.fats * (intakes[i].quantity ? intakes[i].quantity:1) || 0;
                    caloriesTaken += foodDetails.energy_calories * (intakes[i].quantity ? intakes[i].quantity:1) || 0;
                }
            }
        };

        const macrosTaken = {
            protein : totalProtein ,
            carbs : totalCarbs,
            fats : totalFats
        }


        if(intakes){
            res.json({
                message : "Food Intake record of today",
                status : false,
                result : {
                    macorsRequired : macrosRequired,
                    macrosTaken : macrosTaken ,
                    caloreis_required : calories_needed,
                    calories_consumed : caloriesTaken,
                    diet_plan_details : result,
                    foodIntakesToday : intakes
                    
                },
                


            })
        }
        else{
            res.json({
                message: "Could not get record",
                status : false
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

exports.getHistory = async (req,res)=>{
    const client = await pool.connect();

    try{
        const user_id = req.query.user_id;
        const diet_plan_id = req.query.diet_plan_id;

        if (!user_id || !diet_plan_id) {
            return (
                res.json({
                    message: "user_id , diet_plan_id must be provided",
                    status: false
                })
            )
        }


        const query = `SELECT * FROM diet_plan Where user_id = $1 AND trash=$2 AND diet_plan_id=$3`;

        let result = await pool.query(query, [user_id , false , diet_plan_id]);

        if (result.rows[0]) {
            result = result.rows[0]
        }else{
            result = null
        }

        let calories_needed;
        let macrosRequired;
        
        if (result) {
            macros = fitness_calculator.macros(result.gender, result.age, result.height, result.weight, result.activity_status, result.purpose);
            macros = macros.balancedDietPlan;
            macrosRequired= macros;
            let calories = fitness_calculator.calorieNeeds(result.gender, result.age, result.height, result.weight, result.activity_status)

            if (calories) {
                if (result.purpose == 'balance') {
                    calories_needed = calories.balance
                }
                else if (result.purpose == 'mildWeightLoss') {
                    calories_needed = calories.mildWeightLoss
                }
                else if (result.purpose == 'mildWeightGain') {
                    calories_needed = calories.mildWeightGain
                }
                else if (result.purpose == 'heavyWeightLoss') {
                    calories_needed = calories.heavyWeightLoss
                }
                else if (result.purpose == 'heavyWeightGain') {
                    calories_needed = calories.heavyWeightGain
                }
            }
        }
        

        
        
        const todaysIntakesQuery = `SELECT 
            daily_food_intake.*, 
            ROW_TO_JSON(food.*) AS food_details 
          FROM 
            daily_food_intake 
            JOIN food ON food.food_id = daily_food_intake.food_id        
           WHERE user_id = $1 AND diet_plan_id = $2`


        const todayIntake = await pool.query(todaysIntakesQuery, [user_id , diet_plan_id]);
        console.log(todayIntake.rows)

        let intakes;
        if (todayIntake.rows) {
            intakes = todayIntake.rows
        }

        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFats = 0;
        let caloriesTaken = 0;

        if (intakes) {
            for (let i = 0; i < intakes.length; i++) {
                const foodDetails = intakes[i].food_details;
                if (foodDetails) {
                    totalProtein += foodDetails.protein * (intakes[i].quantity ? intakes[i].quantity:1) || 0;
                    totalCarbs += foodDetails.carbs * (intakes[i].quantity ? intakes[i].quantity:1) || 0;
                    totalFats += foodDetails.fats * (intakes[i].quantity ? intakes[i].quantity:1) || 0;
                    caloriesTaken += foodDetails.energy_calories * (intakes[i].quantity ? intakes[i].quantity:1) || 0;

                }
            }
        };

        const macrosTaken = {
            protein : totalProtein ,
            carbs : totalCarbs,
            fats : totalFats
        }


        if(intakes){
            res.json({
                message : "Food Intake record history",
                status : true,
                result : {
                    macrosTaken : macrosTaken ,
                    macrosRequired : macrosRequired , 
                    caloreis_required : calories_needed,
                    calories_consumed : caloriesTaken,
                    diet_plan_details : result,
                    foodIntakes : intakes
                },
                


            })
        }
        else{
            res.json({
                message: "Could not get record",
                status : false
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
        const diet_plan_id = req.query.diet_plan_id;
        if (!diet_plan_id) {
            return (
                res.status(400).json({
                    message: "Please Provide diet_plan_id",
                    status: false
                })
            )
        }

        const query = 'UPDATE diet_plan SET trash=$2 WHERE diet_plan_id = $1 RETURNING *';
        const result = await pool.query(query , [diet_plan_id , true]);

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
        const diet_plan_id = req.query.diet_plan_id;
        if (!diet_plan_id) {
            return (
                res.status(400).json({
                    message: "Please Provide diet_plan_id",
                    status: false
                })
            )
        }

        const query = 'UPDATE diet_plan SET trash=$2 WHERE diet_plan_id = $1 RETURNING *';
        const result = await pool.query(query , [diet_plan_id , false]);

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

        const query = 'SELECT * FROM diet_plan WHERE trash = $1';
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

exports.getDietPlanOfUser = async (req, res) => {
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

        const query = `SELECT * FROM diet_plan Where user_id = $1 AND trash=$2`;

        let result = await pool.query(query, [user_id , false]);

        if (result.rows[0]) {
            result = result.rows[0]
        }else{
            result = null
        }

        let calories_needed;
        if (result) {
            macros = fitness_calculator.macros(result.gender, result.age, result.height, result.weight, result.activity_status, result.purpose);
            macros = macros.balancedDietPlan;
            let calories = fitness_calculator.calorieNeeds(result.gender, result.age, result.height, result.weight, result.activity_status)

            if (calories) {
                if (result.purpose == 'balance') {
                    calories_needed = calories.balance
                }
                else if (result.purpose == 'mildWeightLoss') {
                    calories_needed = calories.mildWeightLoss
                }
                else if (result.purpose == 'mildWeightGain') {
                    calories_needed = calories.mildWeightGain
                }
                else if (result.purpose == 'heavyWeightLoss') {
                    calories_needed = calories.heavyWeightLoss
                }
                else if (result.purpose == 'heavyWeightGain') {
                    calories_needed = calories.heavyWeightGain
                }
            }
        }

        if (result) {
            res.json({
                message: "Diet plan for user found",
                status: true,
                result: {
                    fetched_record: result,
                    calories_needed_per_day: calories_needed,
                    macros: macros
                }
            })
        }
        else {
            res.json({
                message: "Not able to find any diet plan for user",
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
