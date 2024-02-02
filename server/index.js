import express from "express";
import session from "express-session";
import mongoose from "mongoose";

import userRouter from "./routes/userRoutes.js";
import sessionsRouter from "./routes/sessionsRoutes.js";
import gamePlanRouter from "./routes/gamePlanRoutes.js";
import gameRouter from "./routes/gameRoutes.js";
import qrRouter from "./routes/qrRoutes.js";
import archiveRouter from "./routes/archiveRoutes.js";

import MongoStore from "connect-mongo";
import cors from "cors";
import cookieParser from "cookie-parser";

import * as dotenv from "dotenv";
dotenv.config();
const port = process.env.PORT || 3000;
const secret = process.env.SESSION_SECRET;
const clientUrlProd = process.env.VITE_BASE_URL_PROD;

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import http from "http";
import { WebSocketServer } from "ws";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);
  ws.on("message", function message(data, isBinary) {
    console.log("Server received a message");
    wss.clients.forEach(function (client) {
      console.log("client._readyState", client.readyState);
      const receivedData = JSON.parse(data);
      console.log("data arrived at server ", receivedData);
      client.send(data, { binary: isBinary });
    });
  });
  const data = { event: "Hi from server" };
  ws.send(JSON.stringify(data));

  function sendPing() {
    const ping = () => {
      const pingdata = { event: "ping" };
      ws.send(JSON.stringify(pingdata));
    };
    const nIntervId = setInterval(ping, 10000);
  }
  sendPing();
});

app.use(express.json());
app.use(cookieParser());

//adjust client url for cors
let client_url = "http://localhost:5173";
if (process.env.NODE_ENV === "production") {
  client_url = clientUrlProd;
}

console.log("client_url: ", client_url);

const corsOptions = {
  origin: client_url,
  credentials: true,
};
app.use(cors(corsOptions));

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("Connected to MongoDB");
});

app.use(
  session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: false, //'lax' or 'strict'
      secure: false, //true in prod
      //maxAge: 10 * 60000, // 10 min
      maxAge: 7 * 24 * 3600 * 1000, //a week
      httpOnly: true,
    },
    rolling: true,
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
  })
);

//changes cookie so it gets renewed
app.use(function (req, res, next) {
  req.session.nowInMinutes = Math.floor(Date.now() / 60e3);
  next();
});

app.set("trust proxy", 1); // trust first proxy in production

app.use("/user", userRouter);
app.use("/sessions", sessionsRouter);
app.use("/game-plan", gamePlanRouter);
app.use("/game", gameRouter);
app.use("/qr", qrRouter);
app.use("/archive", archiveRouter);

//serving public files, img and such
app.use("/", express.static(path.join(__dirname, "../public")));
app.use("/", express.static(path.join(__dirname, "../dist")));

//serv static FE for all visitors
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

server.listen(port, () => {
  console.log(`${process.env.NODE_ENV} server listening on: ${port}`);
});
