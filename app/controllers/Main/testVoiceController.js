const {pool} = require("../../config/db.config");
const fs= require('fs')

exports.add_testvoice = async (req, res) => {
    const client = await pool.connect();
    try {
        const audio_file = req.body.audio_file;

        if(!audio_file){
            return(
                res.json({
                    message: "audio_file must be provided",
                    status : false
                })
            )
        }

        let query;
        let result ;

        const foundQuery = 'SELECT * FROM test_voices';
        const foundResult = await pool.query(foundQuery);

        if(foundResult.rowCount >0){
            return(
                res.json({
                    message: "Test voice is already added, You can update it only",
                    status : false
                })
            )
        }


        query = 'INSERT INTO test_voices (audio_file) VALUES ($1) RETURNING*'
         result = await pool.query(query , 
            [
                audio_file ? audio_file : null,              
            ]);

        if (result.rows[0]) {
            res.status(201).json({
                message: "audio_file saved in database",
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
exports.update_testvoice = async (req, res) => {
    const client = await pool.connect();
    try {

        const test_voice_id = req.body.test_voice_id;
        const audio_file = req.body.audio_file;


      

        if (!test_voice_id) {
            return (
                res.json({
                    message: "Please provide test_voice_id ",
                    status: false
                })
            )
        }

        const foundQuery = 'SELECT * FROM test_voices WHERE test_voice_id = $1';
        const foundResult = await pool.query(foundQuery , [test_voice_id])
    
        let query = 'UPDATE test_voices SET ';
        let index = 2;
        let values =[test_voice_id];

        
        if(audio_file){
            query+= `audio_file = $${index} , `;
            values.push(audio_file)
            index ++
        }
      
        

        query += 'WHERE test_voice_id = $1 RETURNING*'
        query = query.replace(/,\s+WHERE/g, " WHERE");
        console.log(query);

       const result = await pool.query(query , values);

       
        if(result.rows[0]){
            if(foundResult){
                if(foundResult.rows[0]){
                    if(foundResult.rows[0].audio_file){
                        if(fs.existsSync(foundResult.rows[0].audio_file)){
                            fs.unlink(foundResult.rows[0].audio_file , (err)=>{
                                if(!err){
                                  console.log("previous audio file deleted")
                                }
                            })
                        }
                    }
                }
            }
        }
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
exports.deleteTestVoice = async (req, res) => {
    const client = await pool.connect();
    try {
        const test_voice_id = req.query.test_voice_id;
        if (!test_voice_id) {
            return (
                res.status(400).json({
                    message: "Please Provide test_voice_id",
                    status: false
                })
            )
        }

        const query = 'DELETE FROM test_voices WHERE test_voice_id = $1 RETURNING *';
        const result = await pool.query(query , [test_voice_id]);

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
exports.getTestVoice= async (req, res) => {
    const client = await pool.connect();
    try {
        const test_voice_id = req.query.test_voice_id;
        if (!test_voice_id) {
            return (
                res.status(400).json({
                    message: "Please Provide test_voice_id",
                    status: false
                })
            )
        }
        const query = 'SELECT * FROM test_voices WHERE test_voice_id = $1'
        const result = await pool.query(query , [test_voice_id]);

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