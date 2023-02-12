import express from "express";
const gameRouter = express.Router();
import * as gameController from "../controllers/gameController.js";
import bodyParser from "body-parser";
gameRouter.use(bodyParser.json());
gameRouter.use(bodyParser.urlencoded({ extended: false }));

//create a game
gameRouter.post("/activate", gameController.activateGame);

gameRouter.post("/sharejoinlink", gameController.shareJoinLink);

gameRouter.post("/playerjoin", gameController.playerJoin);

export default gameRouter;
