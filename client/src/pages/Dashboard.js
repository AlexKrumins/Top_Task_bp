import React, { Component } from "react";
// import { Redirect } from 'react-router-dom'
// import ReactDOM from 'react-dom';

import Title from "../components/Title";
import { Col, Row, Container } from "../components/Grid";
import { Input, TextArea, FormBtn, DeleteBtn } from "../components/Form"
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Stopwatch from "../components/Stopwatch";
import API from "../utils/API"
import ListItem from '../components/ListItem';
// fake data generator
const getItems = (count, offset = 0) =>
    Array.from({ length: count }, (v, k) => k).map(k => ({
        id: `item-${k + offset}`,
        content: `item ${k + offset}`
    }));

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

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'grey',

    // styles we need to apply on draggables
    ...draggableStyle
});
const getHItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 ${grid}px 0 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'grey',

    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: grid,
    width: 250
});

const getHListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    display: 'flex',
    padding: grid,
    overflow: 'auto',
});

class Dashboard extends Component {
  state = {
    left: [],
    right: [],
    bottom: [],
    title: "",
    notes: "",
    uuid: this.props.match.params.uuid,

    // helm: [],
    isfavorite: false,
    isActive: false,
  };
  
  
  id2List = {
    left: 'left',
    right: 'right',
    bottom: 'bottom',
    creationStation: 'helm',
  };
  
    
  componentDidMount = () => {
    this.loadTasks();
  }
  
  getList = id => this.state[this.id2List[id]];

  onDragEnd = (result) => {
    const { source, destination } = result;
    console.log("onDrageEnd result", result)
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

        
        if (source.droppableId === 'left') {
          state = { left: tasks };
        }
        
        if (source.droppableId === 'right') {
          state = { right: tasks };
        }
        
        if (source.droppableId === 'bottom') {
            state = { bottom: tasks };
        }

        this.setState(state);
    } else {
      const result = move(
          this.getList(source.droppableId),
          this.getList(destination.droppableId),
          source,
          destination
      );

      if(result.left){
        this.setState({left: result.left})
      };
        if(result.right){
        this.setState({right: result.right})
      };
      if(result.bottom){
        this.setState({bottom: result.bottom})
      };
    };
  };

  loadTasks = () => {
    console.log(this.state.uuid)
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
      .catch(err => console.log(err));
  }

  handleInputChange = event => {
    const target = event.target
    const value = target.type === "checkbox" ? target.checked : target.value
    const name = target.name;
    console.log(name, value)
    this.setState({
      [name]: value
    });
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

  render = () => {
    return (
      <Container fluid>
        <Title>Top Task Dashboard</Title>
          <DragDropContext onDragEnd={this.onDragEnd}>
        <Row>
            <Col size="md-4">
            <h2>Today's Tasks</h2>
              <Droppable droppableId="left">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}>
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
                      )
                    }
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </Col>
            <Col size="md-4">
              <Stopwatch />
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
              <Droppable droppableId="right">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      style={getListStyle(snapshot.isDraggingOver)}>
                      {(this.state.right.length > 0) ? (
                        this.state.right.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                  snapshot.isDragging,
                                  provided.draggableProps.style
                              )}>
                              {task.title}
                            </div>
                            )}
                          </Draggable>
                        ))) : (
                          <div>
                          Drag tasks here to add them to your favorites
                          </div>
                        )
                      }
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
            </Col>
        </Row>
        <Row>
          <h2>Recently Added Tasks</h2>
        </Row>
        <Row>
          <Droppable droppableId="bottom" direction="horizontal">
            {(provided, snapshot) => (
              <div
              ref={provided.innerRef}
              style={getHListStyle(snapshot.isDraggingOver)}
              >
                {(this.state.bottom.length > 0) ? (
                  this.state.bottom.map((task, index) => (
                  <Draggable 
                    key={task.id} 
                    draggableId={task.id} 
                    index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getHItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}>
                        {task.title}
                      </div>
                    )}
                  </Draggable>
                  ))) : (
                    <div>
                      Start Adding Tasks to your library. They'll appear down here.
                    </div>
                  )
                }
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </Row>
      </DragDropContext>

      </Container>
    );
  }
}

export default Dashboard;
