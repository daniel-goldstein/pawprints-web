import React from 'react';

import { cluesRef } from "./fire";

import {
  FormGroup,
  ControlLabel,
  FormControl,
  ToggleButtonGroup,
  ToggleButton,
  Button
}
from 'react-bootstrap';
import {VIEW_ONLY_MODE} from "./properties";

import LocationSearchBox from './LocationSearchBox';
import './App.css';

export default class ClueEditForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      clueId: this.props.clue.clueId,
      title: this.props.clue.title,
      completedStatus: this.props.clue.completed,
      location: { lat: this.props.clue.latitude, lng: this.props.clue.longitude }
    };
  }

  handleChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;

    this.setState({ [name] : value });
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <FormGroup>
            <ControlLabel>Clue ID</ControlLabel>
            <FormControl
              type="text"
              value={this.state.clueId}
              name="clueId"
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
            <ControlLabel>Status</ControlLabel>
            <br /> {/* Don't know why this needs to be here */}
            <ToggleButtonGroup type="radio"
                               name="completedStatus"
                               onChange={(value) => this.setState({completedStatus: value})}
                               defaultValue={this.state.completedStatus}>

              <ToggleButton value={true}>Completed</ToggleButton>
              <ToggleButton value={false}>Uncompleted</ToggleButton>
            </ToggleButtonGroup>
          </FormGroup>

          <FormGroup bsSize="large">
            <ControlLabel>Location</ControlLabel>
            <LocationSearchBox google={this.props.google}
                               onSelect={(loc) => this.setState({location: loc})}
                               clearLocation={this.state.location == null}/>
          </FormGroup>
          <Button type="submit"
                  disabled={VIEW_ONLY_MODE}
                  bsStyle="primary">
            Submit</Button>
          <Button disabled={VIEW_ONLY_MODE}
                  bsStyle="danger">
            Delete</Button>
        </form>
      </div>
    );
  }

  handleSubmit = e => {
    if (VIEW_ONLY_MODE) { return; }
    e.preventDefault();

    let updatedClueFields = {
      clueId: this.state.clueId,
      title: this.state.title,
      completed: this.state.completedStatus,
      latitude: this.state.location.lat,
      longitude: this.state.location.lng
    };
    cluesRef.child(this.props.clue.key).update(updatedClueFields);

    this.props.postSubmit();
  }
}
