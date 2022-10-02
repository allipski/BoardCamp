import { connection } from '../database/database.js'

async function categoriesValidation(req, res, next) {
const { name: name } = req.body;

if (name === '' || name === undefined || name === null) {
    return res.sendStatus(400);
}

const existName = await connection.query(`SELECT * FROM categories WHERE name=$1;`, [name]);
console.log(existName.rows[0])

if (existName.rows[0] !== undefined) {
    return res.sendStatus(409);
} 

next();

}

export { categoriesValidation };