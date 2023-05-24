

const {pool} = require("../../config/db.config");


exports.addSeven_by_four = async (req, res) => {
    const client = await pool.connect();
    try {
        const name = req.body.name;
        const description = req.body.description;
        const image = req.body.image;
        const calories_burns = req.body.calories_burns;
        const time = req.body.time;
        const created_at = req.body.created_at;

        if(!created_at){
            return(
                res.json({
                    message : "created_at must be provided",
                    status : false
                })
            )
        }

        const foundRecordQuery = 'SELECT * FROM SevenByFourChallenge LIMIT 1';
        const foundRecordResult = await pool.query(foundRecordQuery)
        if(foundRecordResult.rows[0]){
            return(
                res.json({
                    message : "Seven by 4 is already created , You can only Update it now.",
                    status : false
                })
            )
        }

        let array = req.body.inputArray;
        let seven_by_four_challenge_id;
        let week_id
        let day_id;

        let week_details;
        let day_details;

        const validate= await validateArray(array);
        
        if(validate==false){
            return(
                res.status(400).json({
                   
                    message: "input array is not in correct format , Please Input the array in a correct order , First of all week 1 and its days will be created, days of week 1 must be in order  , same for weeks , week_no must be in order",
                    status :false,
                    expected_input_format :    [
                        {
                            "week_no" : 1,
                            "day" : 1 , 
                            "plan_description" : "Plain description",
                            "exercises" : [
                                3000042 , 3000043
                            ]
                        },

                         {
                            "week_no" : 1,
                            "day" : 2, 
                            "plan_description" : "Plain description",
                            "exercises" : [
                                3000042 , 3000043
                            ]
                        },
                        
                        {
                            "week_no" : 1,
                            "day" : 3 , 
                            "plan_description" : "Plain description",
                            "exercises" : [
                                3000042 , 3000043
                            ]
                        },
                         {
                            "week_no" : 1,
                            "day" : 4, 
                            "plan_description" : "Plain description",
                            "exercises" : [
                                3000042 , 3000043
                            ]
                        },
                        {
                            "week_no" : 1,
                            "day" : 5 , 
                            "plan_description" : "Plain description",
                            "exercises" : [
                                3000042 , 3000043
                            ]
                        },
                         {
                            "week_no" : 2,
                            "day" : 1, 
                            "plan_description" : "Plain description",
                            "exercises" : [
                                3000042 , 3000043
                            ]
                        },
                         {
                            "week_no" : 3,
                            "day" : 1, 
                            "plan_description" : "Plain description",
                            "exercises" : [
                                3000042 , 3000043
                            ]
                        }
                    ]
                    
                })
            )
        }
        for (let i = 0; i < array.length; i++) {
            const element = array[i];
        if(!element.week_no || !element.day || !element.exercises){
            return(
                res.json({
                    message: "week_no,day and exersises(Array) must be passed , It seems in one or many of these array of documents have a problem",
                    status :false
                })
            )
        }
        }

        const challenge_query = 'INSERT INTO SevenByFourChallenge (name , description , image , calories_burns , time , created_at) VALUES ($1 ,$2 ,$3 , $4 , $5 , $6) RETURNING *';
        const challenge_result = await pool.query(challenge_query , [
            name ? name : null,
            description ?description : null,
            image ? image : null,
            calories_burns ? calories_burns : null,
            time ? time : null,
            created_at ? created_at : null
        ]);


        if(challenge_result.rows[0]){
            if(challenge_result.rows[0].seven_by_four_challenge_id){
                seven_by_four_challenge_id  = challenge_result.rows[0].seven_by_four_challenge_id;
            }
        }
        else{return(res.json({message : "There is some issue in creating seven_by_fourchallenge" , status : false}))}



        let week_01_records = [];
        let week_02_records = [];
        let week_03_records = [];
        let week_04_records = [];




        for (let i = 0; i < array.length; i++) {
            const element = array[i];
            if(element.week_no){
                if(element.week_no == 1){
                    week_01_records.push(element);
                }
                if(element.week_no == 2){
                    week_02_records.push(element)
                }
                if(element.week_no == 3){
                    week_03_records.push(element)
                }
                if(element.week_no==4){
                    week_04_records.push(element)
                }
            }
            
        }

        console.log("week 1 records are" , week_01_records)
        console.log("week 2 records are" , week_02_records)
        console.log("week 3 records are" , week_03_records)
        console.log("week 4 records are" , week_04_records)

if(week_01_records.length > 0){
                    let query= 'INSERT INTO SevenByFourChallenge_weeks (seven_by_four_challenge_id , week_no , created_at) VALUES ($1 , $2 , $3) RETURNING *';
                    const result = await pool.query(query , [seven_by_four_challenge_id, 1 , created_at]);
                    console.log(result);

                    if(result.rows[0]){
                        let week_id  = result.rows[0].week_id;
                        for (let i = 0; i < week_01_records.length; i++) {
                            const element = week_01_records[i];
                            let element_exercises = element.exercises;
                            let week_days_query= 'INSERT INTO SevenByFourChallenge_week_days (week_id , seven_by_four_challenge_id , day , created_at) VALUES ($1 , $2 , $3 , $4) RETURNING *';
                            const week_days_result = await pool.query(week_days_query , [week_id, seven_by_four_challenge_id , element.day , created_at]);

                            if(week_days_result){
                                if(week_days_result.rows[0].day_id){
                                    let day_id = week_days_result.rows[0].day_id;
                                    for (let i = 0; i < element_exercises.length; i++) {
                                        const exercise = element_exercises[i];
                                        console.log(exercise)

                                        let InsertExercise = 'INSERT INTO SevenByFourChallenge_week_day_exercises ( exersise_id , SevenByFourChallenge_week_day_id , reps ,time) VALUES ($1 , $2, $3 , $4 ) RETURNING*'
                                        let exersiseInsertionResult= await pool.query(InsertExercise ,
                                         [
                                            exercise.exercise_id ? exercise.exercise_id: null,
                                            day_id ? day_id : null,
                                            exercise.reps ? exercise.reps : null,
                                            exercise.time ? exercise .time : null
                                            
                                        ]);

                                        console.log(exersiseInsertionResult.rows[0])
                                    }
                                }
                            }
                            
                        }
                    }
}

if(week_02_records.length > 0){
            
            let query= 'INSERT INTO SevenByFourChallenge_weeks (seven_by_four_challenge_id , week_no ,created_at) VALUES ($1 , $2 , $3 ) RETURNING *';
            const result = await pool.query(query , [seven_by_four_challenge_id, 2 , created_at]);
            console.log(result);

            if(result.rows[0]){
                let week_id  = result.rows[0].week_id;

                for (let i = 0; i < week_02_records.length; i++) {
                    const element = week_02_records[i];
                    let element_exercises = element.exercises;


                    let week_days_query= 'INSERT INTO SevenByFourChallenge_week_days (week_id , seven_by_four_challenge_id , day  , created_at) VALUES ($1 , $2 , $3 , $4) RETURNING *';
                    const week_days_result = await pool.query(week_days_query , [week_id, seven_by_four_challenge_id , element.day  , created_at]);

                    if(week_days_result){
                        if(week_days_result.rows[0].day_id){
                            let day_id = week_days_result.rows[0].day_id;
                            for (let i = 0; i < element_exercises.length; i++) {
                                const exercise = element_exercises[i];
                                console.log(exercise)

                                let InsertExercise = 'INSERT INTO SevenByFourChallenge_week_day_exercises ( exersise_id , SevenByFourChallenge_week_day_id , reps ,time) VALUES ($1 , $2, $3 , $4 ) RETURNING*'
                                let exersiseInsertionResult= await pool.query(InsertExercise ,
                                 [
                                    exercise.exercise_id ? exercise.exercise_id: null,
                                    day_id ? day_id : null,
                                    exercise.reps ? exercise.reps : null,
                                    exercise.time ? exercise .time : null
                                    
                                ]);

                                console.log(exersiseInsertionResult.rows[0])
                            }
                        }
                    }
                }
            }
}

if(week_03_records.length > 0){
            
    let query= 'INSERT INTO SevenByFourChallenge_weeks (seven_by_four_challenge_id , week_no , created_at ) VALUES ($1 , $2 , $3) RETURNING *';
    const result = await pool.query(query , [seven_by_four_challenge_id, 3 , created_at]);
    console.log(result);

    if(result.rows[0]){
        let week_id  = result.rows[0].week_id;

        for (let i = 0; i < week_03_records.length; i++) {
            const element = week_03_records[i];
            let element_exercises = element.exercises;


            let week_days_query= 'INSERT INTO SevenByFourChallenge_week_days (week_id , seven_by_four_challenge_id , day ,created_at ) VALUES ($1 , $2 , $3 , $4) RETURNING *';
            const week_days_result = await pool.query(week_days_query , [week_id, seven_by_four_challenge_id , element.day  , created_at]);

              if(week_days_result){
                        if(week_days_result.rows[0].day_id){
                            let day_id = week_days_result.rows[0].day_id;
                            for (let i = 0; i < element_exercises.length; i++) {
                                const exercise = element_exercises[i];
                                console.log(exercise)

                                let InsertExercise = 'INSERT INTO SevenByFourChallenge_week_day_exercises ( exersise_id , SevenByFourChallenge_week_day_id , reps ,time) VALUES ($1 , $2, $3 , $4 ) RETURNING*'
                                let exersiseInsertionResult= await pool.query(InsertExercise ,
                                 [
                                    exercise.exercise_id ? exercise.exercise_id: null,
                                    day_id ? day_id : null,
                                    exercise.reps ? exercise.reps : null,
                                    exercise.time ? exercise .time : null
                                    
                                ]);

                                console.log(exersiseInsertionResult.rows[0])
                            }
                        }
                    }
        }
    }
}

if(week_04_records.length > 0){
            
    let query= 'INSERT INTO SevenByFourChallenge_weeks (seven_by_four_challenge_id , week_no ,created_at) VALUES ($1 , $2 ,$3) RETURNING *';
    const result = await pool.query(query , [seven_by_four_challenge_id, 4 , created_at]);
    console.log(result);

    if(result.rows[0]){
        let week_id  = result.rows[0].week_id;

        for (let i = 0; i < week_04_records.length; i++) {
            const element = week_04_records[i];
            let element_exercises = element.exercises;


            let week_days_query= 'INSERT INTO SevenByFourChallenge_week_days (week_id , seven_by_four_challenge_id , day , created_at ) VALUES ($1 , $2 , $3 , $4 ) RETURNING *';
            const week_days_result = await pool.query(week_days_query , [week_id, seven_by_four_challenge_id , element.day , created_at]);

            if(week_days_result){
                if(week_days_result.rows[0].day_id){
                    let day_id = week_days_result.rows[0].day_id;
                    for (let i = 0; i < element_exercises.length; i++) {
                        const exercise = element_exercises[i];
                        console.log(exercise)

                        let InsertExercise = 'INSERT INTO SevenByFourChallenge_week_day_exercises ( exersise_id , SevenByFourChallenge_week_day_id , reps ,time) VALUES ($1 , $2, $3 , $4 ) RETURNING*'
                        let exersiseInsertionResult= await pool.query(InsertExercise ,
                         [
                            exercise.exercise_id ? exercise.exercise_id: null,
                            day_id ? day_id : null,
                            exercise.reps ? exercise.reps : null,
                            exercise.time ? exercise .time : null
                            
                        ]);

                        console.log(exersiseInsertionResult.rows[0])
                    }
                }
            }
        }
    }
}
        
        // if(seven_by_four_challenge_id){
        //     for (let i = 0; i < array.length; i++) {
        //         const element = array[i];
        //         if(element.week_no){

        //             while (element.week_no = 01){
                        
        //             }


        //             let query= 'INSERT INTO SevenByFourChallenge_weeks (seven_by_four_challenge_id , week_no ) VALUES ($1 , $2 ) RETURNING *';
        //             const result = await pool.query(query , [seven_by_four_challenge_id, element.week_no]);

        //             console.log(result)

                  


                            
        //                     // if(seven_by_four_challenge_id && week_id){
        //                     //     for (let i = 0; i < array.length; i++) {
        //                     //         const element = array[i];
        //                     //         if(element.day){
        //                     //             let query= 'INSERT INTO SevenByFourChallenge_week_days (week_id , seven_by_four_challenge_id , day , exercises ) VALUES ($1 , $2 , $3 , $4 ) RETURNING *';
        //                     //             const result = await pool.query(query , [week_id, seven_by_four_challenge_id , element.day , element.exercises]);
        //                     //             if(result.rows[0]){
        //                     //                 day_details = result.rows[0];
        //                     //                 if(result.rows[0].day_id){
        //                     //                     day_id = result.rows[0].day_id;
        //                     //                 }
        //                     //             }
        //                     //             else{
        //                     //                 // let  deletePreviousQuery = 'DELETE FROM SevenByFourChallenge WHERE seven_by_four_challenge_id = $1 RETURNING * ';
        //                     //                 // if(deletePreviousQuery.rowCount >0){
        //                     //                 //     console.log("previously created seven by challenge also deleted as due to error occurred in weeks");
        //                     //                 // }
        //                     //                 // return(
        //                     //                 //     res.json({
        //                     //                 //         message : "Issue Occurred in creating week for this challenge", status :false
        //                     //                 //     })
        //                     //                 // )
        //                     //             }
        //                     //         }
                                    
                       
        //                     //     }
        //                     // }
        //                 }
        //             }
        //             // else{
        //             //     let  deletePreviousQuery = 'DELETE FROM SevenByFourChallenge WHERE seven_by_four_challenge_id = $1 RETURNING * ';
        //             //     if(deletePreviousQuery.rowCount >0){
        //             //         console.log("previously created seven by challenge also deleted as due to error occurred in weeks");
        //             //     }
        //             //     return(
        //             //         res.json({
        //             //             message : "Issue Occurred in creating week for this challenge", status :false
        //             //         })
        //             //     )
        //             // }
        //         //}//
                
        //    // }
        // }


     

        const queryGetSevenByFour = `SELECT array_agg(
            json_build_object(
                'seven_by_four_challenge_id', wp.seven_by_four_challenge_id,
                'name', wp.name,
                'description', wp.description,
                'image', wp.image,
                'calories_burns'  , wp.calories_burns,
                'time' , wp.time,
                'trash', wp.trash,
                'created_at', wp.created_at,
                'updated_at', wp.updated_at,
                'weeks', (
                    SELECT array_agg(
                        json_build_object(
                            'week_id', wi.week_id,
                            'seven_by_four_challenge_id' , wi.seven_by_four_challenge_id,
                            'week_no' , wi.week_no,
                            'trash' , wi.trash,
                            'created_at', wi.created_at,
                            'updated_at', wi.updated_at,
                            'week_days' , (
                                SELECT array_agg(
                                    json_build_object(
                                        'day_id', wd.day_id,
                                        'seven_by_four_challenge_id' , wd.seven_by_four_challenge_id,
                                        'day' , wd.day,
                                        'week_id' , wd.week_id,
                                        'exercises' , (
                                            SELECT json_agg(
                                                         json_build_object(
                                                             'SevenByFourChallenge_week_day_exercise_id', e.SevenByFourChallenge_week_day_exercise_id,
                                                             'exersise_id', e.exersise_id,
                                                             'SevenByFourChallenge_week_day_id', e.SevenByFourChallenge_week_day_id,
                                                             'reps', e.reps,
                                                             'time', e.time,
                                                             'exercise_details' , (
                                                                SELECT json_agg(
                                                                             json_build_object(
                                                                                 'exersise_id', ex.exersise_id,
                                                                                 'title', ex.title,
                                                                                 'description', ex.description,
                                                                                 'animation', ex.animation,
                                                                                 'video_link', ex.video_link,
                                                                                 'created_at', ex.created_at
                                                                             )
                                                                         )
                                                                FROM exersises ex
                                                                WHERE ex.exersise_id = e.exersise_id
                                                            ),
                                                             'created_at', e.created_at
                                                         )
                                                     )
                                            FROM SevenByFourChallenge_week_day_exercises e
                                            WHERE e.SevenByFourChallenge_week_day_id =wd.day_id
                                        ),
                                        'trash' , wd.trash,
                                        'created_at', wd.created_at,
                                        'updated_at', wd.updated_at
                                    )
                                )
                                FROM SevenByFourChallenge_week_days wd
                                WHERE wd.week_id = wi.week_id
                            )
                        )
                    )
                    FROM SevenByFourChallenge_weeks wi
                    WHERE wi.seven_by_four_challenge_id = wp.seven_by_four_challenge_id
                )
            )
        )
        FROM SevenByFourChallenge wp
        WHERE seven_by_four_challenge_id =$1 `;
 
        const getSenvenByFour = await pool.query(queryGetSevenByFour , [seven_by_four_challenge_id]);
            
        if (getSenvenByFour &&seven_by_four_challenge_id) {
            res.status(201).json({
                message: "7X4 challenge created",
                status: true,
                seven_by_four_challenge :getSenvenByFour.rows[0].array_agg
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
        const name = req.body.name;
        const description = req.body.description;
        const image = req.body.image
        const calories_burns = req.body.calories_burns
        const time = req.body.time




        if (!seven_by_four_challenge_id) {
            return (
                res.json({
                    message: "must provide seven_by_four_challenge_id ",
                    status: false
                })
            )
        }


        let query = 'UPDATE SevenByFourChallenge SET ';
        let index = 2;
        let values =[seven_by_four_challenge_id];

        
        if(name){
            query+= `name = $${index} , `;
            values.push(name)
            index ++
        }
        if(description){
            query+= `description = $${index} , `;
            values.push(description)
            index ++
        }
      
        if(image){
            query+= `image = $${index} , `;
            values.push(image)
            index ++
        }
      
        if(calories_burns){
            query+= `calories_burns = $${index} , `;
            values.push(calories_burns)
            index ++
        }
      
        if(time){
            query+= `time = $${index} , `;
            values.push(time)
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

exports.addExersiseToSevenByFourChallenge = async (req, res) => {
    const client = await pool.connect();
    try {

        const seven_by_four_challenge_id = req.body.seven_by_four_challenge_id;
        const week_id = req.body.week_id;
        const day_id = req.body.day_id;
        const exersises = req.body.exersises



        if (!seven_by_four_challenge_id  || !day_id || !exersises) {
            return (
                res.json({
                    message: "must provide seven_by_four_challenge_id  , day_id , exersises[]",
                    status: false
                })
            )
        }



    for (let i = 0; i < exersises.length; i++) {
        const element = exersises[i];
        let foundQuery = 'SELECT * FROM SevenByFourChallenge_week_day_exercises WHERE SevenByFourChallenge_week_day_id = $1 AND exersise_id = $2'
        let foundResult = await pool.query(foundQuery , [day_id , element.exersise_id] )        
        if(!foundResult.rows[0]){
            console.log('true')
            const query = 'INSERT INTO SevenByFourChallenge_week_day_exercises (exersise_id , SevenByFourChallenge_week_day_id , reps ,time) VALUES ($1 , $2, $3 , $4 ) RETURNING*'
            let result = await pool.query(query , 
                [
                    element.exersise_id ? element.exersise_id : null,
                    day_id ? day_id : null,
                    element.reps ? element.reps : null,
                    element.time ? element.time : null
                ])
        }   
    }


    const queryGetSevenByFour = `SELECT array_agg(
        json_build_object(
            'seven_by_four_challenge_id', wp.seven_by_four_challenge_id,
            'name', wp.name,
            'description', wp.description,
            'image', wp.image,
            'calories_burns'  , wp.calories_burns,
            'time' , wp.time,
            'trash', wp.trash,
            'created_at', wp.created_at,
            'updated_at', wp.updated_at,
            'weeks', (
                SELECT array_agg(
                    json_build_object(
                        'week_id', wi.week_id,
                        'seven_by_four_challenge_id' , wi.seven_by_four_challenge_id,
                        'week_no' , wi.week_no,
                        'trash' , wi.trash,
                        'created_at', wi.created_at,
                        'updated_at', wi.updated_at,
                        'week_days' , (
                            SELECT array_agg(
                                json_build_object(
                                    'day_id', wd.day_id,
                                    'seven_by_four_challenge_id' , wd.seven_by_four_challenge_id,
                                    'day' , wd.day,
                                    'week_id' , wd.week_id,
                                    'exercises' , (
                                        SELECT json_agg(
                                                     json_build_object(
                                                         'SevenByFourChallenge_week_day_exercise_id', e.SevenByFourChallenge_week_day_exercise_id,
                                                         'exersise_id', e.exersise_id,
                                                         'SevenByFourChallenge_week_day_id', e.SevenByFourChallenge_week_day_id,
                                                         'reps', e.reps,
                                                         'time', e.time,
                                                         'exercise_details' , (
                                                            SELECT json_agg(
                                                                         json_build_object(
                                                                             'exersise_id', ex.exersise_id,
                                                                             'title', ex.title,
                                                                             'description', ex.description,
                                                                             'animation', ex.animation,
                                                                             'video_link', ex.video_link,
                                                                             'created_at', ex.created_at
                                                                         )
                                                                     )
                                                            FROM exersises ex
                                                            WHERE ex.exersise_id = e.exersise_id
                                                        ),
                                                         'created_at', e.created_at
                                                     )
                                                 )
                                        FROM SevenByFourChallenge_week_day_exercises e
                                        WHERE e.SevenByFourChallenge_week_day_id =wd.day_id
                                    ),
                                    'trash' , wd.trash,
                                    'created_at', wd.created_at,
                                    'updated_at', wd.updated_at
                                )
                            )
                            FROM SevenByFourChallenge_week_days wd
                            WHERE wd.week_id = wi.week_id
                        )
                    )
                )
                FROM SevenByFourChallenge_weeks wi
                WHERE wi.seven_by_four_challenge_id = wp.seven_by_four_challenge_id
            )
        )
    )
    FROM SevenByFourChallenge wp
    WHERE seven_by_four_challenge_id =$1 `;

    const getSenvenByFour = await pool.query(queryGetSevenByFour , [seven_by_four_challenge_id]);

        if (getSenvenByFour.rows[0]) {
            res.json({
                message: "Exercices Added",
                status: true,
                result: getSenvenByFour.rows[0]
            })
        }
        else {
            res.json({
                message: "Could not add exercises into seven by four due to some reason",
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

exports.deleteExersiseFromSevenByFour = async (req, res) => {
    const client = await pool.connect();
    try {

        const seven_by_four_challenge_id = req.body.seven_by_four_challenge_id;
        const week_id = req.body.week_id;
        const day_id = req.body.day_id;
        const exersise_id = req.body.exersise_id;


        if (!seven_by_four_challenge_id || !week_id || !day_id || !exersise_id) {
            return (
                res.json({
                    message: "must provide seven_by_four_challenge_id  , week_id , day_id , exersise_id",
                    status: false
                })
            )
        }


        let query = 'DELETE FROM SevenByFourChallenge_week_day_exercises WHERE SevenByFourChallenge_week_day_id = $1 AND exersise_id =$2 RETURNING * ';

        let values =[day_id , exersise_id];

       
       const result = await pool.query(query , values);
        if (result.rows[0]) {
            res.json({
                message: "Exersise removed",
                status: true,
                result: result.rows[0]
            })
        }
        else {
            res.json({
                message: "Could not remove . Record With this Id may not found or req.body may be empty",
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

exports.getAllSevenByFour= async (req, res) => {
    const client = await pool.connect();
    try {
       
        const query = ` SELECT array_agg(
            json_build_object(
                'seven_by_four_challenge_id', wp.seven_by_four_challenge_id,
                'name', wp.name,
                'description', wp.description,
                'image', wp.image,
                'calories_burns'  , wp.calories_burns,
                'time' , wp.time,
                'trash', wp.trash,
                'created_at', wp.created_at,
                'updated_at', wp.updated_at,
                'weeks', (
                    SELECT array_agg(
                        json_build_object(
                            'week_id', wi.week_id,
                            'seven_by_four_challenge_id' , wi.seven_by_four_challenge_id,
                            'week_no' , wi.week_no,
                            'trash' , wi.trash,
                            'created_at', wi.created_at,
                            'updated_at', wi.updated_at,
                            'week_days' , (
                                SELECT array_agg(
                                    json_build_object(
                                        'day_id', wd.day_id,
                                        'seven_by_four_challenge_id' , wd.seven_by_four_challenge_id,
                                        'day' , wd.day,
                                        'week_id' , wd.week_id,
                                        'exercises' , (
                                            SELECT json_agg(
                                                         json_build_object(
                                                             'SevenByFourChallenge_week_day_exercise_id', e.SevenByFourChallenge_week_day_exercise_id,
                                                             'exersise_id', e.exersise_id,
                                                             'SevenByFourChallenge_week_day_id', e.SevenByFourChallenge_week_day_id,
                                                             'reps', e.reps,
                                                             'time', e.time,
                                                             'exercise_details' , (
                                                                SELECT json_agg(
                                                                             json_build_object(
                                                                                 'exersise_id', ex.exersise_id,
                                                                                 'title', ex.title,
                                                                                 'description', ex.description,
                                                                                 'animation', ex.animation,
                                                                                 'video_link', ex.video_link,
                                                                                 'created_at', ex.created_at
                                                                             )
                                                                         )
                                                                FROM exersises ex
                                                                WHERE ex.exersise_id = e.exersise_id
                                                            ),
                                                             'created_at', e.created_at
                                                         )
                                                     )
                                            FROM SevenByFourChallenge_week_day_exercises e
                                            WHERE e.SevenByFourChallenge_week_day_id =wd.day_id
                                        ),
                                        'trash' , wd.trash,
                                        'created_at', wd.created_at,
                                        'updated_at', wd.updated_at
                                    )
                                )
                                FROM SevenByFourChallenge_week_days wd
                                WHERE wd.week_id = wi.week_id
                            )
                        )
                    )
                    FROM SevenByFourChallenge_weeks wi
                    WHERE wi.seven_by_four_challenge_id = wp.seven_by_four_challenge_id
                )
            )
        )
        FROM SevenByFourChallenge wp
        WHERE wp.trash = $1;
    ` 
        const result = await pool.query(query , [ false]);

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

        const query = `SELECT array_agg(
            json_build_object(
                'seven_by_four_challenge_id', wp.seven_by_four_challenge_id,
                'name', wp.name,
                'description', wp.description,
                'image', wp.image,
                'calories_burns'  , wp.calories_burns,
                'time' , wp.time,
                'trash', wp.trash,
                'created_at', wp.created_at,
                'updated_at', wp.updated_at,
                'weeks', (
                    SELECT array_agg(
                        json_build_object(
                            'week_id', wi.week_id,
                            'seven_by_four_challenge_id' , wi.seven_by_four_challenge_id,
                            'week_no' , wi.week_no,
                            'trash' , wi.trash,
                            'created_at', wi.created_at,
                            'updated_at', wi.updated_at,
                            'week_days' , (
                                SELECT array_agg(
                                    json_build_object(
                                        'day_id', wd.day_id,
                                        'seven_by_four_challenge_id' , wd.seven_by_four_challenge_id,
                                        'day' , wd.day,
                                        'week_id' , wd.week_id,
                                        'exercises' , (
                                            SELECT json_agg(
                                                         json_build_object(
                                                             'SevenByFourChallenge_week_day_exercise_id', e.SevenByFourChallenge_week_day_exercise_id,
                                                             'exersise_id', e.exersise_id,
                                                             'SevenByFourChallenge_week_day_id', e.SevenByFourChallenge_week_day_id,
                                                             'reps', e.reps,
                                                             'time', e.time,
                                                             'exercise_details' , (
                                                                SELECT json_agg(
                                                                             json_build_object(
                                                                                 'exersise_id', ex.exersise_id,
                                                                                 'title', ex.title,
                                                                                 'description', ex.description,
                                                                                 'animation', ex.animation,
                                                                                 'video_link', ex.video_link,
                                                                                 'created_at', ex.created_at
                                                                             )
                                                                         )
                                                                FROM exersises ex
                                                                WHERE ex.exersise_id = e.exersise_id
                                                            ),
                                                             'created_at', e.created_at
                                                         )
                                                     )
                                            FROM SevenByFourChallenge_week_day_exercises e
                                            WHERE e.SevenByFourChallenge_week_day_id =wd.day_id
                                        ),
                                        'trash' , wd.trash,
                                        'created_at', wd.created_at,
                                        'updated_at', wd.updated_at
                                    )
                                )
                                FROM SevenByFourChallenge_week_days wd
                                WHERE wd.week_id = wi.week_id
                            )
                        )
                    )
                    FROM SevenByFourChallenge_weeks wi
                    WHERE wi.seven_by_four_challenge_id = wp.seven_by_four_challenge_id
                )
            )
        )
        FROM SevenByFourChallenge wp
        WHERE seven_by_four_challenge_id =$1 AND trash=$2`;
 
        const result = await pool.query(query , [seven_by_four_challenge_id , false]);

        if (result.rowCount>0) {
            res.json({
                message: "Fetched",
                status: true,
                result: result.rows[0].array_agg
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

exports.add_day_in_week= async (req, res) => {
    const client = await pool.connect();
    try {

        const seven_by_four_challenge_id = req.body.seven_by_four_challenge_id;
        const week_id = req.body.week_id;
        const day = req.body.day;
        const plan_description = req.body.plan_description;
        const created_at = req.body.created_at;

        if(!created_at){
            return(
                res.json({
                    message: "created_at must be provided",
                    status :false
                })
            )
        }


        if (!seven_by_four_challenge_id || !week_id || !day) {
            return (
                res.json({
                    message: "Please provide seven_by_four_challenge_id , week_id and day ",
                    status: false
                })
            )
        }


        const foundResut = await pool.query('SELECT * FROM SevenByFourChallenge_week_days WHERE seven_by_four_challenge_id = $1  AND week_id = $2  AND day=$3' , [seven_by_four_challenge_id , week_id , day])
        if(foundResut){
            if(foundResut.rows[0]){
              return(
                res.json({
                    message: "this day no for this week and this challenge_id already created , please change day number Or delete the previous one",
                    status :false
                })
              )
            }
        }


        const query = 'INSERT INTO SevenByFourChallenge_week_days (seven_by_four_challenge_id, week_id , day , plan_description , created_at ) VALUES ($1 , $2 , $3 ,$4  , $5) RETURNING * '
        const result = await pool.query(query , [
            seven_by_four_challenge_id , week_id ,day , plan_description?plan_description : null, created_at?created_at : null
        ]);

        if (result.rows[0]) {
            res.json({
                message: "Day Added to previous one",
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

exports.remove_day= async (req, res) => {
    const client = await pool.connect();
    try {
        const seven_by_four_challenge_id = req.query.seven_by_four_challenge_id;
        const week_id = req.query.week_id;
        const day_id = req.query.day_id;

        if(!seven_by_four_challenge_id || !week_id || !day_id){
            return(
                res.json({
                    message: "Must provide seven_by_four_challenge_id and week_id , day_id",
                    status : false
                })
            )
        }

        const query = 'DELETE FROM SevenByFourChallenge_week_days WHERE seven_by_four_challenge_id = $1 AND week_id = $2 AND day_id = $3 RETURNING *';
        const result = await pool.query(query , [seven_by_four_challenge_id , week_id , day_id]);

        if(result.rowCount>0){ 
            res.status(200).json({
                message: "Day remove successfull",
                status: true,
                deletedRecord: result.rows[0]
            })
        }
        else{
            res.status(404).json({
                message: "Could not Remove . Record With this Id may not found or req.body may be empty",
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

exports.remove_week= async (req, res) => {
    const client = await pool.connect();
    try {
        const seven_by_four_challenge_id = req.query.seven_by_four_challenge_id;
        const week_id = req.query.week_id;

        if(!seven_by_four_challenge_id || !week_id ){
            return(
                res.json({
                    message: "Must provide seven_by_four_challenge_id and week_id",
                    status : false
                })
            )
        }

        const query = 'DELETE FROM SevenByFourChallenge_weeks WHERE seven_by_four_challenge_id = $1 AND week_id = $2 RETURNING *';
        const result = await pool.query(query , [seven_by_four_challenge_id , week_id ]);

        let deleteChild;
        if(result.rows[0]){
            const deleteChildQuery = 'DELETE FROM SevenByFourChallenge_week_days WHERE seven_by_four_challenge_id = $1 AND week_id = $2 RETURNING* '
            deleteChild = await pool.query(deleteChildQuery , [seven_by_four_challenge_id , week_id])
        }

        if(result.rowCount>0){ 
            res.status(200).json({
                message: "Day remove successfull",
                message_2 : deleteChild.rows[0]?"Days for this week also deleted" : "No any days for this week_id deleted , Or may days does not exist",
                status: true,
                deletedRecord: result.rows[0]
            })
        }
        else{
            res.status(404).json({
                message: "Could not Remove . Record With this Id may not found or req.body may be empty",
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

exports.deleteTemporarily = async (req, res) => {
    const client = await pool.connect();
    try {
        const seven_by_four_challenge_id = req.query.seven_by_four_challenge_id;
        if (!seven_by_four_challenge_id) {
            return (
                res.status(400).json({
                    message: "Please Provide seven_by_four_challenge_id",
                    status: false
                })
            )
        }

        const query = 'UPDATE SevenByFourChallenge SET trash=$2 WHERE seven_by_four_challenge_id = $1 RETURNING *';
        const result = await pool.query(query , [seven_by_four_challenge_id , true]);

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
        const seven_by_four_challenge_id = req.query.seven_by_four_challenge_id;
        if (!seven_by_four_challenge_id) {
            return (
                res.status(400).json({
                    message: "Please Provide seven_by_four_challenge_id",
                    status: false
                })
            )
        }
        const query = 'UPDATE SevenByFourChallenge SET trash=$2 WHERE seven_by_four_challenge_id = $1 RETURNING *';
        const result = await pool.query(query , [seven_by_four_challenge_id , false]);

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

        const query = 'SELECT * FROM SevenByFourChallenge WHERE trash = $1';
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

exports.start_seven_by_four= async (req, res) => {
    const client = await pool.connect();
    try {
        const user_id = req.body.user_id;
        const sev_by_fourChallenge_id = req.body.sev_by_fourChallenge_id;
        const week_id = req.body.week_id;
        const day_id = req.body.day_id;
        const time = req.body.time;
        const created_at = req.body.created_at;

        if (!user_id || !sev_by_fourChallenge_id || !week_id || !day_id|| !time || !created_at) {
            return (
                res.json({
                    message: "user_id and sev_by_fourChallenge_id and time and created_at , week_id , day_id must be provided",
                    status: false
                })
            )
        }


        const foundQuery = 'SELECT * FROM user_inAction_sevByFour WHERE user_id = $1 AND sev_by_fourChallenge_id =$2 AND week_id= $3 AND day_id=$4';
        const foundResult = await pool.query(foundQuery, [user_id, sev_by_fourChallenge_id , week_id , day_id]);

        console.log("found Result =>" , foundResult.rows)
        if (foundResult.rowCount > 0) {
            return (
                res.json({
                    message: "This User already started this 7X4 day",
                    status: false
                })
            )
        }

        const query = 'INSERT INTO user_inAction_sevByFour (user_id , sev_by_fourChallenge_id , week_id , day_id , status , time , created_at) VALUES ($1 , $2 , $3 , $4 , $5 ,$6 , $7) RETURNING*';
        const result = await pool.query(query, [user_id, sev_by_fourChallenge_id, week_id , day_id , "inprogress" , time ,created_at]);

        if (result.rows[0]) {
            res.json({
                message: "User Started this 7X4",
                status: true,
                result: result.rows[0]
            })
        }
        else {
            res.json({
                message: "could not start a 7X4 for this user",
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

exports.completeDayWorkout = async (req, res) => {
    const client = await pool.connect();
    try {
        const user_inAction_sevByFour_id = req.body.user_inAction_sevByFour_id;
        if (!user_inAction_sevByFour_id) {
            return (
                res.json({
                    message: " user_inAction_sevByFour_id must be provided",
                    status: false
                })
            )
        }


        const query = 'UPDATE user_inAction_sevByFour SET status = $1 WHERE user_inAction_sevByFour_id = $2 RETURNING*';
        const result = await pool.query(query, ["completed", user_inAction_sevByFour_id]);
        console.log(result.rows)

        let record = null;
        if(result.rows){
            if(result.rows[0]){
                if(result.rows[0].sev_by_fourChallenge_id){
                    const workout_planQuery = 'SELECT * FROM SevenByFourChallenge WHERE seven_by_four_challenge_id = $1';
                    const foundResult = await pool.query(workout_planQuery , [result.rows[0].sev_by_fourChallenge_id]);
                    record = foundResult.rows[0];
                }
            }
        }
       
       

        if (result.rows[0]) {
            res.json({
                message: "Updated Staus to completed",
                status: true,
                result: {
                    record : result.rows[0],
                    seven_by_four_details : record
                }
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
            const query = 'SELECT * FROM user_inAction_sevByFour WHERE user_id = $1 AND status = $2'
            result = await pool.query(query, [user_id, 'completed']);

        }

        if (page && limit) {
            limit = parseInt(limit);
            let offset = (parseInt(page) - 1) * limit

            const query = 'SELECT * FROM user_inAction_sevByFour WHERE user_id = $1 AND status = $2  LIMIT $3 OFFSET $4'
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

exports.getUserWorkoutStartedDays = async (req, res) => {
    const client = await pool.connect();
    try {
        const user_id = req.query.user_id;
        const sev_by_fourChallenge_id = req.query.sev_by_fourChallenge_id;
       

        if (!user_id || !sev_by_fourChallenge_id) {
            return (
                res.json({
                    message: "user_id and sev_by_fourChallenge_id must be provided",
                    status: false
                })
            )
        }

        const foundQuery = `SELECT 
        week_id,
        (
            SELECT json_build_object(
                'week_no', week_no,
                'week_id', week_id,
                'seven_by_four_challenge_id', seven_by_four_challenge_id,
                'trash', trash,
                'created_at', created_at
            )
            FROM SevenByFourChallenge_weeks sfw
            WHERE uas.week_id = sfw.week_id
        ) AS week_info,
        json_agg(
            json_build_object(
                'day_id', day_id, 
                'day_info' , (
                    SELECT json_build_object(
                        'day_id', day_id,
                        'week_id', week_id,
                        'seven_by_four_challenge_id', seven_by_four_challenge_id,
                        'plan_description', plan_description,
                        'day', day,
                        'trash', trash,
                        'created_at', created_at
                    )
                    FROM SevenByFourChallenge_week_days sfwd
                    WHERE uas.day_id = sfwd.day_id
                ),
                'user_inAction_sevByFour_id', user_inAction_sevByFour_id,
                'status', status,
                'sev_by_fourChallenge_id', sev_by_fourChallenge_id,
                'week_id', week_id, 
                'time', time,
                'completed_at', completed_at
            )
        ) AS days_of_week
    FROM
        user_inAction_sevByFour uas
    WHERE
        user_id = $1 AND
        sev_by_fourChallenge_id = $2
       GROUP BY
        week_id
    ORDER BY
        week_id;
`;

        const foundResult = await pool.query(foundQuery, [user_id, sev_by_fourChallenge_id]);

        if (foundResult.rows) {
            res.json({
                message: "User Fetched record",
                status: true,
                result: foundResult.rows
            })
        }
        else {
            res.json({
                message: "could not Fetch",
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

exports.restartSeven_byFourProgress = async (req, res) => {
    const client = await pool.connect();
    try {
        const user_id = req.query.user_id;
       

        if (!user_id) {
            return (
                res.json({
                    message: "user_id must be provided",
                    status: false
                })
            )
        }

        const query = 'DELETE FROM user_inAction_sevByFour WHERE user_id = $1 RETURNING*'
        const foundResult = await pool.query(query, [user_id]);

        if (foundResult.rows) {
            res.json({
                message: "user all started 7X4 progress deleted",
                status: true,
                result: foundResult.rows
            })
        }
        else {
            res.json({
                message: "Could not reset progress",
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




function validateArray(arr) {
    let currentWeek = 1;
    let currentDay = 1;
  
    for (const item of arr) {
      if (item.week_no === currentWeek && item.day === currentDay) {
        // Correct week and day order
        currentDay++;
        if (currentDay > 7) {
          currentWeek++;
          currentDay = 1;
        }
      } else if (item.week_no === currentWeek && item.day > currentDay) {
        // Incorrect day order within the same week
        return false;
      } else if (item.week_no > currentWeek) {
        // Correct week order
        if (item.day === 1 && item.week_no === currentWeek + 1) {
          // Transition to the next week is allowed
          currentWeek = item.week_no;
          currentDay = item.day;
        } else {
          // Incorrect week order
          return false;
        }
      }
    }
  
    return true;
}


