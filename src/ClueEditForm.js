import React from 'react';

import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

export default class ClueEditForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: ""
    };
  }

  handleChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;

    this.setState({ [name] : value });
  };

  render() {
    // return (
    //   <div className="dashboard-form" style={{width: '80%'}}>
    //     <form>
    //       <FormGroup>
    //         <ControlLabel>Working example with validation</ControlLabel>
    //         <FormControl
    //           type="text"
    //           value={this.state.value}
    //           placeholder="Enter text"
    //           onChange={this.handleChange}
    //         />
    //         <FormControl.Feedback />
    //       </FormGroup>
    //     </form>
    //   </div>
    // );
    return <div>Hi!</div>;
  }
}