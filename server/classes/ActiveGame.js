// @ts-nocheck
import { Game, GamePlan } from "../db/dbConnection.js";
import crypto from "crypto";
import moment from "moment";

class ActiveGame {
  gamePlan;
  gameCode;
  gameOwnerId;
  gameStatus;
  gameStartTime;
  gameEndTime;
  players = [];

  constructor(gamePlan, gameEndTime) {
    this.gamePlan = gamePlan;
    const n = crypto.randomInt(1000, 10000);
    this.gameCode = n.toString().padStart(4, "0");
    this.gameOwnerId = gamePlan.ownerId;
    this.gameStatus = "activated";
    this.gameStartTime = null;
    this.gameEndTime = gameEndTime;
    this.saveActiveGame(gamePlan);
  }

  get getGameStatus() {
    return this.gameStatus;
  }

  get getActiveGameCode() {
    return this.gameCode;
  }

  get getActiveGameOwnerId() {
    return this.gameOwnerId;
  }

  //OBSOLETE - this is already in gameController
  // async startGame() {
  //   const filter = { gameCode: this.gameCode };
  //   const now = moment();
  //   const update = {
  //     gameStartTime: now,
  //     gameStatus: "started",
  //   };
  //   const options = { sort: { _id: 1 }, new: true };
  //   try {
  //     await Game.findOneAndUpdate(filter, update, options);
  //     this.gameStatus = "started";
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  //saves the ActiveGame instance in DB upon creation
  async saveActiveGame(gamePlan) {
    const newGameData = {
      gamePlan: gamePlan,
      gameCode: this.gameCode,
      gameOwnerId: this.gameOwnerId,
      gameStartTime: this.gameStartTime,
      gameEndTime: this.gameEndTime,
      gameStatus: this.gameStatus,
      players: this.players,
    };
    try {
      await Game.create(newGameData);
    } catch (error) {
      console.log(error);
    }
  }
}

export default ActiveGame;
