import React, { Component } from 'react';
import {GoogleApiWrapper, Map, Marker, InfoWindow} from 'google-maps-react';
import Button from 'react-bootstrap/Button';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';

import Form from 'react-bootstrap/Form';

import './App.css';

import { cluesRef, huntersRef } from "./fire";
import { GOOGLE_MAPS_API_KEY } from "./properties";
import ClueInfo from './ClueInfo';
import ClueUploadForm from './ClueUploadForm';
import ClueEditForm from "./ClueEditForm";
import ClueList from "./ClueList";

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

const DISPLAY_ALL_LISTS = "All Lists";

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
      clueVisibility: CLUE_VISIBILITY.ALL,
      showingOnlyCrawls: false,
      visibleClueList: DISPLAY_ALL_LISTS
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
          <ClueUploadForm google={this.props.google} clues={this.state.clues}/>
        </div>

        <div className="dashboard-center" id="map">
          <Map google={this.props.google}
               zoom={14}
               onClick={this.removeFocus}
               initialCenter={BOSTON}>

            {this.renderClues()}
            {this.renderHunters()}

            <ClueInfo
              onClose={this.removeFocus}
              marker={this.state.selectedClueMarker}
              visible={this.state.selectedClue !== null}>
              <div>
                { this.state.selectedClue !== null && this.renderClueInfo() }
                <Button onClick={this.toggleShowingClueEditWindow}>Edit</Button>
              </div>
            </ClueInfo>
            <InfoWindow
              onClose={this.removeFocus}
              marker={this.state.selectedHunterMarker}
              visible={this.state.selectedHunter !== null}>
              <h4>{this.state.selectedHunter ? this.state.selectedHunter.name : undefined}</h4>
            </InfoWindow>
          </Map>
          <div className="bottom-left-absolute">
            <Form.Control as="select" onChange={(e) => this.setState({visibleClueList: e.target.value})}>
              <option value={DISPLAY_ALL_LISTS}>{DISPLAY_ALL_LISTS}</option>
              {this.availableClueLists().map( listId => <option value={listId}>{listId}</option> )}
            </Form.Control>
            <ToggleButtonGroup type="checkbox"
                               data-toggle="buttons"
                               onChange={() => this.setState({showingOnlyCrawls: !this.state.showingOnlyCrawls}) }>
              <ToggleButton>Only Crawls</ToggleButton>
            </ToggleButtonGroup>
          </div>
          <div className="bottom-right-absolute">
            <ToggleButtonGroup name="clue-visibility-radio"
                               data-toggle="buttons"
                               onChange={value => this.setState({clueVisibility: value})}
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

          {this.state.showingClueEditWindow && this.state.selectedClue !== null ?
            <ClueEditForm google={this.props.google}
                          clue={this.state.selectedClue}
                          afterSubmit={this.removeFocus}
                          toggleShowingClueEditWindow={this.toggleShowingClueEditWindow}/>
            : undefined }
        </div>

        <div className="dashboard-right">
          <ClueList clues={this.visibleClues()} />
        </div>
      </div>
    );
  }

  removeFocus = () => {
    if (this.state.selectedClue !== null || this.state.selectedHunter) {
      this.setState({
        selectedClue: null,
        selectedHunter: null,
        selectedHunterMarker: null,
        showingClueEditWindow: false
      });
    }
  };

  // Render all the clue markers
  renderClues() {
    const cluesToShow = this.visibleClues();

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

  visibleClues = () => {
    let allClues = this.state.clues;

    if (this.state.visibleClueList !== DISPLAY_ALL_LISTS) {
      allClues = allClues.filter(clue => clue.clueListId === this.state.visibleClueList);
    }

    if (this.state.showingOnlyCrawls) {
      allClues = allClues.filter(clue => clue.inCrawl);
    }

    switch (this.state.clueVisibility) {
      case CLUE_VISIBILITY.ALL:
        return allClues;
      case CLUE_VISIBILITY.COMPLETED:
        return allClues.filter(clue => clue.completed);
      case CLUE_VISIBILITY.UNCOMPLETED:
        return allClues.filter(clue => !clue.completed);
      default:
        alert(`Expected a valid clue visibility, got: ${this.state.clueVisibility}`);
    }
  };

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

  renderClueInfo() {
    let clue = this.state.selectedClue;
    let status = clue.completed ? "Complete" : "Not Completed";
    return (
      <div>
        <h4>{clue.title} ({clue.clueListId}{clue.clueNum})</h4>
        {clue.inCrawl ? <h5>Crawl</h5> : undefined}
        <h5>{status}</h5>
      </div>
    );
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

  availableClueLists = () => {
    return Array.from(new Set(this.state.clues.map(clue => clue.clueListId))).sort()
  }
}

export default GoogleApiWrapper({
  apiKey: (GOOGLE_MAPS_API_KEY)
})(Dashboard)
