import React, { Component } from 'react';
import {GoogleApiWrapper, Map, Marker, InfoWindow} from 'google-maps-react';

import ClueUploadForm from './ClueUploadForm';
import './App.css';

import { cluesRef } from "./fire";
import ClueInfo from './ClueInfo';
import { GOOGLE_MAPS_API_KEY } from "./properties";

const BOSTON = {
  lat: 42.3601,
  lng: -71.0589
};

class Dashboard extends Component {

  constructor(props) {
    super(props);

    this.state = {
      clues: [],
      selectedClue: null,
      activeMarker: null,
      showingInfoWindow: false,
    }
  }

  componentDidMount() {
    //Listen for ANY updates to clues and sync with clues state
    cluesRef.on('value', snapshot => {
      let clues = [];
      snapshot.forEach(item => {
        clues.push({ ...item.val(), key: item.key });
      });

      this.setState({ clues })
    });
  }

  render() {
    return (
      <div className="dashboard-container" id="container">

        <div className="dashboard-left" id="clue-upload-form">
          <ClueUploadForm google={this.props.google}/>
        </div>

        <div className="dashboard-center" id="map">
          <Map google={this.props.google}
               zoom={14}
               onClick={this.onMapClicked}
               initialCenter={BOSTON}>

            {this.renderClues()}

            <InfoWindow
              marker={this.state.activeMarker}
              visible={this.state.showingInfoWindow}>
              <ClueInfo clue={this.state.selectedClue}/>
            </InfoWindow>
          </Map>
        </div>
      </div>
    );
  }

  // Allow clicking away from a marker
  onMapClicked = () => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null,
        selectedClue: null
      })
    }
  };

  // Render all the clue markers
  renderClues() {
    return this.state.clues.map((clue, index) => {
      const coords = { lat: clue.latitude, lng: clue.longitude };

      return (
        <Marker
          key={index}
          position={coords}
          title={clue.title}
          onClick={(_, marker) => this.onMarkerClick(clue, marker)}
        />
      );
    });
  }

  // Select the given clue/marker to populate the info window
  onMarkerClick = (clue, marker) => {
    this.setState({
      selectedClue: clue,
      activeMarker: marker,
      showingInfoWindow: true
    });
  };
}

export default GoogleApiWrapper({
  apiKey: (GOOGLE_MAPS_API_KEY)
})(Dashboard)