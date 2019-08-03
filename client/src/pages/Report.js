import React, { Component } from "react";
import Nav from "../components/Nav";
import {Container } from "../components/Grid";
import Share from "../components/share.png"
import API from "../utils/API";

class Report extends Component {
  state = {
    task: {},
    id: this.props.match.params.id
  };
  // When this component mounts, grab the book with the _id of this.props.match.params.id
  // e.g. localhost:3000/books/599dcb67f0f16317844583fc
  componentDidMount = () => {
    console.log(this.state)
    this.loadTask();
  }
  
  loadTask = () => {
    console.log(this.state)
    API.getTaskInfo(this.state.id)
    .then(res => {
      const task = res.data
      this.setState({task})
    })
    console.log(this.state)

    //   .catch(err => console.log(err));
  }

  render() {
    return (
      <Container fluid>
        
      <Nav uuid={this.state.uuid}/>
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
      <div className="col-10">

        <img src={Share}></img>
      </div>
      </Container>
    )
  }
}
export default Report;
