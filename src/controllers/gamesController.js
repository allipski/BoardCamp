import { connection } from "../database/database.js";

async function postGame(req, res) {
  const {
    name: name,
    image: image,
    stockTotal: stockTotal,
    categoryId: categoryId,
    pricePerDay: pricePerDay,
  } = req.body;

  try {
    await connection
      .query(
        `INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES($1, $2, $3, $4, $5);`,
        [name, image, stockTotal, categoryId, pricePerDay]
      )
      .then((result) => {
        return res.sendStatus(201);
      });
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

async function getGames(req, res) {
  const { name: name } = req.query;

  try {
    if(name === undefined){
        await connection.query(`SELECT * FROM games;`).then((result) => {
            return res.send(result.rows);
          });
    } else {
        await connection.query(`SELECT * FROM games WHERE LOWER(name) LIKE LOWER($1);`, [`${name}%`]).then((result) => {
            return res.send(result.rows);
          });
    }
    
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export { postGame, getGames };
