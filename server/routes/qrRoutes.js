import express from "express";
const qrRouter = express.Router();
import * as qrController from "../controllers/qrController.js";
import bodyParser from "body-parser";
qrRouter.use(bodyParser.json());
qrRouter.use(bodyParser.urlencoded({ extended: false }));

// qrRouter.post("/activate", qrController.activateGame);

// qrRouter.get("/start/:id", qrController.startGame);

export default qrRouter;
