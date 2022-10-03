import express from 'express';
import { rentalStartValidation } from '../middlewares/rentalStartValidation.js';
import { rentalEndValidation } from '../middlewares/rentalEndValidation.js';
import { rentalDeleteValidation } from '../middlewares/rentalDeleteValidation.js';
import { postRent, getRentals, finishRent, deleteRent } from '../controllers/rentalsController.js';

const rentalsRouter = express.Router();

rentalsRouter.post('/rentals', rentalStartValidation, postRent);
rentalsRouter.post('/rentals/:id/return', rentalEndValidation, finishRent);
rentalsRouter.get('/rentals', getRentals);
rentalsRouter.delete('/rentals/:id', rentalDeleteValidation, deleteRent);

export default rentalsRouter;