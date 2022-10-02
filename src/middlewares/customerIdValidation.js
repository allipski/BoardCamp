import { connection } from "../database/database.js";

async function customerIdValidation(req, res, next) {
    const { id: id } = req.params
    const existId = await connection.query(`SELECT * FROM customers WHERE id=$1;`, [id]);

    if (existId.rows[0] === undefined) {
        return res.sendStatus(404);
    }

    next();
}

export { customerIdValidation };