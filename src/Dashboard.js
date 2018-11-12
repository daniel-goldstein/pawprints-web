import React, { Component } from 'react';
import {GoogleApiWrapper, Map, Marker, InfoWindow} from 'google-maps-react';
import { ToggleButtonGroup, ToggleButton, Modal, Button }
from 'react-bootstrap';

import './App.css';

import { cluesRef } from "./fire";
import { GOOGLE_MAPS_API_KEY } from "./properties";
import ClueInfo from './ClueInfo';
import ClueUploadForm from './ClueUploadForm';
import ClueEditForm from "./ClueEditForm";

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
      showingClueEditWindow: false,
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
               onClick={this.removeClueFocus}
               initialCenter={BOSTON}>

            {this.renderClues()}

            <InfoWindow
              onClose={this.removeClueFocus}
              marker={this.state.activeMarker}
              visible={this.state.showingInfoWindow}>
              <ClueInfo clue={this.state.selectedClue} />
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
            <ClueEditForm clue={this.state.selectedClue} onSubmit={this.updateClue}/>
          </Modal.Header>
        </Modal>
      </div>
    );
  }

  removeClueFocus = () => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null,
        selectedClue: null,
        showingClueEditWindow: false
      })
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

  toggleShowingClueEditWindow = () => {
    let prevValue = this.state.showingClueEditWindow;
    this.setState({showingClueEditWindow: !prevValue});
  };

  // Handle submit of clue editing form
  updateClue = (updatedClueFields) => {
    cluesRef.child(this.state.selectedClue.key).update(updatedClueFields);

    this.removeClueFocus();
  }
}

export default GoogleApiWrapper({
  apiKey: (GOOGLE_MAPS_API_KEY)
})(Dashboard)