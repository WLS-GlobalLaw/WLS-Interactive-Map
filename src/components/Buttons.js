import React from "react";

import "../styles/Buttons.scss";

export default function Buttons(props) {
  return (
    <div>
      <div className="button-container">
        <h3>Click on a Category to Highlight Country Details </h3>
        <button
          id="law-ds"
          className="button decentralized-systems"
          onClick={props.changeLaw}
        >
          Identity & Decentralized Technologies
        </button>
        <button
          id="law-as"
          className="button autonomous-systems"
          onClick={props.changeLaw}
        >
          AI & Autonomous Systems
        </button>
        <button
          id="law-dg"
          className="button data-governance"
          onClick={props.changeLaw}
        >
          Personal Data Governance
        </button>
      </div>
    </div>
  );
}
