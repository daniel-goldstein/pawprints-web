import React, { Component } from 'react';
import ReactDOM from 'react-dom';
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

class MapContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      clues: [],
      selectedClue: null,
      activeMarker: null,
      showingInfoWindow: false,
      searchedLocation: null
    }
  }

  componentDidMount() {
    cluesRef.on('value', snapshot => {
      let clues = [];
      snapshot.forEach(item => {
        clues.push({ ...item.val(), key: item.key });
      });

      this.setState({ clues })
    });

    let searchBoxInput = ReactDOM.findDOMNode(this.refs.input);
    this.searchBox = new this.props.google.maps.places.SearchBox(searchBoxInput);
    this.searchBox.addListener('places_changed', this.onPlacesChanged);
  }

  onPlacesChanged = () => {
    let places = this.searchBox.getPlaces();
    let loc = places[0].geometry.location;
    let latLng = {lat: loc.lat(), lng: loc.lng()};
    this.setState({searchedLocation: latLng});
  };

  render() {
    return (
      <div>
        <input ref="input" type="text" />
        <Map google={this.props.google}
             zoom={14}
             onClick={this.onMapClicked}
             initialCenter={BOSTON}>

          {this.renderClues()}

          {this.state.searchedLocation === null ? undefined :
            <Marker
              key={0}
              position={this.state.searchedLocation}
              title={"No title"}
              onClick={(_, marker) => this.setSearchAsActiveMarker(marker)}
            />
          }

          <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}>
            {this.renderInfoWindowContent()}
          </InfoWindow>
        </Map>
      </div>
    );
  }

  renderInfoWindowContent() {
    if (this.state.activeMarker) {
      if (this.state.selectedClue) {
        return <ClueInfo clue={this.state.selectedClue}/>;
      }
      // Render form to add active marker as a clue
      return <ClueUploadForm loc={this.state.searchedLocation} />
    }

    // Child component required for InfoWindow even though it'll be hidden
    return <div>...</div>;
  }

  setSearchAsActiveMarker= (marker) => {
    this.setState({
      activeMarker: marker,
      showingInfoWindow: true,
      selectedClue: null
    });
  };

  onMapClicked = () => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null,
        selectedClue: null
      })
    }
  };

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

  onMarkerClick = (clue, marker) => {
    this.setState({
      selectedClue: clue,
      activeMarker: marker,
      showingInfoWindow: true
    });
  };

  componentWillUnmount() {
    this.searchBox.removeListener('places_changed', this.onPlacesChanged);
  }
}

export default GoogleApiWrapper({
  apiKey: (GOOGLE_MAPS_API_KEY)
})(MapContainer)