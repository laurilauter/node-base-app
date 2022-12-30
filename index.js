const express = require("express");
const app = express();
app.use(express.json());
const port = process.env.PORT;
const mongoose = require("mongoose");
require("dotenv").config();
const LOCAL_URI = "mongodb://localhost:27017/node-test"; //for local debugging
console.log("prod_uri ", process.env.PROD_URI);
const Schema = mongoose.Schema;

const namesSchema = new Schema({
  name: String,
});

const Names = mongoose.model("Names", namesSchema);

mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.PROD_URI)
  .then(() => {
    console.log("Successfully connected to the DB");
  })
  .catch((e) => {
    console.log(e);
  });

app.get("/", (req, res) => {
  res.json({ message: "Node server root" });
});

app.post("/data", async (req, res) => {
  console.log("req.body ", req.body);
  try {
    const name = await Names.create({
      name: req.body.name,
    });
    res.status(200).send(name);
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

app.get("/data", async (req, res) => {
  try {
    let list = await Names.find();
    res.status(200).send(list);
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

app.listen(port, () => {
  console.log(`Server running at: http://localhost:${port}`);
});
