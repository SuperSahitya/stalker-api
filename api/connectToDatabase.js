// require("dotenv").config();
const { MongoClient } = require("mongodb");
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri);

async function runDatabase(thatName) {
  try {
    await client.connect();
    const database = client.db("Students");
    const collection = database.collection("studentdata");
    return (me = await collection.findOne({ name: `${thatName}` }));
  } finally {
    await client.close();
  }
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'api-key');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const apiKey = req.headers['api-key'];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    res.status(403).send('Forbidden');
    return;
  }

  const thatName = req.query.name;
  const value = await runDatabase(thatName);
  if (value === null) {
    res.status(404).send("Not found");
  } else {
    res.send(value);
  }
};