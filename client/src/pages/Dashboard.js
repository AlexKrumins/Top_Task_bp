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
import Main from "../components/Main";
import List from '../components/List';
import ListItem from '../components/ListItem';
import HList from '../components/HList';
import HListItem from '../components/HListItem';
import moment from "moment";
import { FaPlay, FaPause } from "react-icons/fa";
import OptimizedIcon from "../components/OptimizedIcon";
import "./style.css";

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

//  Moves an item from one list to another list (i.e. left/right/helm/bottom).
const move = (source, destination, droppableSource, droppableDestination) => {
  console.log("move dest", droppableDestination)  
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);
  
  destClone.splice(droppableDestination.index, 0, removed);
  
  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;
  return result;
};

//  Moves an item from any list to another position within the SAME list.
const swap = (source, destination, droppableSource, droppableDestination) => {
    console.log("swapped destination", droppableDestination)  
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [sRemoved] = sourceClone.splice(droppableSource.index, 1);
    const [dRemoved] = destClone.splice(0, 1);
    console.log("droppableDestination.index", droppableDestination.index)
    destClone.splice(0, 0, sRemoved);
    sourceClone.splice(droppableSource.index, 0, dRemoved);
    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;
    return result;
};


class Dashboard extends Component {
  state = {
    // the different tasks in the user's profile will be sorted into these lists, named after their postion within the DOM.
    left: [],
    right: [],
    bottom: [],
    helm: [],
    // These store information for any tasks being created.
    title: "",
    notes: "",
    uuid: this.props.match.params.uuid,
    isfavorite: false,
    isActive: false,
    helmDropDisabled: false,
    // These control the data of the timer.
    startTime: null,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
    stashedTime: 0,
    isTimerStarted: false,
    intervalTimer: null
  };

  // When the tasks are loaded, they are ascribed their list id's
  getList = id => this.state[this.id2List[id]];

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



  // if the top task is dragged, the timer will stop
  onDragStart = (result) => {
    console.log("onDragStart result", result)
    if (result.source.droppableId === "helm") {
      this.stopTimer()
    }
  }
  onDragEnd = async (result) => {
    console.log("onDragEnd result", result)
    const { source, destination, } = result;
    //if the top task is dragged away from helm with no destination, it will return to the helm and timer will resume
    if (source.droppableId === "helm" && !destination){
      this.startTimer()
    } else if (source.droppableId === "helm" && destination.droppableId === "helm"){
      this.startTimer()
    // if a task is dragged away from another list with no destination, it will return to its current list
    } else if (!destination) {
      return;
    // if a task is moved to a different spot in the list order, the list will be updated with the new order
    } else if (source.droppableId === destination.droppableId) {
      const tasks = reorder(
        this.getList(source.droppableId),
        source.index,
        destination.index
      );
      //the state will then be updated with the new order of tasks
      let state = { tasks };
      if (source.droppableId === 'left') {state = { left: tasks }};
      if (source.droppableId === 'right') {state = { right: tasks }};
      if (source.droppableId === 'bottom') {state = { bottom: tasks }};
      if (source.droppableId === 'helm') {state = { helm: tasks }}
      this.setState(state);
    } else {
      //if the task being dragged is moved to an entirely new list, the origin and destination will be cloned & updated with the task removed/added
      let moveResult = move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination
      );
      //if the task being dragged is moved to the helm but it is currently occupied by a Top-task, the timer will stop and the two tasks will swap places
      if (destination.droppableId === "helm" && this.state.helm.length > 0) {
        await this.stopTimer()
        moveResult = swap(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
        )
        this.updateTask({
          draggableId: this.state.helm[0].id,
          destination: { droppableId: [result.source]},
          source: {droppableId: "helm", index: 0}
        })
      }
      console.log("moveResult", moveResult)
      //the data specific to the task will then be updated to reflect its current list, and the API will be updated
      this.updateTask(result);
      if(moveResult.left){this.setState({left: moveResult.left})};
      if(moveResult.right){this.setState({right: moveResult.right})};
      if(moveResult.bottom){this.setState({bottom: moveResult.bottom})};
      //if there is no Top-task in the helm, it is replaced with a blank template to create a new task
      if(moveResult.helm){
        if (!moveResult.helm.length){
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
          //if the helm is now occupied, the timer will be updated with previously elapsed time and timer will start
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
          this.startTimer()
        };
      };
    };
  };
      
  loadTasks = () => {
    //if the user is not logged in, they are redirected to the login page
    if (!this.state.uuid) { return window.location.replace("/login") 
    } else{
      //all tasks attributed to this user are retrieved from the API and sorted into their attributed lists
      API.getTasks(this.state.uuid)
      .then(res => {
        console.log(res);
        let firstThing = res.data.filter(task => task.topTask)
        let faves = res.data.filter(task => {return (task.favorite && !task.topTask)})
        let todo = res.data.filter(task => {return (task.active && !task.favorite &&!task.topTask)})
        let everythingElse = res.data.filter(task => {return (!task.favorite && !task.active && !task.topTask)})
        //if there is a Top-task ready to occupy the helm, the stashed time is retrieved and displayed
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
      })
      .catch(err => console.log(err));
    }
  };

  getTaskInfo = id => {
    API.getTaskInfo(id)
      .then(res => {
        console.log(res.data)
        window.location.replace("/report/" + [this.state.uuid] + "/" + [res.data.id])
      })
  }
  deleteTask = id => {
    API.deleteTask(id)
      .then(res => this.loadTasks())
      .catch(err => console.log(err))
  };
  
  updateTask = (req, res)  => {
    let newStatus = {} 
      if (req.destination.droppableId === "left") { newStatus = {active: true} }
      if (req.destination.droppableId === "right") { newStatus = {favorite: true}}
      if (req.destination.droppableId === "bottom") { newStatus = {favorite: false, active: false}}
      if (req.destination.droppableId === "helm") { newStatus = {topTask: true}}
      if (req.source.droppableId === "helm") { newStatus = {...newStatus, topTask: false}}
      
    const taskData = {
      id: req.draggableId,
      ...newStatus
    }
    console.log("taskData", taskData)
    API.updateTask(taskData)
      .then(res => console.log("res", res))
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
        .then(res => console.log("stopTime res",res))
        .catch(err => console.log(err))
    } else {return}
  };

  fullStop = async () => {
    await this.stopTimer()
    let destination = {droppableId: "bottom"}
    const task = this.state.helm[0]
    if (task.favorite) {
      destination = {droppableId: "right"}
     } else {
      destination = {droppableId: "left"}
     }
    const newResult = {
      draggableId: task.id,
      destination,
      source: {droppableId: "helm"},
    }
    this.onDragEnd(newResult)
  }

  render = () => {
    return (
      <Container fluid>
      <Nav uuid={this.state.uuid}/>
        <Title>Top Task Dashboard</Title>
        <DragDropContext onDragStart={this.onDragStart} onDragEnd={this.onDragEnd}>
          <Row>
            <Col size="4">
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
                      getTaskInfo={this.getTaskInfo}
                      source = {"left"}
                      destination={task.favorite ? "right" : "bottom"}
                      time = {task.stashedTime}
                    />
                    ))) : (
                    <div>
                      Create a to-do list by dragging tasks to this bar
                    </div>
                  )}
                </List>
              </Col>
              <Col class="container-fluid" size="md-4">
              <h2>Top Task</h2>

                <Main class="main-container" droppableId="helm">
                {(this.state.helm.length > 0)? ([
                  (this.state.helm.map((task, index) => (
                    <ListItem
                      key={task.id}
                      draggableId={task.id}
                      title={task.title}
                      notes={task.notes}
                      index={index}
                      completeTask={this.fullStop}
                      getTaskInfo={this.getTaskInfo}
                      source = {"helm"}
                      destination={task.favorite ? "right" : "left"}
                      onChange={this.handleInputChange}
                      />
                  ))),
                    <div className="row">
                      <div className="col-6">
                        <h1 className="text-left ml-2">
                          {handleZerosPadding("hours", this.state.hours)}:
                          {handleZerosPadding("minutes", this.state.minutes)}:
                          {handleZerosPadding("seconds", this.state.seconds)}.
                          {handleZerosPadding("milliseconds", this.state.milliseconds)}
                        </h1>
                        <SmallButton onClick={this.fullStop}>
                          Click here to create a new task
                        </SmallButton>
                      </div>
                      <div className="col-6 d-flex align-items-end">
                        
                        {(!this.state.isTimerStarted) ? 
                          <OptimizedIcon  className={"display-2 m-4 "} Icon={FaPlay} onClick={this.startTimer} />
                        :
                          <OptimizedIcon className={"display-2 m-4"} Icon={FaPause} onClick={this.stopTimer} />
                        }
                      </div>
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
                 

                    <div className="form-group form-check">

                      
                      
                        <label class="form-check-label ">
                          <input
                            name="isfavorite"
                            type="checkbox"
                            value={true}
                            onChange={this.handleInputChange}
                            />
                          Add to Favorites
                        </label>
                        
                      
                    
                      <SmallButton
                        disabled={!this.state.title}
                        onClick={this.createTask}
                        >
                        {(this.state.isfavorite || this.state.isActive) ? (
                          "Add Task to Library"
                          ):(
                            "Start tracking this task"
                            )}
                      </SmallButton>
                    
                            </div>
                </form>
                  )}
                </Main>
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
                      getTaskInfo={this.getTaskInfo}
                      source = {"right"}
                      destination={"bottom"}
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