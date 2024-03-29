import mongoose from "mongoose";
import QrCode from "./qrCodeModel.js";
const Schema = mongoose.Schema;

const MarkerShema = new Schema({
  gamePlanId: { type: String, required: true },
  title: { type: String, required: true },
  content: {
    position: {
      x: { type: Number },
      y: { type: Number },
    },
    qrcode: { type: QrCode.schema },
    quiz: {
      question: { type: String, required: true },
      answers: [
        {
          type: new Schema({
            text: { type: String, required: true },
            isCorrect: { type: Boolean, default: false },
          }),
        },
      ],
    },
  },
});

const Marker = mongoose.model("Marker", MarkerShema);

export default Marker;
