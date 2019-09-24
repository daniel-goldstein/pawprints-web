import React from 'react';
import ReactDOM from 'react-dom';

import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';

export default class LocationSearchBox extends React.Component {

  componentDidMount() {
    // Connect google search API to the search box
    this.searchBoxInput = ReactDOM.findDOMNode(this.refs.searchBox);
    this.searchBox = new this.props.google.maps.places.SearchBox(this.searchBoxInput);
    this.searchBoxListener = this.searchBox.addListener('places_changed', this.onPlacesChanged);
  }

  componentDidUpdate() {
    if (this.props.clearLocation) {
      this.searchBoxInput.value = "";
    }
  }

  onPlacesChanged = () => {
    let places = this.searchBox.getPlaces();
    let loc = places[0].geometry.location; // Grab the location of the first search result
    let latLng = {lat: loc.lat(), lng: loc.lng()};
    this.props.onSelect(latLng);
  };

  render() {
    return <FormControl type="text" ref='searchBox' />;
  }
}
