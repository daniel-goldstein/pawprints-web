import React from 'react';
//import {cluesRef} from "./fire";

export default class ClueUploadForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      clueNumber: 0,
      title: "",
    }
  }

  handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState({[name]: value});
  };

  render() {
    return (
      <div>
        <h2>Drop a clue!</h2>
        <form onSubmit={this.handleSubmit}>
          <label>
            Clue Number:
            <input type="number" value={this.state.clueNumber} onChange={this.handleChange}/>
          </label>
          <br />

          <label>
            Title:
            <input type="text" value={this.state.title} onChange={this.handleChange}/>
          </label>
          <br />

          <input type="submit" value="submit" />
        </form>
      </div>
    );
  }

  handleSubmit = e => {
    e.preventDefault();
    e.stopPropagation();

    // let clue = {
    //   clueNumber: this.state.clueNumber,
    //   title: this.state.title,
    //   latitude: this.props.loc.lat,
    //   longitude: this.props.loc.lng,
    //   completed: false
    // };
    alert("Hi!!");


    // cluesRef.push(clue);
  }
}