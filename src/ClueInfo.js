import React from 'react';

export default class ClueInfo extends React.Component {
  render() {
    const clue = this.props.clue;
    if (!clue) {
      return <div/>;
    }

    let status = clue.completed ? "Completed" : "Not completed";

    return (
      <div>
        <h4>{clue.title} ({clue.clueListId}{clue.clueNum})</h4>
        <h5>{status}</h5>
      </div>
    );
  }
}
