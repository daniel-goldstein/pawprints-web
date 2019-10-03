import React from 'react';
import ReactDOM from 'react-dom';
import {cluesRef} from "./fire";
import { VIEW_ONLY_MODE } from "./properties";

import { Form, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';

import LocationSearchBox from './LocationSearchBox';

const initialState = {
  clueListId: "",
  clueNum: 0,
  inCrawl: false,
  title: "",
  location: null
};

export default class ClueUploadForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = initialState;
  }

  handleChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;

    this.setState({ [name] : value });
  };

  render() {
    return (
      <div className="dashboard-form">
        <h2>Drop a clue!</h2>
        <form onSubmit={this.handleSubmit}>

          <div className="side-by-side">
            <FormGroup bsSize="large">
              <ControlLabel>Clue List ID</ControlLabel>
              <FormControl
                type="text"
                value={this.state.clueListId}
                name="clueListId"
                onChange={this.handleChange}
              />
            </FormGroup>
            <FormGroup bsSize="large">
              <ControlLabel>Clue #</ControlLabel>
              <FormControl
                type="number"
                value={this.state.clueNum}
                name="clueNum"
                onChange={this.handleChange}
              />
            </FormGroup>
          </div>

          <FormGroup bsSize="large">
            <ControlLabel>Title</ControlLabel>
            <FormControl
              type="text"
              value={this.state.title}
              name="title"
              onChange={this.handleChange}
            />
          </FormGroup>


          <FormGroup bsSize="large">
            <ControlLabel>Location</ControlLabel>
            <LocationSearchBox google={this.props.google}
                               onSelect={(loc) => this.setState({location: loc})}
                               clearLocation={this.state.location == null}/>
          </FormGroup>

          <Button bsStyle="primary" type="submit" value="submit" disabled={VIEW_ONLY_MODE}>
            Submit
          </Button>
          { VIEW_ONLY_MODE && <ControlLabel>This application is in view-only mode</ControlLabel>}
        </form>
      </div>
    );
  }

  handleSubmit = e => {
    if (VIEW_ONLY_MODE) { return; }

    e.preventDefault();

    let clueListId = this.state.clueListId;
    let clueNum = this.state.clueNum;
    let title = this.state.title;
    let location = this.state.location;

    if (!clueListId || !clueNum || !title || !location) {
      alert("Please fill out all fields!");
      return;
    }

    let clue = {
      clueListId: clueListId,
      clueNum: clueNum,
      title: title,
      latitude: location.lat,
      longitude: location.lng,
      completed: false
    };
    cluesRef.push(clue);

    // Go back to initial form state
    this.setState(initialState);
  };
}
