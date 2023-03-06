// @ts-nocheck
import { GamePlan } from "../db/dbConnection.js";
import { Game } from "../db/dbConnection.js";
import ActiveGame from "../classes/ActiveGame.js";

let client_url = "http://localhost:5173";
if (process.env.NODE_ENV === "production") {
  client_url = "http://quizgame.eu-4.evennode.com/";
}

let currentGame;
//import moment from "moment";

//ENDPOINTS

//activate game
//join game
//accept player
//start game
//end game

//check game time //or should this be streamed to client via WS?
//check answer
//check ranking

//req -> gamePlan id, res -> joining link

export async function activateGame(req, res) {
  try {
    const { gamePlanId } = req.body;
    let foundGamePlan = await GamePlan.findOne({ _id: gamePlanId });
    if (foundGamePlan) {
      //check if a game is runnning with the same game plan and owner, if not continue
      let foundGame = await Game.findOne({
        gameOwnerId: foundGamePlan.ownerId,
      });
      if (!foundGame) {
        currentGame = new ActiveGame(foundGamePlan);
        //make this link a QR code for the game master in the client
        res.status(200).send({
          //message: "join link here",
          joinUrl: client_url + "/start/" + currentGame.gameId,
          //this could be a separate endpoint in case the owner needs
          //to get the link again without relaunching the game
        });
      } else {
        res
          .status(400)
          .send({ error: "The user is already hosting this game" });
      }
    } else {
      res.status(404).send({ error: "Game Plan not found" });
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
}

export async function shareJoinLink(req, res) {
  try {
    const { gameId } = req.body;
    let foundGame = await Game.findOne({ gameId: gameId });
    if (foundGame) {
      res.status(200).send({
        joinUrl: client_url + "/start/" + foundGame.gameId,
        //this could be a separate endpoint in case the owner needs
        //to get the link again without relaunching the game
      });
    } else {
      res.status(404).send({ error: "Game not found" });
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
}

//Fix this
export async function playerJoin(req, res) {
  const { name } = req.body;
  const { gameId } = req.body;
  try {
    if (name && gameId) {
      //try to get an active game with the id and register a name on it

      console.log(`name: ${name} and gameId: ${gameId} received`); //add player instance with given name to ActiveGame

      res.status(200).send({
        message:
          "all good: SEND GAME ID AND NAME, SO FE CAN SAVE TO STORE AND PUSH MAPVIEW",
      });
      //res.redirect(client_url + "/map-view"); //  "/gamestart" or something
    } else {
      res.status(404).send({ error: "No active game with this Id" });
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
}
