import React from 'react';

export default class ClueInfo extends React.Component {
  render() {
    if (!this.props.clue) {
      return <div/>;
    }
    console.log(this.props.clue);

    let status = this.props.clue.completed ? "Completed" : "Uncompleted";

    return (
      <div>
        <h4>{this.props.clue.title}</h4>
        <h5>This clue is: {status}</h5>
      </div>
    );
  }
}