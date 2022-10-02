import express from 'express';
import { customerIdValidation } from '../middlewares/customerIdValidation.js';
import { newDataCustomerValidation } from '../middlewares/newDataCustomerValidation.js';
import { postCustomer, getCustomers, putCustomer, getCustomerById } from '../controllers/customersController.js';

const customersRouter = express.Router();

customersRouter.post('/customers', newDataCustomerValidation, postCustomer);
customersRouter.put('/customers', newDataCustomerValidation, putCustomer);
customersRouter.get('/customers', getCustomers);
customersRouter.get('/customers/:id', customerIdValidation, getCustomerById);

export default customersRouter;