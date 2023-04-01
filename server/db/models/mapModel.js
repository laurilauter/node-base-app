import mongoose from "mongoose";
const Schema = mongoose.Schema;

const MapSchema = new Schema({
  fileName: {
    type: String,
    required: true,
  },
  file: {
    data: Buffer,
    contentType: String,
  },
  gamePlanId: {
    type: String,
    required: true,
  },
});

const GameMap = mongoose.model("GameMap", MapSchema);

export default GameMap;
