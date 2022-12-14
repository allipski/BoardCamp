import { connection } from "../database/database.js";
import dayjs from "dayjs";

async function postRent(req, res) {
  const {
    customerId: customerId,
    gameId: gameId,
    daysRented: daysRented,
  } = req.body;

  const today = dayjs().format("YYYY-MM-DD");
  const returnDate = null;
  const delayFee = null;
  const originalPrice = await connection
    .query(`SELECT "pricePerDay" FROM games WHERE id=$1;`, [gameId])
    .then((result) => result.rows[0].pricePerDay * daysRented);

  try {
    await connection
      .query(
        `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES($1, $2, $3, $4, $5, $6, $7);`,
        [
          customerId,
          gameId,
          today,
          daysRented,
          returnDate,
          originalPrice,
          delayFee,
        ]
      )
      .then((result) => {
        return res.sendStatus(201);
      });
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

async function getRentals(req, res) {
  const customerId = req.query.customerId;
  const gameId = req.query.gameId;
  
  if (customerId !== undefined && gameId === undefined) {
    try {
      await connection.query(
        `SELECT rentals.*, 
        JSON_BUILD_OBJECT('id', customers.id,'name', customers.name) AS customer, 
        JSON_BUILD_OBJECT('id', games.id, 'name', games.name, 'categoryId', games."categoryId",'categoryName', categories.name) AS game
          FROM rentals
        JOIN games ON rentals."gameId"=games.id
        JOIN customers ON rentals."customerId"=customers.id 
        JOIN categories ON games."categoryId"=categories.id
        WHERE rentals."customerId"=$1;
      `, [customerId]).then((result) => {return res.send(result.rows)})  
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }

  if (gameId !== undefined & customerId === undefined) {
    try {
      await connection.query(
        `SELECT rentals.*, 
        JSON_BUILD_OBJECT('id', customers.id,'name', customers.name) AS customer, 
        JSON_BUILD_OBJECT('id', games.id, 'name', games.name, 'categoryId', games."categoryId",'categoryName', categories.name) AS game
          FROM rentals
        JOIN games ON rentals."gameId"=games.id
        JOIN customers ON rentals."customerId"=customers.id 
        JOIN categories ON games."categoryId"=categories.id
        WHERE rentals."gameId"=$1;
      `, [gameId]).then((result) => {return res.send(result.rows)})  
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }

  if (gameId !== undefined & customerId !== undefined) {
    try {
      await connection.query(
        `SELECT rentals.*, 
        JSON_BUILD_OBJECT('id', customers.id,'name', customers.name) AS customer, 
        JSON_BUILD_OBJECT('id', games.id, 'name', games.name, 'categoryId', games."categoryId",'categoryName', categories.name) AS game
          FROM rentals
        JOIN games ON rentals."gameId"=games.id
        JOIN customers ON rentals."customerId"=customers.id 
        JOIN categories ON games."categoryId"=categories.id
        WHERE rentals."gameId"=$1 AND rentals."customerId"=$2;
      `, [gameId, customerId]).then((result) => {return res.send(result.rows)})  
    } catch (error) {
      return res.status(500).send(error.message);
    }
  }

  try {
    await connection.query(
      `SELECT rentals.*, 
      JSON_BUILD_OBJECT('id', customers.id,'name', customers.name) AS customer, 
      JSON_BUILD_OBJECT('id', games.id, 'name', games.name, 'categoryId', games."categoryId",'categoryName', categories.name) AS game
        FROM rentals
      JOIN games ON rentals."gameId"=games.id
      JOIN customers ON rentals."customerId"=customers.id 
      JOIN categories ON games."categoryId"=categories.id;
    `).then((result) => {return res.send(result.rows)})  
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

async function finishRent(req, res) {
  const { id: id } = req.params;
  const today = dayjs().format().substring(0, 10);

  try {
    const aluguel = await connection.query(`SELECT "daysRented", "rentDate", "gameId" FROM rentals WHERE id=$1;`, [id])

    await connection.query(`UPDATE rentals SET "returnDate"=$1 WHERE id=$2;`,[today, id])

    const rented = aluguel.rows[0].rentDate.toISOString().substring(0, 10);

    const firstDate = new Date(today);
    const secondDate = new Date(rented);
    const diff = (firstDate - secondDate)/(1000*3600*24);

    const pricePerDay = await connection.query(`SELECT "pricePerDay" FROM games WHERE id=$1;`,[aluguel.rows[0].gameId])

    const multa = (diff - aluguel.rows[0].daysRented)*pricePerDay;

    if(aluguel.rows[0].daysRented < diff) {
      await connection.query(`UPDATE rentals SET "delayFee"=$1 WHERE id=$2;`,[multa, id])
    }
    return res.sendStatus(200);

  } catch (error) {
    return res.status(500).send(error.message);
  }
}

async function deleteRent(req, res) {
  const { id: id } = req.params;

  try {
    await connection.query(`DELETE FROM rentals WHERE id=$1;`,[id])
    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export { postRent, getRentals, finishRent, deleteRent };
