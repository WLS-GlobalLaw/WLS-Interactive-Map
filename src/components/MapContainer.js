import React, { Component, Fragment } from "react";
import { Map, TileLayer, GeoJSON } from "react-leaflet";

import "../styles/MapContainer.scss";

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
        {console.log(process.env.REACT_APP_ACCESS_TOKEN)}
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${process.env.REACT_APP_ACCESS_TOKEN}`}
          attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
          minZoom={3}
          maxZoom={10}
          zoomDelta={0.1}
          zoomSnap={0}
          id="mapbox/streets-v11"
          tileSize={512}
          zoomOffset={-1}
          accessToken={process.env.REACT_APP_ACCESS_TOKEN}
        />
      </Map>
    );
  }
}
