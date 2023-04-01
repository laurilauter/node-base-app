import { GamePlan } from "../db/modelConnector.js";
import { Marker } from "../db/modelConnector.js";
import { GameMap } from "../db/modelConnector.js";

export async function createGame(req, res) {
  try {
    const { gameTitle, ownerId } = req.body;
    if (gameTitle && ownerId) {
      const newGamePlanData = {
        gameTitle: gameTitle,
        ownerId: ownerId,
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
    let { marker } = req.body;
    console.log("marker ", marker);
    const newMarker = await Marker.create(marker);
    console.log("newMarker", newMarker);
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
    console.log("foundMarker ", foundMarker);
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
    const { gameTitle, ownerId, markers } = req.body;
    const update = {
      gameTitle: gameTitle,
      ownerId: ownerId,
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
  console.log("req.body ", req.body);
  try {
    const filter = { _id: req.params.id };
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
    const filterMapDelete = { gamePlanId: req.params.id };
    const resultMapDelete = await GameMap.deleteOne(filterMapDelete);

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
  let file = req.files.file;
  try {
    console.log("uploaded file size(bytes): ", file.size);
    const mapFilter = { gamePlanId: gamePlanId };
    const mapUpdate = {
      fileName: file.name,
      file: {
        data: file.data,
        contentType: file.mimetype,
      },
      gamePlanId: gamePlanId,
    };
    const mapOptions = { upsert: true };

    let updatedMap = await GameMap.updateOne(mapFilter, mapUpdate, mapOptions);

    res.status(200).send(updatedMap);
  } catch (error) {
    res.status(500).send({ error: error });
  }
}

export async function getMap(req, res) {
  try {
    const filter = { gamePlanId: req.params.id };
    let foundMap = await GameMap.findOne(filter);
    res.status(200).send(foundMap);
  } catch (error) {
    res.status(500).send({ error: error });
  }
}
