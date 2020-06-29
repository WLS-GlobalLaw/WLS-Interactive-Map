import React, { Component, Fragment } from "react";
import { Map, TileLayer, GeoJSON } from "react-leaflet";
import "../styles/MapContainer.scss";

import Buttons from "./Buttons";
import Modal from "./Modal";
import axios from "axios";

// this will switch between Netlify deployment env route and local development env route
const ACCESS_TOKEN =
  process.env.REACT_APP_ACCESS_TOKEN || process.env.REACT_APP_ACC_TOKEN_LOCAL;

export default class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      position: [0, 0],
      isLawSelected: false,
      currentLawSelected: "",
      isModalShown: false,
      zoomLevel: 1,
      geoData: null,
      googlesheetData: [],
    };

    this.changeCurrentLaw = this.changeCurrentLaw.bind(this);
    this.geoRef = React.createRef();
    this.mapRef = React.createRef();
    this.updateGeo = this.updateGeo.bind(this);
    this.lawGeoStyle = this.lawGeoStyle.bind(this);
    this.highlightFeature = this.highlightFeature.bind(this);
    this.resetHighlight = this.resetHighlight.bind(this);
    this.onEachFeature = this.onEachFeature.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.resizeScreen = this.resizeScreen.bind(this);
    this.getApi = this.getApi.bind(this);
    this.getGSDataAndLaunchModal = this.getGSDataAndLaunchModal.bind(this);
    this.launchModal = this.launchModal.bind(this);
  }

  changeCurrentLaw(e) {
    let lawClicked = e.target.id;

    // first reset state, so when updateGeo is called,
    // is will retrigger states and it will force rerender of the component
    this.setState(
      {
        isLawSelected: false,
        geoData: null,
        currentLawSelected: lawClicked,
      },
      () => {
        this.getApi(lawClicked);
        this.updateGeo();
      }
    );
  }

  // this is called to render the GeoJson styling
  updateGeo() {
    this.setState({ isLawSelected: true });
    this.lawGeoStyle();
  }

  lawGeoStyle(e) {
    let currentLaw = this.state.currentLawSelected;

    if (e) {
      if (currentLaw === "law-ds") {
        return {
          fillColor: "#1da1f2",
          weight: 2,
          opacity: 1,
          color: "none",
          fillOpacity: 0.7,
        };
      } else if (currentLaw === "law-as") {
        return {
          fillColor: "#1b2c57",
          weight: 2,
          opacity: 1,
          color: "none",
          fillOpacity: 0.7,
        };
      } else if (currentLaw === "law-dg") {
        return {
          fillColor: "#e5cf33",
          weight: 2,
          opacity: 1,
          color: "none",
          fillOpacity: 0.7,
        };
      }
    }
  }

  highlightFeature(e) {
    let layer = e.target;
    layer.setStyle({
      weight: 1,
      color: "#363839",
      dashArray: "",
      fillOpacity: 0.5,
    });
  }

  resetHighlight(e) {
    this.geoRef.current.leafletElement.resetStyle(e.target);
  }

  launchModal(e) {
    this.setState({
      isModalShown: true,
    });
  }

  onEachFeature(feature, layer) {
    layer.on({
      mouseover: this.highlightFeature,
      mouseout: this.resetHighlight,
      click: this.getGSDataAndLaunchModal,
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

  async getApi(law) {
    let jsonFileToUse;
    if (law === "law-ds") {
      jsonFileToUse = "lawDsJson";
    } else if (law === "law-as") {
      jsonFileToUse = "lawAsJson";
    } else if (law === "law-dg") {
      jsonFileToUse = "lawDgJson";
    }

    const apiUrl = "/.netlify/functions/server/api/";
    let response = await axios.get(`${apiUrl}${law}`);
    let feature = await response.data[jsonFileToUse];

    this.setState({ geoData: feature });
  }

  async getGSDataAndLaunchModal(e) {
    let currentLawForGoogleSheet;
    let lawURLForGoogleSheet;
    let currentCountry = e.target.feature.properties.ADMIN;

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
    let filterData = data
      .filter(
        (item) =>
          item.country === currentCountry &&
          item.lawCategory === currentLawForGoogleSheet
      )
      .map((item) => item);

    this.setState(
      {
        googlesheetData: filterData,
      },
      () => this.launchModal()
    );
  }

  async componentDidMount() {
    window.addEventListener("resize", this.resizeScreen());
  }

  render() {
    return (
      <Fragment>
        {this.state.isModalShown && (
          <Modal
            handleClose={this.handleClose}
            googleSheetInfo={this.state.googlesheetData}
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
            id="chrisstanarsenault/cka0cv5op0e971ipj4a8qqnax"
            tileSize={512}
            zoomOffset={-1}
            accessToken={ACCESS_TOKEN}
          />

          {this.state.isLawSelected && this.state.geoData && (
            <GeoJSON
              data={this.state.geoData}
              style={this.lawGeoStyle}
              onEachFeature={this.onEachFeature}
              ref={this.geoRef}
              key={this.state.currentLawSelected}
            />
          )}
        </Map>
      </Fragment>
    );
  }
}
