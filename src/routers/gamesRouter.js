import express from 'express';
import { gamesValidation } from '../middlewares/gamesValidation.js';
import { postGame, getGames } from '../controllers/gamesController.js';

const gamesRouter = express.Router();

gamesRouter.post('/games', gamesValidation, postGame);

gamesRouter.get('/games', getGames);

export default gamesRouter;