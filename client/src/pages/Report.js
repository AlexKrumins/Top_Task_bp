import React, { Component } from "react";
import Nav from "../components/Nav";
import {Container } from "../components/Grid";
import Share from "../components/share.png"
import API from "../utils/API";
import ListItem from "components/ListItem";
import moment from "moment";

// const displayTime = (moment.utc(moment.duration(task.stashedTime, "ms").asMilliseconds()).format("H:mm:ss"))

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
    console.log("id", id)
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
        <div>
          <h2>{this.state.task.title}</h2>
          <p><strong>Task Created</strong> {moment(this.state.task.createdAt).format('MMMM Do YYYY, h:mm:ss a')} </p>
          <p><strong>Task Last Updated</strong> {moment(this.state.task.updatedAt).format('MMMM Do YYYY, h:mm:ss a')} </p>
          <p><strong>Time Spent</strong> {(moment.utc(moment.duration(this.state.task.stashedTime, "ms").asMilliseconds()).format("H:mm:ss"))}</p>
          <p>{this.state.task.notes}</p>
          <button onClick={() => {window.location.replace("/report/" + this.state.uuid)}}>Return to Task List</button>
        </div>
      ) : (
        this.state.taskList.map((task, index) => (
          
        <div 
          className="alert alert-secondary" 
          role="alert"
          key={task.id}
          id={task.id}
          onClick={() => {
            this.getTaskInfo(task.id)
          }}
        >
          <h4>{task.title}</h4>
          <p>Task Created: {moment(task.createdAt).format('MMMM Do YYYY, h:mm:ss a')} </p>
          <p>Time Spent: {(moment.utc(moment.duration(task.stashedTime, "ms").asMilliseconds()).format("H:mm:ss"))}</p>
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
