import express from "express";
const archiveRouter = express.Router();
import * as archiveController from "../controllers/archiveController.js";
import bodyParser from "body-parser";
archiveRouter.use(bodyParser.json());
archiveRouter.use(bodyParser.urlencoded({ extended: false }));

archiveRouter.get("/list/:id", archiveController.listMyGames);

archiveRouter.get("/:id", archiveController.getGame);

archiveRouter.get("/delete/:id", archiveController.deleteGame);

export default archiveRouter;
