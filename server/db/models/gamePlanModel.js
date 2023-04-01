import mongoose from "mongoose";
const Schema = mongoose.Schema;

const GamePlanSchema = new Schema({
  gameTitle: { type: String, required: true },
  ownerId: { type: String, required: true },
  markers: [{ type: String }],
});

const GamePlan = mongoose.model("GamePlan", GamePlanSchema);

export default GamePlan;
