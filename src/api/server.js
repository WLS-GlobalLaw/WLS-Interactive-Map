require("dotenv").config();
const express = require("express");
const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const { GoogleSpreadsheet } = require("google-spreadsheet");

const app = express();
const router = express.Router();

const lawDsJson = require("./lawDsJson.json");
const lawAsJson = require("./lawAsJson.json");
const lawDgJson = require("./lawDgJson.json");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

console.log(process.env.REACT_APP_GOOGLE_PRIVATE_KEY);

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

router.get("/api/country-data", async (req, res) => {
  const doc = new GoogleSpreadsheet(
    "1e-VbcEbz8-7RifDaD5B7rFE_k6N4o-eziUIZQyEur2Q"
  );
  // await doc.useServiceAccountAuth(creds);
  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  });
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();
  const info = rows.map((row) => ({
    country: row.Country,
    continent: row.Continent,
    bodyText: row["Body Text"],
    lawCategory: row["Law Category"],
    description: row.Description,
  }));

  res.send({
    countryInfo: info,
  });
});

app.use("/.netlify/functions/server", router);

module.exports = app;
module.exports.handler = serverless(app);
