const express = require("express");
const app = express();
const dotenv = require("dotenv");
var redis = require("redis");
const bodyParser = require("body-parser");

dotenv.config();

var redisDB = redis.createClient(
  process.env.REDIS_PORT,
  process.env.REDIS_URL,
  {
    auth_pass: process.env.REDIS_PASS
  }
);

redisDB.on("connect", function() {
  console.log("Redis client connected");
});

redisDB.on("error", function(err) {
  console.log("Something went wrong " + err);
});

app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Hello api");
});

app.get("/storage/:key", (req, res) => {
  redisDB.get(req.params.key, function(error, result) {
    if (error)
      return res
        .status(400)
        .json({ error: "Ocorreu um erro ao buscar a chave informada" });
    return res.json({ value: result });
  });
});

app.post("/storage/:key", (req, res) => {
  const key = req.params.key;
  const { value } = req.body;

  redisDB.set(key, value, redis.print);

  return res.status(201).send();
});

app.listen(3000);
