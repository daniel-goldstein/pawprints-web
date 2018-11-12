import React from 'react';
import ReactDOM from 'react-dom';
import {cluesRef} from "./fire";

import { FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';

const initialState = {
  clueNumber: 0,
  title: "",
  location: null
};

export default class ClueUploadForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = initialState;
  }

  componentDidMount() {
    // Connect google search API to the search box
    let searchBoxInput = ReactDOM.findDOMNode(this.refs.searchBox);
    this.searchBox = new this.props.google.maps.places.SearchBox(searchBoxInput);
    this.searchBoxListener = this.searchBox.addListener('places_changed', this.onPlacesChanged);
  }

  handleChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;

    this.setState({ [name] : value });
  };

  onPlacesChanged = () => {
    let places = this.searchBox.getPlaces();
    let loc = places[0].geometry.location; // Grab the location of the first search result
    let latLng = {lat: loc.lat(), lng: loc.lng()};
    this.setState({location: latLng});
  };

  render() {
    return (
      <div className="dashboard-form">
        <h2>Drop a clue!</h2>
        <form onSubmit={this.handleSubmit}>

          <FormGroup>
            <ControlLabel>Clue Number</ControlLabel>
            <FormControl
              type="number"
              value={this.state.clueNumber}
              name="clueNumber"
              onChange={this.handleChange}
            />
          </FormGroup>

          <FormGroup>
            <ControlLabel>Title</ControlLabel>
            <FormControl
              type="text"
              value={this.state.title}
              name="title"
              onChange={this.handleChange}
            />
          </FormGroup>


          <FormGroup>
            <ControlLabel>Title</ControlLabel>
            <FormControl type="text" ref="searchBox"/>
          </FormGroup>

          <Button bsStyle="primary" type="submit" value="submit">Submit</Button>
        </form>
      </div>
    );
  }

  handleSubmit = e => {
    e.preventDefault();

    let clueNumber = this.state.clueNumber;
    let title = this.state.title;
    let location = this.state.location;

    if (!clueNumber || !title || !location) {
      alert("Please fill out all fields!");
      return;
    }

    let clue = {
      clueNumber: parseInt(clueNumber),
      title: title,
      latitude: location.lat,
      longitude: location.lng,
      completed: false
    };
    cluesRef.push(clue);

    this.setState(initialState);
  };

  componentWillUnmount() {
    this.searchBox.removeListener(this.searchBoxListener);
  }
}