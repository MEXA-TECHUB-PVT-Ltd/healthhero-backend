const {pool} = require("../../config/db.config");

exports.addForm = async (req,res)=>{
    const {name, email, phone,message}  = req.body;
    try {
        if(!name || !email || !phone || !message){
            return res.json({
                status: false,
                message:"name, email, phone and message are required"
            })
        }
        const query = `INSERT INTO contact_form (name, email, phone,message) VALUES ($1,$2,$3,$4) RETURNING *`
        const result = await pool.query(query, [name, email, phone,message]);
        if(result.rowCount < 1){
            return res.json({
                status: false,
                message:"Form not saved due to server issue"
            })
        }
        res.json({
            status: true,
            message:"Form Saved",
            result:result.rows[0]
        })
    } catch (error) {
        res.json({
            status:false,
            message:error.message
        })
    }
}
exports.editForm = async (req,res)=>{
    const {contact_from_id, name, email, phone,message}  = req.body;
    try {
        if(!contact_from_id){
            return res.json({
                status: false,
                message:"contact_from_id is required"
            })
        }
        let query = 'UPDATE contact_form SET ';
        let index = 2;
        let values = [contact_from_id];


        if (name) {
            query += `name = $${index} , `;
            values.push(name)
            index++
        }
        if (email) {
            query += `email = $${index} , `;
            values.push(email)
            index++
        }
        if (phone) {
            query += `phone = $${index} , `;
            values.push(phone)
            index++
        }
        if (message) {
            query += `message = $${index} , `;
            values.push(message)
            index++
        }
        query += 'WHERE contact_from_id = $1 RETURNING*'
        query = query.replace(/,\s+WHERE/g, " WHERE");


        let result = await pool.query(query, values);

        if (result.rowCount < 1) {
            return res.json({
                status:false,
                message:'form with this contact_from_id not found'
            })
        }
        res.json({
            status: true,
            message:"Form Updated",
            result:result.rows[0]
        })
    } catch (error) {
        res.json({
            status:false,
            message:error.message
        })
    }
}
exports.deleteForm = async (req,res)=>{
    const {contact_from_id} = req.query;
    try {
        if(!contact_from_id){
            return res.json({
                status: false,
                message:"contact_from_id is required"
            })
        }  
        const query = `DELETE FROM contact_form WHERE contact_from_id = $1 `;
        const result = await pool.query(query,[contact_from_id]);    
        if (result.rowCount < 1) {
            return res.json({
                status:false,
                message:'form with this contact_from_id not found'
            })
        }
        res.json({
            status: true,
            message:"Form Deleted",
            result:result.rows[0]
        })
    } catch (error) {
        res.json({
            status:false,
            message:error.message
        })
    }
}
exports.getAllForm = async (req,res)=>{
    try {
        const query = `SELECT * FROM contact_form`;
        const result = await pool.query(query);
        if(result.rowCount<1){
            return res.json({
                status:false,
                message:'Data not fetched',
            })
        }
        res.json({
            status:true,
            message:'Data fetched',
            result:result.rows
        })
    } catch (error) {
        res.json({
            status:false,
            message:error.message
        })
    }
}
exports.getFormById = async (req,res)=>{
    const {contact_from_id} = req.query;
    try {
        const query = `SELECT * FROM contact_form WHERE contact_from_id = $1`;
        const result = await pool.query(query,[contact_from_id]);
        if(result.rowCount<1){
            return res.json({
                status:false,
                message:'Data not fetched',
            })
        }
        res.json({
            status:true,
            message:'Data fetched',
            result:result.rows
        })
    } catch (error) {
        res.json({
            status:false,
            message:error.message
        })
    }
}