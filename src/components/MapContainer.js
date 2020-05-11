import React, { Component, Fragment } from "react";
import { Map, TileLayer, GeoJSON } from "react-leaflet";

import "../styles/MapContainer.scss";

import Buttons from "./Buttons";

// this will switch between Netlify deployment env route and local development env route
const ACCESS_TOKEN =
  process.env.REACT_APP_ACCESS_TOKEN || process.env.REACT_APP_ACC_TOKEN_LOCAL;

export default class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      position: [0, 0],
    };
  }
  render() {
    return (
      <Map center={this.state.position} zoom={1} id="map" className="map">
        <Buttons />
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${ACCESS_TOKEN}`}
          attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
          minZoom={3}
          maxZoom={10}
          zoomDelta={0.1}
          zoomSnap={0}
          //id="mapbox/streets-v11"
          //id="chrisstanarsenault/cka0bh3lk13qg1it67mcpj4gg"
          id="chrisstanarsenault/cka0cv5op0e971ipj4a8qqnax"
          tileSize={512}
          zoomOffset={-1}
          accessToken={ACCESS_TOKEN}
        />
      </Map>
    );
  }
}
