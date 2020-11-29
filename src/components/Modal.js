import React, { Component } from 'react';
import '../styles/Modal.scss';

export default class Modal extends Component {
  // uncomment both sections once Aileen greenlights using bodytext again
  // constructor(props) {
  //   super(props);
  //   this.checkIfBodyTextExists = this.checkIfBodyTextExists.bind(this);
  // }

  // disabled for now until better bodytext information can be submitted as per Aileen
  // checkIfBodyTextExists() {
  //   if (this.props.googleSheetCountryBodyText.length !== 0) {
  //     return this.props.googleSheetCountryBodyText[0].bodyText;
  //   } else {
  //     return "TBD";
  //   }
  // }
  render() {
    return (
      <div id="myModal" className="modal">
        <div className="modal-content">
          <span className="close" onClick={this.props.handleClose}>
            &times;
          </span>
          <div className="inner-content">
            <h2 className="content-title">{this.props.googleSheetInfo[0].country}</h2>
            {/* <p className="modal-text">{this.checkIfBodyTextExists()}</p> */}
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Type Of Legislation</th>
                    <th>Title Of Law</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.googleSheetInfo.map((item, index) => (
                    <tr key={index} style={{ border: '1px solid black' }}>
                      <td border={1}>{item.typeOfLegislation}</td>
                      <td>{item.titleOfLaw}</td>
                      <td>{item.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
