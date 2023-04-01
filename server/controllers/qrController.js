import { QrCode } from "../db/modelConnector.js";

export async function createCode(req, res) {
  try {
    const { qrCodeTitle, ownerId } = req.body;
    if (qrCodeTitle && ownerId) {
      const newQrCodeData = {
        qrCodeTitle: qrCodeTitle,
        qrCodeImage: "dummyQrImage",
        ownerId: ownerId,
      };

      const newQr = await QrCode.create(newQrCodeData);
      res.status(201).send(newQr);
    } else {
      res.status(411).send({ error: "One or more required fields empty" });
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
}

export async function getCode(req, res) {
  try {
    const filter = { _id: req.params.id };
    let foundQr = await QrCode.findOne(filter);
    res.status(200).send(foundQr);
  } catch (error) {
    res.status(500).send({ error: error });
  }
}

export async function getCodes(req, res) {
  try {
    const filter = { ownerId: req.params.id };
    const list = await QrCode.find(filter);
    // console.log("filter", filter);
    // console.log("list ", list);
    res.status(200).send(list);
  } catch (error) {
    res.status(500).send({ error: error });
  }
}

export async function updateCode(req, res) {
  try {
    const filter = { _id: req.params.id };
    const { qrCodeTitle } = req.body;
    const update = {
      qrCodeTitle: qrCodeTitle,
    };
    //const options = { sort: { _id: 1 }, new: true, overwrite: true }; //overwrites the whole thing
    const options = { sort: { _id: 1 }, new: true };

    let updatedQr = await QrCode.findOneAndUpdate(filter, update, options);

    res.status(200).send(updatedQr);
  } catch (error) {
    res.status(500).send({ error: error });
  }
}

export async function deleteCode(req, res) {
  try {
    const filter = { _id: req.params.id };
    const result = await QrCode.deleteOne(filter);
    console.log("result ", result);
    if (result.deletedCount === 0) {
      res.status(403).send({ message: "Code not found" });
    } else {
      res.status(204).send({ message: "Code deleted" });
    }
  } catch (error) {
    res.status(500).send({ error: error });
  }
}
