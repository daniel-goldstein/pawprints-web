import React, { Component } from 'react';
import {GoogleApiWrapper, Map, Marker, InfoWindow} from 'google-maps-react';

import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap';

import ClueUploadForm from './ClueUploadForm';
import './App.css';

import { cluesRef } from "./fire";
import ClueInfo from './ClueInfo';
import { GOOGLE_MAPS_API_KEY } from "./properties";

const BOSTON = {
  lat: 42.3601,
  lng: -71.0589
};

const CLUE_VISIBILITY = {
  ALL: "All",
  COMPLETED: "Completed",
  UNCOMPLETED: "Uncompleted"
};

class Dashboard extends Component {

  constructor(props) {
    super(props);

    this.state = {
      clues: [],
      selectedClue: null,
      activeMarker: null,
      showingInfoWindow: false,
      clueVisibility: CLUE_VISIBILITY.ALL
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
               onClick={this.removeSelectedClueAndInfoWindow}
               initialCenter={BOSTON}>

            {this.renderClues()}

            <InfoWindow
              onClose={this.removeSelectedClueAndInfoWindow}
              marker={this.state.activeMarker}
              visible={this.state.showingInfoWindow}>
              <ClueInfo clue={this.state.selectedClue}/>
            </InfoWindow>
          </Map>
        </div>

        <div className="bottom-right-absolute">
          <ToggleButtonGroup type="radio"
                             name="clue-visibility-radio"
                             onChange={(value) => this.setState({clueVisibility: value})}
                             defaultValue={this.state.clueVisibility}>

            <ToggleButton value={CLUE_VISIBILITY.ALL}>
              {CLUE_VISIBILITY.ALL}
            </ToggleButton>
            <ToggleButton value={CLUE_VISIBILITY.COMPLETED}>
              {CLUE_VISIBILITY.COMPLETED}
            </ToggleButton>
            <ToggleButton value={CLUE_VISIBILITY.UNCOMPLETED}>
              {CLUE_VISIBILITY.UNCOMPLETED}
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      </div>
    );
  }

  removeSelectedClueAndInfoWindow = () => {
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
    let cluesToShow = this.filterClues(this.state.clueVisibility);

    return cluesToShow.map((clue, index) => {
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

  filterClues(clueVisibility) {
    const allClues = this.state.clues;

    switch (clueVisibility) {
      case CLUE_VISIBILITY.ALL:
        return allClues;
      case CLUE_VISIBILITY.COMPLETED:
        return allClues.filter(clue => clue.completed);
      case CLUE_VISIBILITY.UNCOMPLETED:
        return allClues.filter(clue => !clue.completed);
      default:
        alert(`Expected a valid clue visibility, got: ${clueVisibility}`);
    }
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