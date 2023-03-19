import express from "express";
const gameRouter = express.Router();
import * as gameController from "../controllers/gameController.js";
import bodyParser from "body-parser";
gameRouter.use(bodyParser.json());
gameRouter.use(bodyParser.urlencoded({ extended: false }));

//create a game
gameRouter.post("/activate", gameController.activateGame);

gameRouter.get("/start/:id", gameController.startGame);

gameRouter.post("/sharejoinlink", gameController.shareJoinLink);

gameRouter.post("/playerjoin", gameController.playerJoin);

gameRouter.get("/info/:id", gameController.getGame);

gameRouter.get("/active/:id", gameController.getGames);

gameRouter.get("/players/:id", gameController.getPlayers);

gameRouter.get("/player/:id", gameController.getPlayer);

gameRouter.patch("/player/:id", gameController.updatePlayer);

gameRouter.get("/end/:id", gameController.endGame);

gameRouter.get("/cancel/:id", gameController.cancelGame);

export default gameRouter;
