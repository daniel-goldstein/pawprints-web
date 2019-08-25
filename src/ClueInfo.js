import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'react-bootstrap';
import { InfoWindow } from 'google-maps-react';

export default class ClueInfo extends React.Component {
  constructor(props) {
    super(props);
    this.infoWindowRef = React.createRef();
    this.contentElement = document.createElement(`div`);
  }

  // Annoying workaround since google.InfoWindow doesn't allow
  // event callbacks from within the component
  // https://stackoverflow.com/questions/53615413/how-to-add-a-button-in-infowindow-with-google-maps-react
  componentDidUpdate(prevProps) {
    if (this.props.children !== prevProps.children) {
      ReactDOM.render(
        this.props.children,
        this.contentElement
      );
      this.infoWindowRef.current.infowindow.setContent(this.contentElement);
    }
  }

  render() {
    return <InfoWindow ref={this.infoWindowRef} {...this.props} />;
  }
}
