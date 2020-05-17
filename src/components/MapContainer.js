import React, { Component, Fragment } from "react";
import { Map, TileLayer, GeoJSON } from "react-leaflet";
import "../styles/MapContainer.scss";
import dummygeo from "../data/dummygeo.json";

import Buttons from "./Buttons";
import Modal from "./Modal";

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
    };
    this.changeCurrentLaw = this.changeCurrentLaw.bind(this);
    this.geoRef = React.createRef();
    this.mapRef = React.createRef();
    this.updateGeo = this.updateGeo.bind(this);
    this.getGeoColor = this.getGeoColor.bind(this);
    this.lawGeoStyle = this.lawGeoStyle.bind(this);
    this.highlightFeature = this.highlightFeature.bind(this);
    this.resetHighlight = this.resetHighlight.bind(this);
    this.launchModal = this.launchModal.bind(this);
    this.onEachFeature = this.onEachFeature.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.resizeScreen = this.resizeScreen.bind(this);
  }

  changeCurrentLaw(e) {
    let lawClicked = e.target.id;
    // first turn state of isLawSelected to false, so when updateGeo is called,
    // is will switch to true and it will force rerender of the component
    this.setState(
      {
        isLawSelected: false,
        currentLawSelected: lawClicked,
      },
      () => {
        this.updateGeo();
      }
    );
  }

  // this is called to render the GeoJson styling
  updateGeo() {
    this.setState({ isLawSelected: true });
    this.lawGeoStyle();
  }

  // this will only select the countries that match the law being selected for coloring
  getGeoColor(law) {
    return law === "law-ds"
      ? "#e5cf33"
      : law === "law-as"
      ? "#e5cf33"
      : law === "law-dg"
      ? "#e5cf33"
      : "none";
  }

  lawGeoStyle(e) {
    let currentLaw = this.state.currentLawSelected;

    if (e) {
      if (currentLaw === "law-ds") {
        return {
          fillColor: this.getGeoColor(e.properties["law-ds"]),
          weight: 2,
          opacity: 1,
          color: "none",
          fillOpacity: 0.7,
        };
      } else if (currentLaw === "law-as") {
        return {
          fillColor: this.getGeoColor(e.properties["law-as"]),
          weight: 2,
          opacity: 1,
          color: "none",
          fillOpacity: 0.7,
        };
      } else if (currentLaw === "law-dg") {
        return {
          fillColor: this.getGeoColor(e.properties["law-dg"]),
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

    if (layer.feature.properties[this.state.currentLawSelected]) {
      layer.setStyle({
        weight: 1,
        color: "#363839",
        dashArray: "",
        fillOpacity: 0.5,
      });
    }
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
    if (feature.properties["law-ds"]) {
      layer.on({
        mouseover: this.highlightFeature,
        mouseout: this.resetHighlight,
        click: this.launchModal,
      });
    } else if (feature.properties["law-as"]) {
      layer.on({
        mouseover: this.highlightFeature,
        mouseout: this.resetHighlight,
        click: this.launchModal,
      });
    } else if (feature.properties["law-dg"]) {
      layer.on({
        mouseover: this.highlightFeature,
        mouseout: this.resetHighlight,
        click: this.launchModal,
      });
    }
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
      this.setState({ zoomLevel: 3 });
    }
  }

  componentDidMount() {
    window.addEventListener("resize", this.resizeScreen());
  }

  render() {
    return (
      <Fragment>
        {this.state.isModalShown && <Modal handleClose={this.handleClose} />}
        <Map
          center={this.state.position}
          zoom={0}
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
          {this.state.isLawSelected && (
            <GeoJSON
              data={dummygeo}
              style={this.lawGeoStyle}
              onEachFeature={this.onEachFeature}
              ref={this.geoRef}
            />
          )}
        </Map>
      </Fragment>
    );
  }
}
