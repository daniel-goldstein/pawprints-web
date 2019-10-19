import React from 'react';

import { cluesRef } from "./fire";

import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';

import {
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
      clueListId: this.props.clue.clueListId,
      clueNum: this.props.clue.clueNum,
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
      <Modal show={true}
             onHide={this.props.toggleShowingClueEditWindow}
             style={{opacity: 1, paddingTop: '150px'}}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Clue</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>

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
                <Form.Label>Status</Form.Label>
                <br /> {/* Don't know why this needs to be here */}

                <ToggleButtonGroup type="radio"
                                   name="completedStatus"
                                   data-toggle="buttons"
                                   onChange={(value) => this.setState({completedStatus: value})}
                                   defaultValue={this.state.completedStatus}>

                  <ToggleButton value={true}>Completed</ToggleButton>
                  <ToggleButton value={false}>Uncompleted</ToggleButton>
                </ToggleButtonGroup>
              </Form.Group>
              <Form.Group>
                <Form.Label>Crawl?</Form.Label>
                <Form.Check
                  type="checkbox"
                  checked={this.state.inCrawl}
                  onChange={() => this.setState({inCrawl: !this.state.inCrawl})}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Location</Form.Label>
                <LocationSearchBox google={this.props.google}
                                   onSelect={(loc) => this.setState({location: loc})}
                                   clearLocation={this.state.location === null}/>
              </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <div className="submit-delete-row">
            <Button onClick={this.handleDelete} disabled={VIEW_ONLY_MODE} variant="danger">
              Delete
            </Button>
            <Button onClick={this.handleSubmit} disabled={VIEW_ONLY_MODE}>
              Submit
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    );
  }

  handleSubmit = e => {
    if (VIEW_ONLY_MODE) { return; }
    e.preventDefault();

    let updatedClueFields = {
      clueListId: this.state.clueListId,
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

    if (window.confirm("Are you sure you want to delete this clue?")) {
      cluesRef.child(this.props.clue.key).remove();
      this.props.afterSubmit();
    }
  }
}
