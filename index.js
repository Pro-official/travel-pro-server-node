const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 5000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// SETTING UP DATABASE
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j6ced.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// MAIN INITIALIZATION
async function run() {
  try {
    await client.connect();
    const database = client.db("TravelDB");
    const plansCollection = database.collection("plans");

    // POST API
    app.post("/plans", async (req, res) => {
      const plan = req.body;
      const result = await plansCollection.insertOne(plan);
      res.json(result);
    });

    // GET API
    app.get("/plans", async (req, res) => {
      const cursor = plansCollection.find({});
      const plans = await cursor.toArray();
      res.send(plans);
    });

    // GET SINGLE API
    app.get("/plans/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const plan = await plansCollection.findOne(query);
      res.json(plan);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
