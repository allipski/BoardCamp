import { connection } from "../database/database.js";

async function postCustomer(req, res) {
  const { name: name, phone: phone, cpf: cpf, birthday: birthday } = req.body;

  try {
    await connection
      .query(
        `INSERT INTO customers (name, phone, cpf, birthday) VALUES($1, $2, $3, $4);`,
        [name, phone, cpf, birthday]
      )
      .then((result) => {
        return res.sendStatus(201);
      });
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

async function putCustomer(req, res) {}

async function getCustomers(req, res) {
  const { cpf: cpf } = req.query;
  try {
    if (cpf === undefined) {
      await connection.query(`SELECT * FROM customers;`).then((result) => {
        const customers = result.rows.map((item) => {
          Object.keys(item).map((key) => {
            console.log(item);
            if (key === "birthday") {
              item[key] = item[key].toISOString().substring(0, 10);
            }
          });
          return item;
        });
        return res.send(customers);
      });
    } else {
      await connection
        .query(`SELECT * FROM customers WHERE cpf LIKE $1;`, [`${cpf}%`])
        .then((result) => {
          return res.send(result.rows);
        });
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

async function getCustomerById(req, res) {
    const { id: id } = req.params

    try {
        await connection.query(`SELECT * FROM customers WHERE id=$1`, [id]).then(result => {return res.send(result.rows)})
    } catch (error) {
        return res.status(500).send(error.message);
    }

}

export { postCustomer, putCustomer, getCustomers, getCustomerById };
