import { connection } from '../database/database.js'

async function gamesValidation(req, res, next) {
    const {
        name: name,
        image: image,
        stockTotal: stockTotal,
        categoryId: categoryId,
        pricePerDay: pricePerDay,
      } = req.body;

const existId = await connection.query(`SELECT * FROM categories WHERE id=$1;`, [categoryId]);

if (name === '' || name === undefined || name === null || stockTotal <= 0 || pricePerDay <= 0 || existId.rows[0] === undefined){
    return res.sendStatus(400);
}

const existName = await connection.query(`SELECT * FROM games WHERE name=$1;`, [name]);

if (existName.rows[0] !== undefined) {
    return res.sendStatus(409);
} 

next();

}

export { gamesValidation };