import express from 'express';
import { categoriesValidation } from '../middlewares/categoriesValidation.js';
import { postCategory, getCategories } from '../controllers/categoriesController.js';

const categoriesRouter = express.Router();

categoriesRouter.post('/categories', categoriesValidation, postCategory);

categoriesRouter.get('/categories', getCategories);

export default categoriesRouter;