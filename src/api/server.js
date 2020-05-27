require("dotenv").config();
const express = require("express");
const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const encoding = require("encoding"); // this is added (but not used) because of a netlify bug not including this file into the CLI.  They will add in a future patch.

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

router.get("/api/country-data", async (req, res) => {
  const doc = new GoogleSpreadsheet(
    "1e-VbcEbz8-7RifDaD5B7rFE_k6N4o-eziUIZQyEur2Q"
  );

  await doc.useServiceAccountAuth({
    client_email: process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL,
    // regex/replace is there because netlify env on build was turning all /n's to //n's
    private_key:
      process.env.REACT_APP_GOOGLE_PRIVATE_KEY.replace(
        new RegExp("\\\\n", "g"),
        "\n"
      ) || process.env.GOOGLE_PRIVATE_KEY_LOCAL,
  });
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();
  const info = rows.map((row) => ({
    country: row.Country,
    continent: row.Continent,
    bodyText: row["Body Text"],
    lawCategory: row["Law Category"],
    billsAndLaws: row["Bills and Laws"],
    description: row.Description,
  }));

  res.send({
    countryInfo: info,
  });
});

app.use("/.netlify/functions/server", router);

module.exports = app;
module.exports.handler = serverless(app);
