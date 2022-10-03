import { connection } from "../database/database.js";

async function rentalStartValidation(req, res, next) {
  const {
    customerId: customerId,
    gameId: gameId,
    daysRented: daysRented,
  } = req.body;

  const existCustomer = await connection.query(
    `SELECT * FROM customers WHERE id=$1;`,
    [customerId]
  );

  const existGame = await connection.query(`SELECT * FROM games WHERE id=$1;`, [gameId]);

  const currentRentals = await connection.query(
    `SELECT * FROM rentals WHERE "gameId"=$1;`,
    [gameId]
  );

  const currentStock = await connection.query(
    `SELECT "stockTotal" FROM games WHERE id=$1;`,
    [gameId]
  );

  if (
    existCustomer.rows[0] === undefined ||
    existGame.rows[0] === undefined ||
    currentRentals.rows.length >= currentStock.rows[0].stockTotal ||
    daysRented <= 0
  ) {
    return res.sendStatus(400);
  }

  next();
}

export { rentalStartValidation };
