const { pool } = require("../../config/db.config");


exports.createFeedack = async (req, res) => {
    const client = await pool.connect();
    try {
        const user_id = req.body.user_id;
        const feedback = req.body.feedback;

        if (!user_id || !feedback) {
            return (
                res.json({
                    message: "user_id and feedback must be provided",
                    status: false
                })
            )
        }

        let query;
        let result;

        query = 'INSERT INTO feedbacks (user_id , feedback) VALUES ($1 , $2) RETURNING*'
        result = await pool.query(query,
            [
                user_id ? user_id : null,
                feedback ? feedback : null

            ]);

        if (result.rows[0]) {
            res.status(201).json({
                message: "feedback saved in database",
                status: true,
                result: result.rows[0]
            })
        }
        else {
            res.status(400).json({
                message: "Could not save feedback",
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

exports.updateFeedack = async (req, res) => {
    const client = await pool.connect();
    try {
        const feedback_id = req.body.feedback_id;
        const user_id = req.body.user_id;
        const feedback = req.body.feedback;

        if (!feedback_id) {
            return (
                res.json({
                    message: "feedback_id must be provided",
                    status: false
                })
            )
        }

        let result;


        let query = 'UPDATE feedbacks SET ';
        let index = 2;
        let values = [feedback_id];


        if (user_id) {
            query += `user_id = $${index} , `;
            values.push(user_id)
            index++
        }

        if (feedback) {
            query += `feedback = $${index} , `;
            values.push(feedback)
            index++
        }

        query += 'WHERE feedback_id = $1 RETURNING*'
        query = query.replace(/,\s+WHERE/g, " WHERE");
        console.log(query);


        result = await pool.query(query, values);

        if (result.rows[0]) {
            res.status(201).json({
                message: "feedback Updated in database",
                status: true,
                result: result.rows[0]
            })
        }
        else {
            res.status(400).json({
                message: "Could not Update feedback",
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

exports.deleteFeedback = async (req, res) => {
    const client = await pool.connect();
    try {
        const feedback_id = req.query.feedback_id;
        if (!feedback_id) {
            return (
                res.json({
                    message: "feedback_id must be provided",
                    status: false
                })
            )
        }

        const query = 'DELETE FROM feedbacks WHERE feedback_id = $1 RETURNING *';
        const result = await pool.query(query, [feedback_id]);

        if (result.rowCount > 0) {
            res.status(200).json({
                message: "Deletion successfull",
                status: true,
                deletedRecord: result.rows
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

exports.get_feedback_of_user = async (req, res) => {
    const client = await pool.connect();
    try {
        const user_id = req.query.user_id;

        if (!user_id) {
            return (
                res.json({
                    message: "Please provide user_id",
                    status: false
                })
            )
        }

        const query = 'SELECT * FROM feedbacks WHERE user_id = $1';
        const result = await pool.query(query, [user_id]);

        if (result.rowCount > 0) {
            res.status(200).json({
                message: "Fetched",
                status: true,
                result: result.rows
            })
        }
        else {
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

exports.getAllFeedbacks = async (req, res) => {
    const client = await pool.connect();
    try {

        let limit = req.query.limit;
        let page = req.query.page;


        let result;

        if (!page || !limit) {
            const query = `SELECT f.feedback_id, 
            row_to_json(u.*) AS user_details, 
            f.feedback, 
            f.created_at, 
            f.updated_at
            FROM feedbacks f
            JOIN users u ON f.user_id = u.user_id
             GROUP BY f.feedback_id, u.user_id;;
            `
            result = await pool.query(query);

        }

        if (page && limit) {
            limit = parseInt(limit);
            let offset = (parseInt(page) - 1) * limit

            const query = `SELECT f.feedback_id, 
        row_to_json(u.*) AS user_details, 
        f.feedback, 
        f.created_at, 
        f.updated_at
        FROM feedbacks f
        JOIN users u ON f.user_id = u.user_id
        GROUP BY f.feedback_id, u.user_id
         LIMIT $1 OFFSET $2`
            result = await pool.query(query, [limit, offset]);


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
