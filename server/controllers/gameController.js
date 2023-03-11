// @ts-nocheck
import { GamePlan } from "../db/dbConnection.js";
import { Game } from "../db/dbConnection.js";
import { Player } from "../db/dbConnection.js";
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
      currentGame = new ActiveGame(foundGamePlan);
      //make this link a QR code for the game master in the client
      console.log("Game activated");
      res.status(200).send({
        joinUrl: client_url + "/#/player-start/" + currentGame.gameCode,
      });
    } else {
      res.status(404).send({ error: "Game Plan not found" });
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
}

export async function shareJoinLink(req, res) {
  try {
    const { gameCode } = req.body;
    let foundGame = await Game.findOne({ gameCode: gameCode });
    if (foundGame) {
      res.status(200).send({
        joinUrl: client_url + "/#/player-start/" + currentGame.gameCode,
      });
    } else {
      res.status(404).send({ error: "Game not found" });
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
}

export async function getGame(req, res) {
  try {
    const filter = { gameCode: req.params.id };
    let currentGame = await Game.findOne(filter);
    if (currentGame) {
      if (currentGame.gameStatus === "activated") {
        res.status(200).send({ currentGame: currentGame });
      } else {
        res.status(400).send({ error: "Game not active" });
      }
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
  const { gameCode } = req.body;
  console.log("name", name);
  console.log("gameCode", gameCode);
  try {
    if (name && gameCode) {
      const newPlayer = {
        gameCode: gameCode,
        name: name,
        pointsTotal: 0,
        markersFound: 0,
      };

      const player = await Player.create(newPlayer);
      console.log("player", player);

      if (player) {
        const filter = { gameCode: gameCode };
        const update = {
          $push: {
            players: player._id,
          },
        };
        const options = { sort: { _id: 1 }, new: true };
        const currentGame = await Game.findOneAndUpdate(
          filter,
          update,
          options
        );
        console.log("player added to currentGame ", currentGame.players);
      }
      res.status(200).send({
        player: player,
      });
    } else {
      res.status(404).send({ error: "No active game with this Id" });
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
}

export async function getPlayers(req, res) {
  try {
    const filter = { gameCode: req.params.id };
    const players = await Player.find(filter);
    res.status(200).send({ players: players });
  } catch (error) {
    res.status(500).send({ error: error });
  }
}

//BROKEN
export async function endGame(req, res) {
  try {
    const { gameId } = req.body;
    const filter = { gameCode: req.params.id };
    const update = {
      gameStatus: "archived",
    };
    const options = { sort: { _id: 1 }, new: true };
    const endedGame = await Game.findOneAndUpdate(filter, update, options);
    res.status(200).send({ message: "game ended" });
  } catch (error) {
    res.status(500).send({ error: error });
  }
}
