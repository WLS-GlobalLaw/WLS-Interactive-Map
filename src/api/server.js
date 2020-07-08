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

async function getGoogleSheetInfo(googleSheetID) {
  const doc = new GoogleSpreadsheet(googleSheetID);

  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    // regex/replace is there because netlify env on build was turning all /n's to //n's
    private_key: process.env.GOOGLE_PRIVATE_KEY_LOCAL,
    // process.env.REACT_APP_GOOGLE_PRIVATE_KEY.replace(
    //   new RegExp("\\\\n", "g"),
    //   "\n"
    // ),
  });
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();
  const info = rows.map((row) => ({
    country: row.Country,
    worldRegion: row["World Region"],
    typeOfLegislation: row["Type of Legislation"],
    lawSubCategory: row["Law Sub Category/In Text Title"],
    keyOrganizations: row["Key Organization(s)"],
    titleOfLaw: row["Title of Law"],
    description: row["(# of characters = 300)  Description"],
    webLink: row["Web Link"],
    bodyText: row["Body Text"],
    categoryOfLegislation: row["Category of Legislation"],
  }));
  return info;
}

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

router.get("/api/country-data/identity", async (req, res) => {
  let countryInfo;
  try {
    countryInfo = await getGoogleSheetInfo(process.env.GOOGLE_SHEET_ID_LAW_DS);
  } catch (e) {
    console.error(e);
  }
  res.send({ countryInfo });
});

router.get("/api/country-data/autonomous-systems", async (req, res) => {
  let countryInfo;
  try {
    countryInfo = await getGoogleSheetInfo(process.env.GOOGLE_SHEET_ID_LAW_AS);
  } catch (e) {
    console.error(e);
  }
  res.send({ countryInfo });
});

router.get("/api/country-data/personal-data-governance", async (req, res) => {
  let countryInfo;
  try {
    countryInfo = await getGoogleSheetInfo(process.env.GOOGLE_SHEET_ID_LAW_DG);
  } catch (e) {
    console.error(e);
  }
  res.send({ countryInfo });
});

router.get("/api/country-data/country-info", async (req, res) => {
  let countryBodyText;
  try {
    countryBodyText = await getGoogleSheetInfo(
      process.env.GOOGLE_SHEET_ID_BODY_TEXT
    );
  } catch (e) {
    console.error(e);
  }
  res.send({ countryBodyText });
});

app.use("/.netlify/functions/server", router);

module.exports = app;
module.exports.handler = serverless(app);
