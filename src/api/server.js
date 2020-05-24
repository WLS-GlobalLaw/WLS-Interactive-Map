const express = require("express");
const serverless = require("serverless-http");
const bodyParser = require("body-parser");

const app = express();
const router = express.Router();

const lawDsJson = require("./lawDsJson.json");
const lawAsJson = require("./lawAsJson.json");
const lawDgJson = require("./lawDgJson.json");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API Calls
router.get("/api/law-ds", (req, res) => {
  res.send({
    lawDsJson,
  });
});

router.get("/api/law-as", (req, res) => {
  res.send({
    lawAsJson,
  });
});

router.get("/api/law-dg", (req, res) => {
  res.send({
    lawDgJson,
  });
});

app.use("/.netlify/functions/server", router);

module.exports = app;
module.exports.handler = serverless(app);
