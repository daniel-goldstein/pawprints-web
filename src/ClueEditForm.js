import React from 'react';

import {
  FormGroup,
  ControlLabel,
  FormControl,
  ToggleButtonGroup,
  ToggleButton,
  Button
}
from 'react-bootstrap';

export default class ClueEditForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      clueNumber: this.props.clue.clueNumber,
      title: this.props.clue.title,
      completedStatus: this.props.clue.completed
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
          <Button type="submit" bsStyle="primary">Submit</Button>
        </form>
      </div>
    );
  }

  handleSubmit = e => {
    e.preventDefault();

    let updatedClueFields = {
      clueNumber: parseInt(this.state.clueNumber),
      title: this.state.title,
      completed: this.state.completedStatus
    };

    this.props.onSubmit(updatedClueFields);
  }
}