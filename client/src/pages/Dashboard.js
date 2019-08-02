import React, { Component } from "react";
// import { Stopwatch } from "hooked-react-stopwatch";
// import { Redirect } from 'react-router-dom'
// import ReactDOM from 'react-dom';

import Title from "../components/Title";
import Nav from "../components/Nav";
import { Col, Row, Container } from "../components/Grid";
import { Input, TextArea, FormBtn, SmallButton, Checkbox } from "../components/Form";
import { DragDropContext } from 'react-beautiful-dnd';
import { handleZerosPadding } from "../components/Stopwatch/utils";
import API from "../utils/API";
import List from '../components/List';
import ListItem from '../components/ListItem';
import HList from '../components/HList';
import HListItem from '../components/HListItem';
import moment from "moment";
import { FaPlay, FaPause } from "react-icons/fa";
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
    helmDropDisabled: false,

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
    console.log(this.state)
    this.loadTasks();
    clearInterval(this.state.intervalTimer)
  }


  getList = id => this.state[this.id2List[id]];

  onDragEnd = (result) => {
    console.log("onDragEnd result", result)
    const { source, destination, } = result;
    // dropped outside the list
    if (!destination) {
      return;
    } else if (this.state.isTimerStarted && source.droppableId === "helm") {
      return;
    } else if (source.droppableId === destination.droppableId) {
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
      const moveResult = move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination
      );

      this.updateTask(result);
      if(moveResult.left){this.setState({left: moveResult.left})};
      if(moveResult.right){this.setState({right: moveResult.right})};
      if(moveResult.bottom){this.setState({bottom: moveResult.bottom})};
      if(moveResult.helm){
        if (moveResult.helm.length < 1){
          this.setState({
            helm: moveResult.helm, 
            title: "",
            notes: "",
            helmDropDisabled: false,
            stashedTime: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            milliseconds: 0
          })
        } else {
          const stashedTime = moment.duration(moveResult.helm[0].stashedTime)
          const loadTime = {
            stashedTime,
            hours: stashedTime.hours(),
            minutes: stashedTime.minutes(),
            seconds: stashedTime.seconds(),
            milliseconds: stashedTime.milliseconds(),
          }
          this.setState({
            helm: moveResult.helm, 
            helmDropDisabled: true,
            title: moveResult.helm[0].title,
            notes: moveResult.helm[0].title,
            ...loadTime,
          })
        };
      };
    };
  };
      
  loadTasks = () => {
    if (!this.state.uuid) { return window.location.replace("/login") 
    } else{
      API.getTasks(this.state.uuid)
      .then(res => {
        console.log(res);
        let firstThing = res.data.filter(task => task.topTask)
        let faves = res.data.filter(task => {return (task.favorite && !task.topTask)})
        let todo = res.data.filter(task => {return (task.active && !task.favorite &&!task.topTask)})
        let everythingElse = res.data.filter(task => {return (!task.favorite && !task.active && !task.topTask)})
        let loadTime = {};
        if (firstThing.length>0) {
          const stashedTime = moment.duration(firstThing[0].stashedTime)
          loadTime = {
            stashedTime,
            hours: stashedTime.hours(),
            minutes: stashedTime.minutes(),
            seconds: stashedTime.seconds(),
            milliseconds: stashedTime.milliseconds(),
            helmDropDisabled: true,
          }
        }
        this.setState({ 
          helm: firstThing,
          left: todo, 
          right: faves, 
          bottom: everythingElse, 
          title: "", 
          notes: "",
          uuid: this.props.match.params.uuid,
          isfavorite: false,
          isActive: false,
          ...loadTime,
        })
        console.log("bottom", this.state.bottom)
        console.log("right", this.state.right)
        console.log("left", this.state.left)
        console.log("helm", this.state.helm)
        console.log("stashedTime", this.state.stashedTime)
      })
      .catch(err => console.log(err));
    }
  };

  deleteTask = id => {
    API.deleteTask(id)
      .then(res => this.loadTasks())
      .catch(err => console.log(err))
  };
  
  updateTask = (result)  => {
    let newStatus = {} 
      if (result.destination.droppableId === "left") { newStatus = {active: true} }
      if (result.destination.droppableId === "right") { newStatus = {favorite: true}}
      if (result.destination.droppableId === "bottom") { newStatus = {favorite: false, active: false}}
      if (result.destination.droppableId === "helm") { newStatus = {topTask: true}}
      if (result.source.droppableId === "helm") { newStatus = {...newStatus, topTask: false, title: this.state.title, notes:this.state.notes}}
      
    const taskData = {
      id: result.draggableId,
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
    console.log("event.target", event.target)
    console.log("this.state.isfavorite",this.state.isfavorite)
    console.log("this.state.bottom",this.state.bottom)
  };

  createTask = event => {
    event.preventDefault();
    if (this.state.title) {
      let fireItUp = null;
      if(!this.state.isActive && !this.state.isfavorite) {fireItUp = true}
      API.saveTask({
        title: this.state.title,
        notes: this.state.notes,
        UserUuid: this.state.uuid,
        favorite: this.state.isfavorite,
        active: this.state.isActive,
        topTask: fireItUp,
      })
      .then(res => {
        this.loadTasks()
        this.startTimer()
      })
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
    if(this.state.helm && !this.state.isTimerStarted) {
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
        });
      };
      this.setState({intervalTimer : setInterval(updateTimer, 50)});
    };
  };

  stopTimer = () => {
    if (this.state.isTimerStarted) {
      clearInterval(this.state.intervalTimer);
      const timeSpent = moment.duration(moment().diff(this.state.startTime));
      timeSpent.add(this.state.stashedTime);
      
      this.setState({
        startTime: null,
        isTimerStarted: false,
        intervalTimer: null,
        stashedTime: timeSpent
      })
      this.state.helm[0].stashedTime = timeSpent;
      const taskData ={
        id: this.state.helm[0].id,
        stashedTime: timeSpent
      }
      API.updateTask(taskData)
        .then(res => console.log(res))
        .catch(err => console.log(err))
    } else {return}
  };

  fullStop = async () => {
    await this.stopTimer()
    const newResult = {
      draggableId: this.state.helm[0].id,
      destination: {droppableId: "left"},
      source: {droppableId: "helm"},
    }
    this.onDragEnd(newResult)
  }

  render = () => {
    return (
      <Container fluid>
      <Nav uuid={this.state.uuid}/>
        <Title>Top Task Dashboard</Title>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Row>
            <Col size="md-4">
              <h2>Today's Tasks</h2>
                <List internalScroll="true" droppableId="left">
                  {(this.state.left.length >0 ) ? (
                    this.state.left.map((task, index) => (
                    <ListItem
                      key={task.id}
                      draggableId={task.id}
                      title={task.title}
                      notes={task.notes}
                      index={index}
                      completeTask={this.onDragEnd}
                      source = {"left"}
                      time = {task.stashedTime}
                    />
                    ))) : (
                    <div>
                      Create a to-do list by dragging tasks to this bar
                    </div>
                  )}
                </List>
              </Col>
              <Col size="md-4">
                <List droppableId="helm" isDropDisabled={this.state.helmDropDisabled} isDragDisabled={this.state.isTimerStarted}>
                {(this.state.helm.length > 0)? ([
                  (this.state.helm.map((task, index) => (
                      <ListItem
                      isDragDisabled={this.state.isTimerStarted}
                      key={task.id}
                      draggableId={task.id}
                      title={task.title}
                      index={index}
                      completeTask={this.fullStop}
                      source = {"helm"}
                      onChange={this.handleInputChange}
                      />
                      // <TextArea
                      // contenteditable="true" 
                      // onChange={this.handleInputChange} 
                      // value={this.state.notes}
                      // name="notes"
                      // placeholder={
                      //   !this.state.notes ? 
                      //   "(Click here to add/edit notes)"
                      //   : null
                      // }
                      // >
                      //   {this.state.notes ? this.state.notes : "(Click here to add/edit notes)"}
                      // </TextArea>
                      // </ListItem>
                  ))),
                    <div>
                      <h1>
                        {handleZerosPadding("hours", this.state.hours)}:
                        {handleZerosPadding("minutes", this.state.minutes)}:
                        {handleZerosPadding("seconds", this.state.seconds)}.
                        {handleZerosPadding("milliseconds", this.state.milliseconds)}
                      </h1>
                      {(!this.state.isTimerStarted) ? 
                        <OptimizedIcon Icon={FaPlay} onClick={this.startTimer} />
                      :
                        <OptimizedIcon Icon={FaPause} onClick={this.stopTimer} />
                      }
                      <SmallButton onClick={this.fullStop}>
                        Click here to create a new task
                      </SmallButton>
                    </div>
                  ]) : (
                    <form>
                    <div>Drag your Top Task here or Create New Task to begin tracking</div>
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
                    <Col size="md-4">
                      {!this.state.isfavorite ?
                        <label>
                          <Checkbox
                            name="isActive"
                            type="checkbox"
                            value={true}
                            onChange={this.handleInputChange}
                            />
                          Add to Today's Tasks
                        </label> 
                        : null
                      }
                      {!this.state.isActive ?
                        <label>
                          <Checkbox
                            name="isfavorite"
                            type="checkbox"
                            value={true}
                            onChange={this.handleInputChange}
                            />
                          Add to Favorites
                        </label>
                        : null
                      }
                    </Col>
                    <Col size="md-6">
                      <FormBtn
                        disabled={!this.state.title}
                        onClick={this.createTask}
                      >
                        {(this.state.isfavorite || this.state.isActive) ? (
                          "Add Task to Library"
                        ):(
                          "Start tracking this task"
                        )}
                      </FormBtn>
                    </Col>
                  </Row> 
                </form>
                  )}
                </List>
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
                      completeTask={this.onDragEnd}
                      source = {"right"}
                      time = {task.stashedTime}
                    />
                    ))) : (
                    <div>
                      Drag tasks here to store them in your favorites
                    </div>
                  )}
                </List>
              </Col>
          </Row>
          <Row>
            <h2>Recently Completed Tasks</h2>
          </Row>
          <Row>
            <HList internalScroll="true" droppableId="bottom" direction="horizontal">
              {(this.state.bottom.length > 0) ? (
                this.state.bottom.map((task, index) => (
                <HListItem
                  key={task.id}
                  draggableId={task.id}
                  title={task.title}
                  index={index}
                  deleteTask={this.deleteTask}
                  time = {task.stashedTime}
                />
                ))) : (
                <div>
                  As you complete tasks, they'll appear down here.
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