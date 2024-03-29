import GamePlan from "./gamePlanModel.js";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const gameSchema = new Schema(
  {
    gamePlan: { type: GamePlan.schema },
    gameCode: { type: String, required: true },
    gameOwnerId: { type: String, required: true },
    gameStatus: {
      type: String,
      enum: ["activated", "started", "archived"],
      required: true,
    },
    gameStartTime: { type: Date },
    gameEndTime: { type: Date },
    players: [{ type: String }],
  },
  { timestamps: true }
);

const Game = mongoose.model("Game", gameSchema);

export default Game;
