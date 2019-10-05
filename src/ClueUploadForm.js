import React from 'react';
import {cluesRef} from "./fire";
import { VIEW_ONLY_MODE } from "./properties";

import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';

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

  handleChange = name => event => {
    this.setState({ [name] : event.target.value });
  };

  render() {
    return (
      <div className="dashboard-form">
        <h2>Drop a clue!</h2>
        <form onSubmit={this.handleSubmit}>

          <div className="side-by-side">
            <Form.Group>
              <Form.Label>Clue List ID</Form.Label>
              <Form.Control
                type="text"
                value={this.state.clueListId}
                onChange={this.handleChange("clueListId")}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Clue #</Form.Label>
              <Form.Control
                type="number"
                value={this.state.clueNum}
                onChange={this.handleChange("clueNum")}
              />
            </Form.Group>
          </div>

          <Form.Group>
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={this.state.title}
              onChange={this.handleChange("title")}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Crawl?</Form.Label>
            <Form.Check
              type="checkbox"
              onChange={() => this.setState({inCrawl: !this.state.inCrawl})}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Location</Form.Label>
            <LocationSearchBox google={this.props.google}
                               onSelect={(loc) => this.setState({location: loc})}
                               clearLocation={this.state.location === null}/>
          </Form.Group>

          <Button bsStyle="primary" type="submit" value="submit" disabled={VIEW_ONLY_MODE}>
            Submit
          </Button>
          { VIEW_ONLY_MODE && <Form.Label>This application is in view-only mode</Form.Label>}
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
      inCrawl: this.state.inCrawl,
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
