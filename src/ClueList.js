import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';

export default class ClueList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: ""
    };
  }

  updateSearchTerm = event => { this.setState({search: event.target.value}) };

  render() {
    return (
      <div>
        <Form.Control placeholder="Search a clue..." value={this.state.search} onChange={this.updateSearchTerm}/>
        <ListGroup>
          {this.filterClues().map((clue, idx) =>
            <ListGroup.Item key={idx}>
              {this.clueString(clue)}
            </ListGroup.Item>
          )}
        </ListGroup>
      </div>
    );
  }

  filterClues = () => {
    const search = this.state.search.toLowerCase();
    return this.props.clues.filter(clue => {
      return this.clueFullName(clue).toLowerCase().includes(search) || clue.title.toLowerCase().includes(search)
    });
  };

  clueString = function(clue) {
    return `(${this.clueFullName(clue)}) ${clue.title}`
  };

  clueFullName(clue) {
    return `${clue.clueListId}${clue.clueNum}`
  }
}