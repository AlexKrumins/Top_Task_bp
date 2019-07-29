
import React, { Component } from "react";
// import { Stopwatch } from "hooked-react-stopwatch";
// import { Redirect } from 'react-router-dom'
// import ReactDOM from 'react-dom';

import Title from "../components/Title";
import { Col, Row, Container } from "../components/Grid";
import { Input, TextArea, FormBtn } from "../components/Form";
import { DragDropContext } from 'react-beautiful-dnd';
import {Stopwatch} from "../components/Stopwatch";
import API from "../utils/API";
import List from '../components/List';
import ListItem from '../components/ListItem';
import HList from '../components/HList';
import HListItem from '../components/HListItem';
import moment from "moment";
import { FaPlay, FaPause, FaReply } from "react-icons/fa";
import OptimizedIcon from "../components/OptimizedIcon";

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;
    console.log("result", result)
    return result;
};


class Dashboard extends Component {
  state = {
    left: [],
    right: [],
    bottom: [],
    helm: [],

    title: "",
    notes: "",
    uuid: this.props.match.params.uuid,
    isfavorite: false,
    isActive: false,

    startTime: null,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
    stashedTime: 0,
    isTimerStarted: false,
    intervalTimer: null
  };

  

  id2List = {
    left: 'left',
    right: 'right',
    bottom: 'bottom',
    helm: 'helm',
  };
  

    
  componentDidMount = () => {
    this.loadTasks();
    clearInterval(this.state.intervalTimer)
  }


  getList = id => this.state[this.id2List[id]];

  onDragEnd = (result) => {
    this.updateTask(result.draggableId, result.destination.droppableId);
    console.log("onDrageEnd result", result)
    const { source, destination } = result;
    // dropped outside the list
    if (!destination) {
        return;
    }
    if (source.droppableId === destination.droppableId) {
      const tasks = reorder(
          this.getList(source.droppableId),
          source.index,
          destination.index
      );
      let state = { tasks };
      if (source.droppableId === 'left') {state = { left: tasks }};
      if (source.droppableId === 'right') {state = { right: tasks }};
      if (source.droppableId === 'bottom') {state = { bottom: tasks }};
      if (source.droppableId === 'helm') {state = { helm: tasks }}
      this.setState(state);
    } else {
      const result = move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination
      );
      if(result.left){this.setState({left: result.left})};
      if(result.right){this.setState({right: result.right})};
      if(result.bottom){this.setState({bottom: result.bottom})};
      if(result.helm){this.setState({bottom: result.helm})};
    };
  };

  loadTasks = () => {
    if (!this.state.uuid) { return window.location.replace("/login") }
    else{
      API.getTasks(this.state.uuid)
      .then(res => {
        let todo = res.data.filter(task => {return (task.active)})
        let faves = res.data.filter(task => {return (task.favorite && !task.active)})
        let everythingElse = res.data.filter(task => {return (!task.favorite && !task.active)})
        this.setState({ 
          left: todo, 
          right: faves, 
          bottom: everythingElse, 
          title: "", 
          notes: "",
          user: this.props.match.params.uuid,
        })
          console.log("bottom", this.state.bottom)
          console.log("right", this.state.right)
          console.log("left", this.state.left)
      })
      .catch(err => console.log(err));
    }
  };

  deleteTask = id => {
    API.deleteTask(id)
      .then(res => this.loadTasks())
      .catch(err => console.log(err))
  };

  updateTask = (id, destination)  => {
    let newStatus = {}
      if (destination === "left") { newStatus = {active: true} }
      if (destination === "right") { newStatus = {favorite: true, active: false}}
      if (destination === "bottom") { newStatus = {favorite: false, active: false}}
    const taskData = {
      id,
      ...newStatus
    }
    console.log("taskData", taskData)
    API.updateTask(taskData)
      .then(res => console.log(res.config.data))
      .catch(err => console.log(err))
  };

  handleInputChange = event => {
    const target = event.target
    const value = target.type === "checkbox" ? target.checked : target.value
    const name = target.name;
    this.setState({[name]: value});
    console.log("seconds",this.state.seconds)
    console.log("startTime",this.state.startTime)
    console.log("stashedTime",this.state.stashedTime)
  };

  handleFormSubmit = event => {
    event.preventDefault();
    if (this.state.title) {
      API.saveTask({
        title: this.state.title,
        notes: this.state.notes,
        UserUuid: this.state.uuid,
        favorite: this.state.isfavorite,
        active: this.state.isActive
      })
      .then(res => this.loadTasks())
      .catch(err => console.log(err));
    }
  };
/////////////////////////// Stopwatch Controls
  calculateTimeDiff = (startTime, stashedTime) => {
    let timeDiff = moment.duration(moment().diff(startTime));
    if (stashedTime) timeDiff = timeDiff.add(stashedTime);

    return timeDiff;
  };

  startTimer = () => {
    if(!this.state.isTimerStarted) {
      const startTime = moment();
      const updateTimer = () => {
        const timeDiff = this.calculateTimeDiff(startTime, this.state.stashedTime);
        this.setState({
          startTime,
          hours: timeDiff.hours(),
          minutes: timeDiff.minutes(),
          seconds: timeDiff.seconds(),
          milliseconds: timeDiff.milliseconds(),
          isTimerStarted: true,
          // intervalTimer: setInterval(updateTimer, 50)
        });
      };
      this.state.intervalTimer = setInterval(updateTimer, 50);
    };
  };

  stopTimer = () => {
    if (this.state.isTimerStarted) {
      clearInterval(this.state.intervalTimer);
      const timeSpent = moment.duration(moment().diff(this.state.startTime));
      timeSpent.add(this.state.stashedTime);
      this.setState({
        startTime: null,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
        stashedTime: timeSpent,
        isTimerStarted: false,
        intervalTimer: null
      })
    }
  }

  render = () => {
    return (
      <Container fluid>
        <Title>Top Task Dashboard</Title>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Row>
            <Col size="md-4">
              <h2>Today's Tasks</h2>
                <List droppableId="left">
                  {(this.state.left.length >0 ) ? (
                    this.state.left.map((task, index) => (
                    <ListItem
                      key={task.id}
                      draggableId={task.id}
                      title={task.title}
                      index={index}
                      deleteTask={this.deleteTask}
                    />
                    ))) : (
                    <div>
                      Create a plan by dragging tasks to this bar
                    </div>
                  )}
                </List>
              </Col>
              <Col size="md-4">
                <OptimizedIcon Icon={FaPlay} onClick={this.startTimer} />
                <OptimizedIcon Icon={FaPause} onClick={this.stopTimer} />

                <form>
                  <h1>Create a new task</h1>
                  <Input
                    value={this.state.title}
                    onChange={this.handleInputChange}
                    name="title"
                    placeholder="Task Name (required)"
                  />
                  <TextArea
                    value={this.state.notes}
                    onChange={this.handleInputChange}
                    name="notes"
                    placeholder="Notes (Optional)"
                  />
                  <Row>
                    <Col size="md-6">
                      <label>
                        <input
                          name="isActive"
                          type="checkbox"
                          value={this.state.isActive}
                          onChange={this.handleInputChange}
                        />
                        Add to Today's Tasks
                      </label>
                      <br></br>
                      <label>
                        <input
                          name="isfavorite"
                          type="checkbox"
                          value={this.state.isfavorite}
                          onChange={this.handleInputChange}
                        />
                        Add to Favorites
                      </label>
                    </Col>
                    <Col size="md-6">
                      <FormBtn
                        disabled={!this.state.title}
                        onClick={this.handleFormSubmit}
                      >
                        Add Task to Library
                      </FormBtn>
                    </Col>
                  </Row> 
                </form>
              </Col>
              <Col size="md-4">
              <h2>Favorites</h2>
                <List droppableId="right">
                  {(this.state.right.length > 0) ? (
                    this.state.right.map((task, index) => (
                      <ListItem
                      key={task.id}
                      draggableId={task.id}
                      title={task.title}
                      index={index}
                      deleteTask={this.deleteTask}
                    />
                    ))) : (
                    <div>
                      Drag tasks here to add them to your favorites
                    </div>
                  )}
                </List>
              </Col>
          </Row>
          <Row>
            <h2>Recently Added Tasks</h2>
          </Row>
          <Row>
            <HList droppableId="bottom" direction="horizontal">
              {(this.state.bottom.length > 0) ? (
                this.state.bottom.map((task, index) => (
                <HListItem
                  key={task.id}
                  draggableId={task.id}
                  title={task.title}
                  index={index}
                  deleteTask={this.deleteTask}
                />
                ))) : (
                <div>
                  Start Adding Tasks to your library. They'll appear down here.
                </div>
              )}
            </HList>
          </Row>
        </DragDropContext>
      </Container>
    );
  };
};

export default Dashboard;
