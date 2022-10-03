import express from 'express';
import { rentalStartValidation } from '../middlewares/rentalStartValidation.js';
import { postRent, getRentals } from '../controllers/rentalsController.js';

const rentalsRouter = express.Router();

rentalsRouter.post('/rentals', rentalStartValidation, postRent);
rentalsRouter.get('/rentals', getRentals);

export default rentalsRouter;