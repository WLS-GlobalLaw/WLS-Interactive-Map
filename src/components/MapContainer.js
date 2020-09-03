import React, { Component, Fragment } from "react";
import { Map, TileLayer, Marker } from "react-leaflet";

import "../styles/MapContainer.scss";

import Buttons from "./Buttons";
import Modal from "./Modal";

import axios from "axios";

// this will switch between Netlify deployment env route and local development env route
const ACCESS_TOKEN =
  process.env.REACT_APP_ACCESS_TOKEN || process.env.REACT_APP_ACC_TOKEN_LOCAL;
const ID = process.env.REACT_APP_ID || process.env.REACT_APP_ACC_ID_LOCAL;

export default class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      position: [0, 0],
      isLawSelected: false,
      currentLawSelected: "",
      isModalShown: false,
      zoomLevel: 1,
      pinLocationInfo: [],
      pinLocation: "",
      lawPinData: [],
      googlesheetData: [],
      googlesheetCountryBodyText: [],
      changeComplete: false,
      play: false,
    };

    this.changeCurrentLaw = this.changeCurrentLaw.bind(this);
    this.mapRef = React.createRef();
    this.pinRef = React.createRef();
    this.handleClose = this.handleClose.bind(this);
    this.resizeScreen = this.resizeScreen.bind(this);
    this.getLawCountriesForPins = this.getLawCountriesForPins.bind(this);
    this.getGSDataAndLaunchModal = this.getGSDataAndLaunchModal.bind(this);
    this.launchModal = this.launchModal.bind(this);
    this.getPinLocationData = this.getPinLocationData.bind(this);
    this.markersDetails = this.markersDetails.bind(this);
    this.createMarkers = this.createMarkers.bind(this);
  }

  changeCurrentLaw(e) {
    let lawClicked = e.target.id;

    // first reset state, so when getLawCountriesForPins is called,
    // is will retrigger states and it will force rerender of the Pins component
    this.setState(
      {
        isLawSelected: false,
        currentLawSelected: lawClicked,
        pinLocationInfo: [],
      },
      () => {
        this.getLawCountriesForPins(lawClicked);
        this.setState({ isLawSelected: true });
      }
    );
  }

  launchModal(e) {
    this.setState({
      isModalShown: true,
    });
  }

  handleClose() {
    this.setState({ isModalShown: false });
  }

  resizeScreen() {
    const innerWidth = window.innerWidth;
    if (innerWidth < 1024 && innerWidth > 701) {
      this.setState({ zoomLevel: 2 });
    } else if (innerWidth < 700) {
      this.setState({ zoomLevel: 1 });
    } else {
      this.setState({ zoomLevel: 2 });
    }
  }

  async getLawCountriesForPins(law) {
    let whichLawJsonToUse;

    if (this.state.currentLawSelected === "law-ds") {
      whichLawJsonToUse = "lawDsPinLocations";
    } else if (this.state.currentLawSelected === "law-as") {
      whichLawJsonToUse = "lawAsPinLocations";
    } else if (this.state.currentLawSelected === "law-dg") {
      whichLawJsonToUse = "lawDgPinLocations";
    }

    const apiUrl = "/.netlify/functions/server/api/";
    let response = await axios.get(`${apiUrl}${law}CountryPins`);
    let feature = await response.data[whichLawJsonToUse].countries;

    this.setState({ lawPinData: feature }, () => {
      this.getPinLocationData();
    });
  }

  async getGSDataAndLaunchModal(e) {
    let currentLawForGoogleSheet;
    let lawURLForGoogleSheet;
    let currentCountry = this.state.pinLocation;

    if (this.state.currentLawSelected === "law-ds") {
      currentLawForGoogleSheet = "Identity";
      lawURLForGoogleSheet = "identity";
    } else if (this.state.currentLawSelected === "law-as") {
      currentLawForGoogleSheet = "Autonomous Systems";
      lawURLForGoogleSheet = "autonomous-systems";
    } else if (this.state.currentLawSelected === "law-dg") {
      currentLawForGoogleSheet = "Personal Data Governance";
      lawURLForGoogleSheet = "personal-data-governance";
    }

    let response = await axios.get(
      `/.netlify/functions/server/api/country-data/${lawURLForGoogleSheet}`
    );
    let data = response.data.countryInfo;
    let filteredData = data
      .filter((item) => item.country === currentCountry)
      .map((item) => item);

    let countryBodyText = await axios.get(
      `/.netlify/functions/server/api/country-data/country-info`
    );

    let bodyTextInfo = countryBodyText.data.countryBodyText;
    let filteredBodyTextInfo = bodyTextInfo
      .filter(
        (item) =>
          item.country === currentCountry &&
          item.categoryOfLegislation === currentLawForGoogleSheet
      )
      .map((item) => item);

    this.setState(
      {
        googlesheetData: filteredData,
        googlesheetCountryBodyText: filteredBodyTextInfo,
      },
      () => this.launchModal()
    );
  }

  async componentDidMount() {
    window.addEventListener("resize", this.resizeScreen());
  }

  async getPinLocationData() {
    let response = await axios.get(
      "/.netlify/functions/server/api/countryLocation"
    );
    let pinLocationData = response.data.countryLocation.countries;
    let pinData = [];

    for (let i = 0; i < pinLocationData.length; i++) {
      for (let j = 0; j < this.state.lawPinData.length; j++) {
        if (this.state.lawPinData[j] === pinLocationData[i].country) {
          pinData.push(pinLocationData[i]);
        }
      }
    }
    this.setState({
      pinLocationInfo: pinData,
    });
  }

  markersDetails(e) {
    let location = e.target.options.name;
    this.setState({ pinLocation: location }, () =>
      this.getGSDataAndLaunchModal()
    );
  }

  createMarkers(pin) {
    return (
      <Marker
        position={[pin.lat, pin.long]}
        ref={this.pinRef}
        onClick={this.markersDetails}
        name={pin.country}
        key={pin.country}
        alt={"pin marker for " + pin.country}
      />
    );
  }

  render() {
    return (
      <Fragment>
        {this.state.isModalShown && (
          <Modal
            handleClose={this.handleClose}
            googleSheetInfo={this.state.googlesheetData}
            googleSheetCountryBodyText={this.state.googlesheetCountryBodyText}
          />
        )}

        <Map
          center={this.state.position}
          zoom={0}
          doubleClickZoom={false}
          id="map"
          className="map"
          ref={this.mapRef}
        >
          <Buttons changeLaw={this.changeCurrentLaw} />
          <TileLayer
            url={`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${ACCESS_TOKEN}`}
            attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
            minZoom={this.state.zoomLevel}
            maxZoom={10}
            zoomDelta={0.1}
            zoomSnap={0}
            id={ID}
            tileSize={512}
            zoomOffset={-1}
            accessToken={ACCESS_TOKEN}
          />

          {this.state.pinLocationInfo.length !== 0 &&
            this.state.pinLocationInfo.map((pin) => this.createMarkers(pin))}
        </Map>
      </Fragment>
    );
  }
}
