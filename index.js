const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.1ivadd4.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri);

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const dbConnect = async () => {
  try {
    await client.connect();
    console.log("Database connected");
  } catch (error) {
    console.log(error);
  }
};

dbConnect();

const packages = client.db("atomic_store").collection("packages");
const ordersCollection = client
  .db("atomic_store")
  .collection("ordersCollection");

// Routes
app.get("/", (req, res) => {
  res.send("hello world");
});

app.post("/packages", (req, res) => {
  try {
  } catch (error) {
    console.log(error);
  }
});

app.get("/packages/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await packages.findOne(query);

    res.send(result);
    console.log(result);
  } catch (error) {
    console.log(error);
    res.status(400).send("Error finding package");
  }
});

app.get("/packages", async (req, res) => {
  try {
    const query = {};
    const result = await packages.find(query).toArray();
    res.send(result);
  } catch (error) {
    console.log(error);
  }
});

app.post("/orders", async (req, res) => {
  try {
    const order = req.body;
    const result = await ordersCollection.insertOne(order);
    res.send(result);
  } catch (error) {
    console.log(error.name.bgRed, error.message.bold);
  }
});

app.get("/orders", async (req, res) => {
  try {
    let query = {};
    if (req.query.orderStatus) {
      query = {
        orderStatus: req.query.orderStatus,
      };
    }
    const sort = { _id: -1 };
    const cursor = ordersCollection.find(query).sort(sort);
    const result = await cursor.toArray();
    res.send(result);
  } catch (error) {
    console.log(error);
  }
});

app.put('/orders/:id', async (req, res) => {

  try {
    const id = req.params.id
    const filter = {_id: new ObjectId(id)}
    const action = req.body
    const updatedAction = {
      $set:{
        orderStatus: action.orderStatus
      }
    }

    const result = await ordersCollection.updateOne(filter, updatedAction)
    res.send(result)
  }

  catch (error) {
    console.log(error);
  }
})

// Server listing
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
