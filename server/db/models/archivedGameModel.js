import mongoose from "mongoose";
import GamePlan from "./gamePlanModel.js";
import Player from "./playerModel.js";
const Schema = mongoose.Schema;

const archivedGameSchema = new Schema({
  gamePlan: { type: GamePlan.schema },
  gameCode: { type: String, required: true },
  gameOwnerId: { type: String, required: true },
  gameStartTime: { type: Date, required: true },
  gameEndTime: { type: Date, required: true },
  playersStats: [{ type: Player.schema }],
});

const ArchivedGame = mongoose.model("ArchivedGame", archivedGameSchema);

export default ArchivedGame;
