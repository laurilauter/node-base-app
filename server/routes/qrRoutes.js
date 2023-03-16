import express from "express";
const qrRouter = express.Router();
import * as qrController from "../controllers/qrController.js";
import bodyParser from "body-parser";
qrRouter.use(bodyParser.json());
qrRouter.use(bodyParser.urlencoded({ extended: false }));

qrRouter.post("/create", qrController.createCode);

//by code id
qrRouter.get("/code/:id", qrController.getCode);

//by ownerId
qrRouter.get("/list/:id", qrController.getCodes);

//patch a code
qrRouter.patch("/update/:id", qrController.updateCode);

qrRouter.delete("/delete/:id", qrController.deleteCode);

export default qrRouter;
