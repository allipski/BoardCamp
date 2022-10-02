import { connection } from "../database/database.js";
import Joi from "joi";

async function newDataCustomerValidation(req, res, next) {
    const cpf = req.body.cpf;

    const existCpf = await connection.query(`SELECT * FROM customers WHERE cpf=$1;`, [cpf]);

    if (existCpf.rows[0] !== undefined) {
        return res.sendStatus(409);
    }

    const customerSchema = Joi.object({
        name: Joi.string().required().trim().min(1),
        phone: Joi.string().min(10).max(11).pattern(/^[0-9]+$/).required(),
        cpf: Joi.string().length(11).pattern(/^[0-9]+$/).required(),
        birthday: Joi.date()
      });
    
      const validation = customerSchema.validate(
        req.body,
        { abortEarly: false }
      );
    
      if (validation.error) {
        const errors = validation.error.details.map((error) => error.message);
        return res.status(400).send(errors);
      }

next();

}

export { newDataCustomerValidation };