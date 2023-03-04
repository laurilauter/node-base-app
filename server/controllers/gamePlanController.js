import { GamePlan } from "../db/dbConnection.js";
import { Marker } from "../db/dbConnection.js";
//import moment from "moment";
import path from "path";
import * as url from "url";
import * as fs from "fs";
import { rm } from "node:fs/promises";
//const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

export async function createGame(req, res) {
  try {
    const { gameTitle, gameMap, ownerId, gameDuration } = req.body;
    if (gameTitle && ownerId) {
      const newGamePlanData = {
        gameTitle: gameTitle,
        gameMap: gameMap,
        ownerId: ownerId,
        gameDuration: gameDuration,
        markers: [],
      };

      const newPlan = await GamePlan.create(newGamePlanData);
      res.status(201).send(newPlan);
    } else {
      res.status(411).send({ error: "One or more required fields empty" });
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
}

//make sure the client sends valid gamePlanId in req.body, otherwise it will fail
export async function createMarker(req, res) {
  try {
    const { marker } = req.body;
    const newMarker = await Marker.create(marker);

    //add id of newly createrd marker to the parent GamePlan
    if (newMarker) {
      const filter = { _id: newMarker.gamePlanId };
      const update = {
        $push: {
          markers: newMarker._id,
        },
      };
      const options = { sort: { _id: 1 }, new: true, overwrite: true };

      const newGamePlan = await GamePlan.findOneAndUpdate(
        filter,
        update,
        options
      );
      console.log("newGamePlan ", newGamePlan);
    } else {
      res.status(400).send({ error: "No GamePlan by such gamePlanId" });
    }

    res.status(201).send(newMarker);
  } catch (error) {
    res.status(500).send({ error: error });
  }
}

export async function listGames(req, res) {
  try {
    const list = await GamePlan.find();
    res.status(200).send(list);
  } catch (error) {
    res.status(500).send({ error: error });
  }
}

export async function listMyGames(req, res) {
  try {
    const filter = { ownerId: req.params.id };
    const list = await GamePlan.find(filter);
    res.status(200).send(list);
  } catch (error) {
    res.status(500).send({ error: error });
  }
}

export async function getGame(req, res) {
  try {
    const filter = { _id: req.params.id };
    let foundGamePlan = await GamePlan.findOne(filter);

    res.status(200).send(foundGamePlan);
  } catch (error) {
    res.status(500).send({ error: error });
  }
}

export async function getMarker(req, res) {
  try {
    const filter = { _id: req.params.id };
    let foundMarker = await Marker.findOne(filter);

    res.status(200).send(foundMarker);
  } catch (error) {
    res.status(500).send({ error: error });
  }
}

export async function getMarkers(req, res) {
  try {
    const filter = { gamePlanId: req.params.id };
    let foundMarkers = await Marker.find(filter);

    res.status(200).send(foundMarkers);
  } catch (error) {
    res.status(500).send({ error: error });
  }
}

export async function updateGame(req, res) {
  try {
    const filter = { _id: req.params.id };
    const { gameTitle, ownerId, gameMap, gameDuration, markers } = req.body;
    const update = {
      gameTitle: gameTitle,
      gameMap: gameMap,
      ownerId: ownerId,
      gameDuration: gameDuration,
      markers: markers,
    };
    //const options = { sort: { _id: 1 }, new: true, overwrite: true }; //overwrites the whole thing
    const options = { sort: { _id: 1 }, new: true };

    let updatedGamePlan = await GamePlan.findOneAndUpdate(
      filter,
      update,
      options
    );

    res.status(200).send(updatedGamePlan);
  } catch (error) {
    res.status(500).send({ error: error });
  }
}

//must not update the gamePlanId
export async function updateMarker(req, res) {
  try {
    const filter = { _id: req.params.id };
    console.log("req.body ", req.body.content.quiz.answers);
    //const options = { sort: { _id: 1 }, new: true, overwrite: true };  //overwrites the whole thing
    const options = { sort: { _id: 1 }, new: true };
    let updatedMarker = await Marker.findOneAndUpdate(
      filter,
      req.body,
      options
    );
    console.log("updatedMarker ", updatedMarker);
    res.status(200).send(updatedMarker);
  } catch (error) {
    res.status(500).send({ error: error });
  }
}

export async function deleteMarker(req, res) {
  try {
    const result = await Marker.deleteOne({ _id: req.params.id });
    if (!req.body.gamePlanId) {
      res.status(403).send({ message: "GamePlan ID not found on body" });
    }
    if (result.deletedCount === 0) {
      res.status(403).send({ message: "Marker not found" });
    } else {
      //removing marker from GamePlan
      const filter = { _id: req.body.gamePlanId };
      const update = {
        $pullAll: {
          markers: [req.params.id],
        },
      };
      const options = { sort: { _id: 1 }, new: true, overwrite: true };

      let updatedGamePlan = await GamePlan.findOneAndUpdate(
        filter,
        update,
        options
      );
      console.log("updatedGamePlan ", updatedGamePlan);
      res.status(204).send({ message: "Marker deleted" });
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
}

export async function deleteGame(req, res) {
  try {
    //finding the game and deleting its markers first
    const filter = { _id: req.params.id };
    const foundGamePlan = await GamePlan.findOne(filter);
    const markers = foundGamePlan.markers;
    for (const marker of markers) {
      const deletingMarker = await Marker.deleteMany({ _id: marker });
      console.log("deletingMarker ", deletingMarker);
    }
    //deleting the game
    const result = await GamePlan.deleteOne(filter);
    if (result.deletedCount === 0) {
      res.status(403).send({ message: "Game not found" });
    } else {
      res.status(204).send({ message: "Game deleted" });
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
}

export async function uploadMap(req, res) {
  const gamePlanId = req.params.id;
  try {
    let file = req.files.file;
    let deletePath = path.join(
      __dirname,
      "..",
      "..",
      ".",
      "public",
      "uploads",
      gamePlanId
    );
    let filePath = path.join(
      __dirname,
      "..",
      "..",
      ".",
      "public",
      "uploads",
      gamePlanId,
      file.name
    ); //a unique id should be added

    const newGameMap = gamePlanId + "/" + file.name;
    const filter = { _id: gamePlanId };
    const update = {
      gameMap: newGameMap,
    };
    const options = { sort: { _id: 1 }, new: true, overwrite: false };
    await rm(deletePath, { recursive: true, force: true });
    await file.mv(filePath, function (err) {
      if (err) {
        console.log("save error");
      }
      console.log("file saved");
    });

    let updatedGamePlan = await GamePlan.findOneAndUpdate(
      filter,
      update,
      options
    );
    res.status(200).send(updatedGamePlan);
  } catch (error) {
    res.status(500).send({ error: error });
  }
}
