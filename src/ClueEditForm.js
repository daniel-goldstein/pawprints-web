import React from 'react';

import { cluesRef } from "./fire";

import Form from 'react-bootstrap/Form';

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
      inCrawl: this.props.clue.inCrawl,
      completedStatus: this.props.clue.completed,
      location: { lat: this.props.clue.latitude, lng: this.props.clue.longitude }
    };
  }

  handleChange = name => event => {
    this.setState({ [name] : event.target.value });
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
              onChange={this.handleChange("clueId")}
            />
          </FormGroup>

          <FormGroup>
            <ControlLabel>Title</ControlLabel>
            <FormControl
              type="text"
              value={this.state.title}
              onChange={this.handleChange("title")}
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
          <Form.Group>
            <ControlLabel>Crawl?</ControlLabel>
            <Form.Check
              type="checkbox"
              checked={this.state.inCrawl}
              onChange={() => this.setState({inCrawl: !this.state.inCrawl})}
            />
          </Form.Group>

          <FormGroup bsSize="large">
            <ControlLabel>Location</ControlLabel>
            <LocationSearchBox google={this.props.google}
                               onSelect={(loc) => this.setState({location: loc})}
                               clearLocation={this.state.location === null}/>
          </FormGroup>
          <div className="submit-delete-row">
            <Button type="submit" disabled={VIEW_ONLY_MODE} bsStyle="primary">
              Submit
            </Button>
            <Button onClick={this.handleDelete} disabled={VIEW_ONLY_MODE} bsStyle="danger">
              Delete
            </Button>
          </div>
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
      inCrawl: this.state.inCrawl,
      completed: this.state.completedStatus,
      latitude: this.state.location.lat,
      longitude: this.state.location.lng
    };
    cluesRef.child(this.props.clue.key).update(updatedClueFields);

    this.props.afterSubmit();
  };

  handleDelete = e => {
    if (VIEW_ONLY_MODE) { return; }
    e.preventDefault();

    cluesRef.child(this.props.clue.key).remove();
    this.props.afterSubmit();
  }
}
