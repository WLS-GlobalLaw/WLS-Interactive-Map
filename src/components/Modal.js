import React, { Component } from "react";
import "../styles/Modal.scss";

export default class Modal extends Component {
  render() {
    return (
      <div id="myModal" className="modal">
        <div className="modal-content">
          <span className="close" onClick={this.props.handleClose}>
            &times;
          </span>
          <div className="inner-content">
            <h2 className="content-title">
              {this.props.googleSheetInfo[0].country}
            </h2>
            <p className="modal-text">
              {this.props.googleSheetInfo[0].bodyText}{" "}
            </p>

            <div>
              <h3>Existing Bills, Laws, and Standards</h3>
              {this.props.googleSheetInfo.map((item, index) => (
                <p key={index}>
                  {item.billsAndLaws}: {item.description}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
