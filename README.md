# Interactive Map for the World Legal Summit

An interactive map built using React with map building APIs from [Leaftlet](https://www.leafletjs.com) and [React-Leaflet](https://react-leaflet.js.org/). Designed to highlight countries that are focusing on the certain tech laws that are the WLS focus this year:

- _**Identity and Decentralized Systems**_
- _**Autonomous Systems**_
- _**Data Governance**_

Clicking on a button for that law will then drop pins onto the participating countries. Clicking onto a pin of a country will then bring up a modal which then showcases a description of the country and how it relates to said law, as well as all the laws/bills within that country.

API routes have been set up to hold data needed, and the GoogleSheets API has been used to be able to reach inside multiple Googlesheets which harness all the data needed.

World Legal Summit Map
![WLS Map](https://github.com/WLS-GlobalLaw/WLS-Interactive-Map/blob/master/src/screenshots/WLS-map.png)

World Legal Summit Map with law clicked and pins
![WLS Map law clicked showing pins](https://github.com/WLS-GlobalLaw/WLS-Interactive-Map/blob/master/src/screenshots/WLS-map-law-with-pins.png)

World Legal Summit Map showing country modal
![WLS Map with country modal](https://github.com/WLS-GlobalLaw/WLS-Interactive-Map/blob/master/src/screenshots/WLS-map-modal.png)

Built by: [Chris Arsenault](https://www.github.com/chrisstanarsenault) for the [World Legal Summit](https://worldlegalsummit.org)
