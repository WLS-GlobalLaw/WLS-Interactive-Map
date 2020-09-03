require("dotenv").config();
const express = require("express");
const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const encoding = require("encoding"); // this is added (but not used) because of a netlify bug not including this file into the CLI.  They will add in a future patch.

const app = express();
const router = express.Router();

const lawDsPinLocations = require("./lawDsPinLocations.json");
const lawAsPinLocations = require("./lawAsPinLocations.json");
const lawDgPinLocations = require("./lawDgPinLocations.json");
const countryLocation = require("./countryLocation.json");

const clientEmail =
  process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
  process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL;

const privateKey =
  process.env.GOOGLE_PRIVATE_KEY_LOCAL ||
  process.env.REACT_APP_GOOGLE_PRIVATE_KEY.replace(
    new RegExp("\\\\n", "g"),
    "\n"
  );

const gsIdLawDS =
  process.env.GOOGLE_SHEET_ID_LAW_DS ||
  process.env.REACT_APP_GOOGLE_SHEET_ID_LAW_DS;

const gsIdLawAS =
  process.env.GOOGLE_SHEET_ID_LAW_AS ||
  process.env.REACT_APP_GOOGLE_SHEET_ID_LAW_AS;

const gsIdLawDG =
  process.env.GOOGLE_SHEET_ID_LAW_DG ||
  process.env.REACT_APP_GOOGLE_SHEET_ID_LAW_DG;

const gsIdBodyText =
  process.env.GOOGLE_SHEET_ID_BODY_TEXT ||
  process.env.REACT_APP_GOOGLE_SHEET_ID_BODY_TEXT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

async function getGoogleSheetInfo(googleSheetID) {
  const doc = new GoogleSpreadsheet(googleSheetID);

  await doc.useServiceAccountAuth({
    client_email: clientEmail,
    // regex/replace is there because netlify env on build was turning all /n's to //n's
    private_key: privateKey,
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
// To reach into Identity law Googlesheet
router.get("/api/country-data/identity", async (req, res) => {
  let countryInfo;
  try {
    countryInfo = await getGoogleSheetInfo(gsIdLawDS);
  } catch (e) {
    console.error(e);
  }
  res.send({ countryInfo });
});

// To reach into Autonomous-systems law Googlesheet
router.get("/api/country-data/autonomous-systems", async (req, res) => {
  let countryInfo;
  try {
    countryInfo = await getGoogleSheetInfo(gsIdLawAS);
  } catch (e) {
    console.error(e);
  }
  res.send({ countryInfo });
});

// To reach into Personal Data Governance law Googlesheet
router.get("/api/country-data/personal-data-governance", async (req, res) => {
  let countryInfo;
  try {
    countryInfo = await getGoogleSheetInfo(gsIdLawDG);
  } catch (e) {
    console.error(e);
  }
  res.send({ countryInfo });
});

// To reach into the country body text Googlesheet
router.get("/api/country-data/country-info", async (req, res) => {
  let countryBodyText;
  try {
    countryBodyText = await getGoogleSheetInfo(gsIdBodyText);
  } catch (e) {
    console.error(e);
  }
  res.send({ countryBodyText });
});

// API for country location master list
router.get("/api/countryLocation", async (req, res) => {
  res.send({ countryLocation });
});

// API for Identity law countries locations for pins
router.get("/api/law-dsCountryPins", async (req, res) => {
  res.send({ lawDsPinLocations });
});

// API for Autonomous Systems law countries locations for pins
router.get("/api/law-asCountryPins", async (req, res) => {
  res.send({ lawAsPinLocations });
});

// API for Personal Data Governance law countries locations for pins
router.get("/api/law-dgCountryPins", async (req, res) => {
  res.send({ lawDgPinLocations });
});

app.use("/.netlify/functions/server", router);

module.exports = app;
module.exports.handler = serverless(app);
