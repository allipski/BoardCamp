import { connection } from "../database/database.js";

async function rentalDeleteValidation(req, res, next) {
    const { id: id } = req.params;
    
    const existId = await connection.query(`SELECT * FROM rentals WHERE id=$1;`, [id]);

    if (existId.rows[0] === undefined) {
        return res.sendStatus(404);
    }

    const alreadyFinished = await connection.query(`SELECT * FROM rentals WHERE id=$1 AND "returnDate" IS NULL;`, [id]);

    if (alreadyFinished.rows[0] === undefined) {
        return res.sendStatus(400);
    }

next();
}

export { rentalDeleteValidation };
