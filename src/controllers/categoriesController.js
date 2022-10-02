import { connection } from '../database/database.js'

async function postCategory(req, res) {
    const { name: name } = req.body;
    try {
        await connection.query(`INSERT INTO categories (name) VALUES($1);`, [name]).then(result => {return res.sendStatus(201)});
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

export { postCategory };