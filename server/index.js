const keys = require("./keys");

// Express App Setup
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const io = require('socket.io');

const app = express();
app.use(cors());
app.use(bodyParser.json());


const server = app.listen(3001, () => {
  console.log('Server running on port 3001');
});
const sio = io(server);

// Postgres Client Setup
const { Pool } = require("pg");
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
});

pgClient.on("connect", (client) => {
  client
    .query("CREATE TABLE IF NOT EXISTS values (link VARCHAR(600))")
    .catch((err) => console.error(err));
});

// Redis Client Setup
const redis = require("redis");
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});
const redisPublisher = redisClient.duplicate();

// Express route handlers

app.get("/", (req, res) => {
  res.send("Hi");
});

app.get("/values/all", async (req, res) => {
  const values = await pgClient.query("SELECT * from values");

  res.send(values.rows);
});

app.get("/values/current", async (req, res) => {
  await redisClient.hgetall("values", (err, values) => {
    console.log("valuesare  "+JSON.stringify(values))
    res.send(values);
  });
});

app.post("/values", async (req, res) => {
  const index = req.body.index;
  redisClient.hset("values", index, "Nothing yet!");
   redisPublisher.publish("insert", index);
   pgClient.query("INSERT INTO values(link) VALUES($1)", [index]);
  res.send({ working: true });
});

app.listen(5000, (err) => {
  console.log("Listening");
});

sio.on('connection', (socket) => {
  console.log('Client connected to WebSocket');
  // You can handle events and communication here
});
