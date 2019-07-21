import React, { Component } from "react";
import Title from "../components/Title";
import List from "../components/List";
import ListItem from "../components/ListItem";
import { Col, Row, Container } from "../components/Grid";
import { FormBtn } from "../components/Form"
import Stopwatch from "../components/Stopwatch";

class Dashboard extends Component {
  state = {
    tasks: [],
    user: "",
    title: "",
    notes: "",
    
  };
  


  render() {
    return (
      <Container fluid>
        <Title>Top Task Dashboard</Title>
        <Row>
          <List/>
          
          <Stopwatch />
        </Row>

      </Container>
    );
  }
}

export default Dashboard;
