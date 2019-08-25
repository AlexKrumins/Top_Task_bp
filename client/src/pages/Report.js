import React, { Component } from "react";
import Nav from "../components/Nav";
import {Container } from "../components/Grid";
import Share from "../components/share.png"
import API from "../utils/API";
import ListItem from "components/ListItem";

class Report extends Component {
  state = {
    task: {},
    taskList: [],
    id: this.props.match.params.id,
    uuid: this.props.match.params.uuid,
  };

  componentDidMount = () => {
    console.log(this.state)
    this.loadTask();
  }
  
  loadTask = () => {
    if (this.state.id) {
      API.getTaskInfo(this.state.id)
      .then(res => {
        const task = res.data
        this.setState({task})
      })
    } else {
      API.getTasks(this.state.uuid)
      .then(res => {
        console.log(res.data)
        const taskList = res.data
        this.setState({taskList})
      })
    }
  }

  getTaskInfo = id => {
    API.getTaskInfo(id)
      .then(res => {
        console.log(res.data)
        window.location.replace("/report/" + [this.state.uuid] + "/" + [res.data.id])
      })
  }

  render() {
    return (
      <Container fluid>
        
      <Nav uuid={this.state.uuid}/>
      {this.state.id ? (
        <div className="col-2">
          <h1>
            Report
          </h1>
          <h5>
            {this.state.task.id}
          </h5>
          <h2>
            {this.state.task.title}
          </h2>
          <p>
            {this.state.task.createdAt}
          </p>
          <p>
            {this.state.task.updatedAt}
          </p>
          <p>
            {this.state.task.stashedTime}
          </p>
        </div>
      ) : (
        this.state.taskList.map((task, index) => (
        <div>
          {task.id}
        </div>
        ))
      )}

<div className="col-10">

        <img src={Share}></img>
      </div>
      </Container>
    )
  }
}
export default Report;
