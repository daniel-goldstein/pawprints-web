import React, { Component } from 'react';
import {GoogleApiWrapper, Map, Marker, InfoWindow} from 'google-maps-react';
import { ToggleButtonGroup, ToggleButton, Modal, Button }
from 'react-bootstrap';

import './App.css';

import { cluesRef, huntersRef } from "./fire";
import { GOOGLE_MAPS_API_KEY } from "./properties";
import ClueInfo from './ClueInfo';
import ClueUploadForm from './ClueUploadForm';
import ClueEditForm from "./ClueEditForm";

import demonHusky from './husky.png';

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
      hunters: [],
      selectedClue: null,
      selectedClueMarker: null,
      selectedHunter: null,
      selectedHunterMarker: null,
      showingClueEditWindow: false,
      clueVisibility: CLUE_VISIBILITY.ALL
    }
  }

  componentDidMount() {
    this.fetchClueData();
    this.fetchHunterData();
  }

  fetchClueData() {
    //Listen for ANY updates to clues and sync with clues state
    cluesRef.on('value', snapshot => {
      let clues = [];
      snapshot.forEach(item => {
        clues.push({ ...item.val(), key: item.key });
      });

      this.setState({ clues })
    });
  }

  fetchHunterData() {
    huntersRef.on('value', snapshot => {
      let hunters = [];
      snapshot.forEach(item => {
        hunters.push({ ...item.val(), name: item.key});
      });

      this.setState({ hunters });
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
               onClick={this.removeFocus}
               initialCenter={BOSTON}>

            {this.renderClues()}
            {this.renderHunters()}

            <InfoWindow
              onClose={this.removeFocus}
              marker={this.state.selectedClueMarker}
              visible={this.state.selectedClue !== null}>
              <ClueInfo clue={this.state.selectedClue} />
            </InfoWindow>
            <InfoWindow
              onClose={this.removeFocus}
              marker={this.state.selectedHunterMarker}
              visible={this.state.selectedHunter !== null}>
              <h4>{this.state.selectedHunter ? this.state.selectedHunter.name : undefined}</h4>
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

        <Button className="top-right-absolute"
                bsStyle="primary"
                disabled={!this.state.selectedClue} // Only allow editing when clue selected
                onClick={this.toggleShowingClueEditWindow}>
          Edit Clue
        </Button>

        <Modal show={this.state.showingClueEditWindow}
               onHide={this.toggleShowingClueEditWindow}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Clue</Modal.Title>
            <ClueEditForm google={this.props.google} clue={this.state.selectedClue} afterSubmit={this.removeFocus}/>
          </Modal.Header>
        </Modal>
      </div>
    );
  }

  removeFocus = () => {
    if (this.state.selectedClue || this.state.selectedHunter) {
      this.setState({
        selectedClue: null,
        selectedClueMarker: null,
        selectedHunter: null,
        selectedHunterMarker: null,
        showingClueEditWindow: false
      });
    }
  };

  // Render all the clue markers
  renderClues() {
    const cluesToShow = this.filterClues(this.state.clueVisibility);

    return cluesToShow.map((clue, index) => {
      const coords = { lat: clue.latitude, lng: clue.longitude };

      return (
        <Marker
          key={index}
          position={coords}
          title={clue.title}
          onClick={(_, marker) => this.selectClue(clue, marker)}
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

  renderHunters() {
    return this.state.hunters.map(hunter => {
      const coords = { lat: hunter.latitude, lng: hunter.longitude };

      return (
        <Marker
          key={hunter.name}
          position={coords}
          title={hunter.name}
          icon={{
            url: demonHusky,
            anchor: new this.props.google.maps.Point(32,32),
            scaledSize: new this.props.google.maps.Size(32,32)}}
          onClick={(_, marker) => this.selectHunter(hunter, marker)}
        />
      );
    });
  }

  // Select the given clue/marker to populate the info window
  selectClue = (clue, marker) => {
    this.setState({
      selectedClue: clue,
      selectedClueMarker: marker
    });
  };

  selectHunter = (hunter, marker) => {
    this.setState({
      selectedHunter: hunter,
      selectedHunterMarker: marker
    });
  };

  toggleShowingClueEditWindow = () => {
    let prevValue = this.state.showingClueEditWindow;
    this.setState({showingClueEditWindow: !prevValue});
  };
}

export default GoogleApiWrapper({
  apiKey: (GOOGLE_MAPS_API_KEY)
})(Dashboard)
