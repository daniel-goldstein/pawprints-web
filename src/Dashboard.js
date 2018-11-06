import React from 'react';

import MapContainer from './MapContainer';
import './App.css';

export default class Dashboard extends React.Component {
  render() {
    return (
      <div className="dashboard-container" id="container">
        <div className="dashboard-center" id="map">
          <MapContainer />
        </div>
      </div>
    );
  }
}