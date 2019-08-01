import React, { Component } from "react";
import Nav from "../components/Nav";
import { Col, Row, Container } from "../components/Grid";

import API from "../utils/API";

class Report extends Component {
  state = {
    tasks: {},
    uuid: this.props.match.params.uuid
  };
  // When this component mounts, grab the book with the _id of this.props.match.params.id
  // e.g. localhost:3000/books/599dcb67f0f16317844583fc
  componentDidMount() {
    API.getTasks(this.props.match.params.id)
      .then(res => this.setState({ tasks: res.data }))
      .catch(err => console.log(err));
  }

  render() {
    return (
      <Container fluid>
        
      <Nav uuid={this.state.uuid}/>

        <h1>
          REPORT
        </h1>
      </Container>
    )
  }
}
export default Report;
