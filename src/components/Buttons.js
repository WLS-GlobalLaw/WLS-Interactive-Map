import React from "react";

import "../styles/Buttons.scss";

export default function Buttons(props) {
  return (
    <div>
      <div className="button-container">
        <button className="button decentralized-systems">
          Identity and Decentralized Systems
        </button>
        <button className="button autonomous-systems">
          Autonomous Systems
        </button>
        <button className="button data-governance">Data Governance</button>
      </div>
    </div>
  );
}
