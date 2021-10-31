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
    const ordersCollection = database.collection("orders");

    // POST API
    app.post("/orders", async (req, res) => {
      const newPlan = req.body;
      const result = await ordersCollection.insertOne(newPlan);
      // console.log(newPlan);
      res.json(result);
    });

    //  GET API WHICH WAS PLACED ORDERED BY USER
    app.get("/orders", async (req, res) => {
      const cursor = ordersCollection.find({});
      const orders = await cursor.toArray();
      // console.log(orders);
      res.json(orders);
    });

    app.get("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const order = await ordersCollection.findOne(query);
      res.json(order);
    });

    //  GET API WHICH WAS PLACED ORDER BY USER WITH THEIR EMAIL
    app.get("/orders/:name", async (req, res) => {
      const name = req.params.name;
      const query = { name: name };
      const order = await ordersCollection.find(query);
      console.log(order);
      res.json(order);
    });

    // POST API IN PLANS
    app.post("/plans", async (req, res) => {
      const newPlan = req.body;
      const result = await plansCollection.insertOne(newPlan);
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

    // UPDATE PLAN
    app.put("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body;
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: {
          name: updatedUser.name,
          email: updatedUser.email,
          address: updatedUser.address,
          post: updatedUser.post,
          status: updatedUser.status,
        },
      };
      const result = await ordersCollection.updateOne(filter, updateDoc);
      console.log("update user", id);
      res.json(result);
    });

    // DELETE PLAN
    app.delete("/devplan/:id", async (req, res) => {
      const result = await ordersCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      res.send(result);
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
