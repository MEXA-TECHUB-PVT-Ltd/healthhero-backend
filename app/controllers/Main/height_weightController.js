const { ref } = require("joi");
const { pool } = require("../../config/db.config");



exports.addWeight = async (req, res) => {
    const client = await pool.connect();
    try {

        const user_id = req.body.user_id;
        const weight = req.body.weight;
        const weight_unit = req.body.weight_unit;


        if (!weight || !user_id || !weight_unit) {
            return (
                res.json({
                    message: " weight , weight_unit and user_id must be provided",
                    status: false
                })
            )
        }

        let insertQuery = 'INSERT INTO user_weight (user_id , weight , weight_unit) VALUES ($1, $2 , $3) RETURNING*'
        const result = await pool.query(insertQuery, [
            user_id ? user_id : null,
            weight ? weight : null,
            weight_unit ? weight_unit : null,
        ])

        if (result.rows[0]) {
            let updateQuery = 'UPDATE users SET weight = $1 , weight_unit = $2 WHERE user_id = $3 RETURNING*'
            let updateResult = await pool.query(updateQuery, [
                weight ? weight : null,
                weight_unit ? weight_unit : null,
                user_id ? user_id : null
            ]);

            if (updateResult.rows[0]) {
                console.log("user heigt weight updated")
            }
            else {
                console.log('user height and weigt in user profile not update , make sue profile is created')
            }
        }

        if (result.rowCount > 0) {
            res.status(200).json({
                message: "Weight for this user added",
                status: true,
                result: result.rows
            })
        }
        else {
            res.status(404).json({
                message: "Could not Insert",
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

exports.updateWeight = async (req, res) => {
    const client = await pool.connect();
    try {

        const weight_review_id = req.body.weight_review_id;
        const weight = req.body.weight;
        const weight_unit = req.body.weight_unit;
        const user_id = req.body.user_id;


        if (!weight_review_id) {
            return (
                res.json({
                    message: " weight_review_id must be provided",
                    status: false
                })
            )
        }

        let query = 'UPDATE user_weight SET ';
        let index = 2;
        let values = [weight_review_id];
        if (weight) {
            query += `weight = $${index} , `;
            values.push(weight)
            index++
        }
        if (user_id) {
            query += `user_id = $${index} , `;
            values.push(user_id)
            index++
        }
        if (weight_unit) {
            query += `weight_unit = $${index} , `;
            values.push(weight_unit)
            index++
        }
        query += 'WHERE weight_review_id = $1 RETURNING*'
        query = query.replace(/,\s+WHERE/g, " WHERE");
        console.log(query);

        let result = await pool.query(query, values)


        if (result.rows[0]) {

            let query = 'UPDATE users SET ';
            let index = 2;
            let values = [result.rows[0].user_id];


            if (weight) {
                query += `weight = $${index} , `;
                values.push(weight)
                index++
            }
            if (weight_unit) {
                query += `weight_unit = $${index} , `;
                values.push(weight_unit)
                index++
            }


            query += 'WHERE user_id = $1 RETURNING*'
            query = query.replace(/,\s+WHERE/g, " WHERE");
            console.log(query);
            let updateResult = await pool.query(query, values)
            if (updateResult.rows[0]) {
                console.log("user weight updated")
            }
            else {
                console.log('user weight in user profile not update , make sue profile is created')
            }
        }

        if (result.rowCount > 0) {
            res.status(200).json({
                message: "Weight for this user updated",
                status: true,
                result: result.rows
            })
        }
        else {
            res.status(404).json({
                message: "Could not Insert",
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

exports.getWeightHistory = async (req, res) => {
    const client = await pool.connect();
    try {
        const user_id = req.query.user_id;


        if (!user_id) {
            return (
                res.json({
                    message: " user_id must be provided",
                    status: false
                })
            )
        }

        const query = `SELECT 
        user_id,
        MAX(CASE WHEN weight_unit = 'gm' THEN weight/1000 ELSE weight END) AS highest_weight,
        MIN(CASE WHEN weight_unit = 'gm' THEN weight/1000 ELSE weight END) AS lowest_weight,
        MAX(created_at) AS latest_created_at,
        (SELECT weight FROM user_weight WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1) AS current_weight
      FROM user_weight
      WHERE user_id = $1
      GROUP BY user_id;
      
       `

        const result = await pool.query(query, [user_id])

        if (result.rowCount > 0) {
            res.status(200).json({
                message: "Weight history for this user fetched",
                status: true,
                result: result.rows
            })
        }
        else {
            res.status(404).json({
                message: "Could not fetch",
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

exports.getUserWeight = async (req, res) => {
    const client = await pool.connect();
    try {
        const user_id = req.query.user_id;


        if (!user_id) {
            return (
                res.json({
                    message: " user_id must be provided",
                    status: false
                })
            )
        }

        const query = `SELECT *
        FROM user_weight
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT 1;
       `

        const result = await pool.query(query, [user_id])

        if (result.rowCount > 0) {
            res.status(200).json({
                message: "Fetched",
                status: true,
                result: result.rows
            })
        }
        else {
            res.status(404).json({
                message: "Could not fetch",
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

exports.deleteWeight = async (req, res) => {
    const client = await pool.connect();
    try {
        const weight_review_id = req.query.weight_review_id;
        if (!weight_review_id) {
            return (
                res.json({
                    message: "Please Provide weight_review_id",
                    status: false
                })
            )
        }
        const query = 'DELETE FROM user_weight WHERE weight_review_id = $1 RETURNING*';
        const result = await pool.query(query, [weight_review_id]);

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

exports.getWeekilyWeightReport = async (req, res) => {
    const client = await pool.connect();
    try {
        const user_id = req.query.user_id;


        if (!user_id) {
            return (
                res.json({
                    message: " user_id must be provided",
                    status: false
                })
            )
        }

        const query = `WITH weeks AS (
  SELECT generate_series(
           date_trunc('week', date_trunc('month', current_date)),
           date_trunc('week', date_trunc('month', current_date)) + INTERVAL '3 weeks',
           INTERVAL '1 week'
         ) AS start_date
)
SELECT
  CONCAT('Week ', EXTRACT(WEEK FROM start_date) - EXTRACT(WEEK FROM date_trunc('month', current_date)) + 1) AS week,
  AVG(
    CASE
      WHEN weight_unit = 'gm' THEN weight / 1000  -- Convert grams to kilograms
      ELSE weight
    END
  ) AS average_weight_kg,
  start_date,
  start_date + INTERVAL '6 days' AS end_date
FROM
  weeks
LEFT JOIN user_weight ON date_trunc('week', created_at) = start_date AND user_id = $1 -- Replace <user_id> with the actual user ID
GROUP BY
  week,
  start_date
ORDER BY
  start_date;
       `

       const result = await pool.query(query, [user_id]);
       let data = result.rows;
       console.log(data)

        const days = await daysInThisMonth();
        console.log(days);
        let daysLeft = days - 28;
        console.log(daysLeft);

        let record;
        if (daysLeft > 0) {
            const date = new Date();
            let start_date = new Date(date.setDate(29));
            console.log(start_date);
            let endDate = new Date(date.setDate(28 + daysLeft));
            console.log(endDate)

            const foundLastDaysQuery = `SELECT
                    AVG(
                     CASE
                     WHEN weight_unit = 'gm' THEN weight / 1000  -- Convert grams to kilograms
                     ELSE weight
                    END
                    ) AS average_weight_kg
                    FROM
                  user_weight
                    WHERE
                     created_at >= $1::date AND created_at <= $2::date AND user_id = $3 -- Replace with your desired start and end dates
                    GROUP BY
                  date_trunc('week', created_at);
      `

      

            const foundResut = await pool.query(foundLastDaysQuery, [start_date, endDate , user_id]);
            console.log(foundResut.rows)
            let lastRecord = 0;
            if(foundResut.rows[0]){
                if(foundResut.rows[0].average_weight_kg){
                    lastRecord = foundResut.rows[0].average_weight_kg;
                }
                else{
                    lastRecord = 0;
                }
            }
            

            //main  query
            const result = await pool.query(query, [user_id])
            let data = result.rows;
             record = [...data]
            record = JSON.parse(JSON.stringify(record))

            for (let i = 0; i < record.length; i++) {
                const element = record[i];
                if (element.average_weight_kg == null) {
                    element.average_weight_kg = 0;
                }

            }

            for (let i = 0; i < record.length; i++) {
                const element = record[i];
                if (element.week == 'Week 4') {
                    if (lastRecord != 0 && element.average_weight_kg != 0) {
                        element.average_weight_kg = (element.average_weight_kg + lastRecord) / 2;
                    }
                    if (lastRecord != 0 && element.average_weight_kg == 0) {
                        element.average_weight_kg = lastRecord;
                    }

                    if (element.end_date) {
                        element.end_date = endDate;
                    }
                }

            }
        }
        else{
            const result = await pool.query(query, [user_id]);
            let data = result.rows;
            record = [...data]
            record = JSON.parse(JSON.stringify(record))

            for (let i = 0; i < record.length; i++) {
                const element = record[i];
                if (element.average_weight_kg == null) {
                    element.average_weight_kg = 0;
                }

            }
        }


       


        if (record) {
            res.status(200).json({
                message: "Fetched",
                status: true,
                result: record
            })
        }
        else {
            res.status(404).json({
                message: "Could not fetch",
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


exports.addheight = async (req, res) => {
    const client = await pool.connect();
    try {

        const user_id = req.body.user_id;
        const height = req.body.height;
        const height_unit = req.body.height_unit;


        if (!height || !user_id || !height_unit) {
            return (
                res.json({
                    message: " height , height_unit and user_id must be provided",
                    status: false
                })
            )
        }

        let insertQuery = 'INSERT INTO user_height (user_id , height , height_unit) VALUES ($1, $2 , $3) RETURNING*'
        const result = await pool.query(insertQuery, [
            user_id ? user_id : null,
            height ? height : null,
            height_unit ? height_unit : null,
        ])

        if (result.rows[0]) {
            let updateQuery = 'UPDATE users SET height = $1 , height_unit = $2 WHERE user_id = $3 RETURNING*'
            let updateResult = await pool.query(updateQuery, [
                height ? height : null,
                height_unit ? height_unit : null,
                user_id ? user_id : null
            ]);

            if (updateResult.rows[0]) {
                console.log("user heigt height updated")
            }
            else {
                console.log('user height in user profile not update , make sue profile is created')
            }
        }

        if (result.rowCount > 0) {
            res.status(200).json({
                message: "height for this user added",
                status: true,
                result: result.rows
            })
        }
        else {
            res.status(404).json({
                message: "Could not Insert",
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

exports.updateheight = async (req, res) => {
    const client = await pool.connect();
    try {

        const height_review_id = req.body.height_review_id;
        const height = req.body.height;
        const height_unit = req.body.height_unit;
        const user_id = req.body.user_id;


        if (!height_review_id) {
            return (
                res.json({
                    message: " height_review_id must be provided",
                    status: false
                })
            )
        }

        let query = 'UPDATE user_height SET ';
        let index = 2;
        let values = [height_review_id];
        if (height) {
            query += `height = $${index} , `;
            values.push(height)
            index++
        }
        if (user_id) {
            query += `user_id = $${index} , `;
            values.push(user_id)
            index++
        }
        if (height_unit) {
            query += `height_unit = $${index} , `;
            values.push(height_unit)
            index++
        }
        query += 'WHERE height_review_id = $1 RETURNING*'
        query = query.replace(/,\s+WHERE/g, " WHERE");
        console.log(query);

        let result = await pool.query(query, values)


        if (result.rows[0]) {

            let query = 'UPDATE users SET ';
            let index = 2;
            let values = [result.rows[0].user_id];


            if (height) {
                query += `height = $${index} , `;
                values.push(height)
                index++
            }
            if (height_unit) {
                query += `height_unit = $${index} , `;
                values.push(height_unit)
                index++
            }


            query += 'WHERE user_id = $1 RETURNING*'
            query = query.replace(/,\s+WHERE/g, " WHERE");
            console.log(query);
            let updateResult = await pool.query(query, values)
            if (updateResult.rows[0]) {
                console.log("user height updated")
            }
            else {
                console.log('user height in user profile not update , make sue profile is created')
            }
        }

        if (result.rowCount > 0) {
            res.status(200).json({
                message: "height for this user updated",
                status: true,
                result: result.rows
            })
        }
        else {
            res.status(404).json({
                message: "Could not Insert",
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

exports.getheightHistory = async (req, res) => {
    const client = await pool.connect();
    try {
        const user_id = req.query.user_id;


        if (!user_id) {
            return (
                res.json({
                    message: " user_id must be provided",
                    status: false
                })
            )
        }

        const query = `SELECT 
        user_id,
        MAX(CASE WHEN height_unit = 'ft' THEN height*12 ELSE height END) AS highest_height,
        MIN(CASE WHEN height_unit = 'ft' THEN height*12 ELSE height END) AS lowest_height,
        MAX(created_at) AS latest_created_at,
        (SELECT height FROM user_height WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1) AS current_height
      FROM user_height
      WHERE user_id = $1
      GROUP BY user_id;
      
       `

        const result = await pool.query(query, [user_id])

        if (result.rowCount > 0) {
            res.status(200).json({
                message: "height history for this user fetched",
                status: true,
                result: result.rows
            })
        }
        else {
            res.status(404).json({
                message: "Could not fetch",
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

exports.getUserheight = async (req, res) => {
    const client = await pool.connect();
    try {
        const user_id = req.query.user_id;


        if (!user_id) {
            return (
                res.json({
                    message: " user_id must be provided",
                    status: false
                })
            )
        }

        const query = `SELECT *
        FROM user_height
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT 1;
       `

        const result = await pool.query(query, [user_id])

        if (result.rowCount > 0) {
            res.status(200).json({
                message: "Fetched",
                status: true,
                result: result.rows
            })
        }
        else {
            res.status(404).json({
                message: "Could not fetch",
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

exports.deleteheight = async (req, res) => {
    const client = await pool.connect();
    try {
        const height_review_id = req.query.height_review_id;
        if (!height_review_id) {
            return (
                res.json({
                    message: "Please Provide height_review_id",
                    status: false
                })
            )
        }
        const query = 'DELETE FROM user_height WHERE height_review_id = $1 RETURNING*';
        const result = await pool.query(query, [height_review_id]);

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

async function daysInThisMonth() {
    var now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
}