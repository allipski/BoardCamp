import express from 'express';
import { categoriesValidation } from '../middlewares/categoriesValidation.js';
import { postCategory } from '../controllers/categoriesController.js';

const categoriesRouter = express.Router();

categoriesRouter.post('/categories', categoriesValidation, postCategory);

export default categoriesRouter;