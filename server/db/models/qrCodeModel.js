import mongoose from "mongoose";
const Schema = mongoose.Schema;

const QrCodeSchema = new Schema({
  qrCodeTitle: { type: String, required: true },
  ownerId: { type: String, required: true },
});

const QrCode = mongoose.model("QrCode", QrCodeSchema);

export default QrCode;
