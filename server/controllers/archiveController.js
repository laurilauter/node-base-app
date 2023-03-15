import { ArchivedGame } from "../db/dbConnection.js";

export async function listMyGames(req, res) {
  try {
    const filter = { gameOwnerId: req.params.id };
    const list = await ArchivedGame.find(filter);
    //console.log("list ", list);
    res.status(200).send(list);
  } catch (error) {
    res.status(500).send({ error: error });
  }
}

export async function getGame(req, res) {
  try {
    const filter = { _id: req.params.id };
    let foundArchivedGame = await ArchivedGame.findOne(filter);
    res.status(200).send(foundArchivedGame);
  } catch (error) {
    res.status(500).send({ error: error });
  }
}

export async function deleteGame(req, res) {
  try {
    const filter = { _id: req.params.id };
    const result = await ArchivedGame.deleteOne(filter);
    if (result.deletedCount === 0) {
      res.status(403).send({ message: "Game not found" });
    } else {
      res.status(204).send({ message: "Game deleted" });
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
}
