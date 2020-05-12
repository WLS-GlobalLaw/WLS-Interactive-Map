import React from "react";

import "../styles/Buttons.scss";

export default function Buttons(props) {
  return (
    <div>
      <div className="button-container">
        <h3>Click on a law to highlight the countries that focusing on it</h3>
        <button
          id="law-ds"
          className="button decentralized-systems"
          onClick={props.changeLaw}
        >
          Identity and Decentralized Systems
        </button>
        <button
          id="law-as"
          className="button autonomous-systems"
          onClick={props.changeLaw}
        >
          Autonomous Systems
        </button>
        <button
          id="law-dg"
          className="button data-governance"
          onClick={props.changeLaw}
        >
          Data Governance
        </button>
      </div>
    </div>
  );
}
