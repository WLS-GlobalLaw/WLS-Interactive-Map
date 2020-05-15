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
            <h2 className="content-title">Country Name Here</h2>
            <p className="modal-text">
              Country description.... Lorem ipsum dolor sit amet, consectetur
              adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Felis bibendum ut tristique et egestas quis
              ipsum. Eget est lorem ipsum dolor sit amet consectetur. Lorem
              dolor sed viverra ipsum nunc aliquet bibendum. Eget mi proin sed
              libero enim sed faucibus turpis. Id consectetur purus ut faucibus
              pulvinar. Adipiscing tristique risus nec feugiat in fermentum
              posuere urna nec. Risus quis varius quam quisque id diam vel. Diam
              sollicitudin tempor id eu nisl nunc mi. Ut venenatis tellus in
              metus vulputate. Aliquam ut porttitor leo a diam sollicitudin
              tempor id eu. Dis parturient montes nascetur ridiculus mus mauris
              vitae ultricies. Amet justo donec enim diam vulputate ut pharetra.
              Urna id volutpat lacus laoreet non curabitur gravida. Egestas quis
              ipsum suspendisse ultrices gravida dictum. Cras pulvinar mattis
              nunc sed blandit. Id donec ultrices tincidunt arcu non. Ac
              tincidunt vitae semper quis lectus nulla. Feugiat vivamus at augue
              eget arcu dictum varius duis at. Nisl vel pretium lectus quam id
              leo in. Interdum posuere lorem ipsum dolor sit amet consectetur
              adipiscing elit. Nunc consequat interdum varius sit amet.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Fringilla urna porttitor rhoncus dolor. Volutpat maecenas volutpat
              blandit aliquam etiam erat. Eget magna fermentum iaculis eu non
              diam phasellus. Eu feugiat pretium nibh ipsum consequat. Risus
              commodo viverra maecenas accumsan lacus vel. Mi quis hendrerit
              dolor magna eget est. Elit pellentesque habitant morbi tristique
              senectus et netus et. Blandit cursus risus at ultrices mi tempus
              imperdiet. Tellus in hac habitasse platea dictumst vestibulum
              rhoncus. Massa tempor nec feugiat nisl pretium fusce id. Varius
              duis at consectetur lorem donec. Iaculis nunc sed augue lacus
              viverra vitae congue eu. Pretium quam vulputate dignissim
              suspendisse in est. Venenatis urna cursus eget nunc scelerisque.
              Dictum sit amet justo donec. Id aliquet lectus proin nibh nisl
              condimentum id venenatis.
            </p>
            <div>
              <h3>Existing Bills, Laws, and Standards</h3>
              <p>Law Name One: Decription One</p>
              <p>Law Name Two: Description Two</p>
              <p>Law Name Three: Description Three</p>
              <p>Law Name Four: Description Four</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
