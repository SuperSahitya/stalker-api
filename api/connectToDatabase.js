const { MongoClient } = require("mongodb");
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri);

async function runDatabase(thatName, thatRoll, thatReg) {
  try {
    await client.connect();
    const database = client.db("Students");
    const collection = database.collection("studentdata");
    if (thatName != undefined) {
      me = await collection
        .find({
          name: { $regex: `^${thatName}` },
        })
        .toArray();
      return me;
    } else if (thatRoll != undefined) {
      me = await collection
        .find({
          rollNumber: `${thatRoll}`,
        })
        .toArray();
      return me;
    } else if (thatReg != undefined) {
      me = await collection
        .find({
          regNumber: `${thatReg}`,
        })
        .toArray();
      return me;
    }
  } catch (error) {
    throw new Error(`Database error: ${error.message}`);
  } finally {
    await client.close();
  }
}

module.exports = async (req, res) => {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "api-key");

    if (req.method === "OPTIONS") {
      res.status(200).end();
      return;
    }

    const apiKey = req.headers["api-key"];
    if (!apiKey || apiKey !== process.env.API_KEY) {
      res.status(403).send("Forbidden");
      return;
    }

    const thatName = req.query.name;
    const thatRoll = req.query.roll;
    const thatReg = req.query.reg;
    const value = await runDatabase(thatName, thatRoll, thatReg);
    if (value === null) {
      res.status(404).send("Not found");
    } else {
      res.send(value);
    }
  } catch (error) {
    res.status(500).send(`Server error: ${error.message}`);
  }
};
