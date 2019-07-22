import React, { Component } from "react";
import { Redirect } from 'react-router-dom'
import Title from "../components/Title";
import List from "../components/List";
import ListItem from "../components/ListItem";
import { Col, Row, Container } from "../components/Grid";
import { FormBtn } from "../components/Form"
import Stopwatch from "../components/Stopwatch";
import API from "../utils/API"
class Dashboard extends Component {
  state = {
    tasks: [],
    user: "",
    title: "",
    notes: "",
    
  };
  
  
  componentDidMount() {
    this.loadTasks();
  }

  loadTasks = () => {
    // if (!req.user){return res.redirect("/login")}
    API.getTasks()
      .then(res =>
        this.setState({ tasks: res.data, title: "", user: "", notes: "" })
      )
      .catch(err => console.log(err));
  };


  render() {
    return (
      <Container fluid>
        <Title>Top Task Dashboard</Title>
        <Row>
          <Col size="md-4">
            <List/>
          </Col>
          <Col size="md-4">
          <Stopwatch />
          </Col>
          <Col size="md-4">
          <List/>
          </Col>
        </Row>

      </Container>
    );
  }
}

export default Dashboard;
