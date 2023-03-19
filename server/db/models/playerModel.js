import mongoose from "mongoose";
const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
  gameCode: { type: String, required: true },
  name: { type: String, required: true },
  pointsTotal: { type: Number, required: true },
  markersFound: [{ type: String }],
});

const Player = mongoose.model("Player", PlayerSchema);

export default Player;
