import React, { Component } from "react";
// import { Redirect } from 'react-router-dom'
// import ReactDOM from 'react-dom';

import Title from "../components/Title";
import { Col, Row, Container } from "../components/Grid";
import { Input, TextArea, FormBtn } from "../components/Form"
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Stopwatch from "../components/Stopwatch";
import API from "../utils/API"
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
    tasks: [],
    favorites: [],
    title: "",
    notes: "",
    uuid: this.props.match.params.uuid,
    //dummy list for dnd
    items: getItems(10),
    selected: getItems(5, 10),
    helm: [],
    isfavorite: false,
  };
  
  
  id2List = {
    droppable: 'tasks',
    bottom: 'items',
    favorites: 'favorites',
    creationStation: 'helm',
  };
  
    
  componentDidMount = () => {
    this.loadTasks();
  }
  
  getList = id => this.state[this.id2List[id]];
  onDragEnd = result => {
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

        if (source.droppableId === 'favorites') {
            state = { favorites: tasks };
        }

        
        if (source.droppableId === 'bottom') {
            state = { items: tasks };
        }

        this.setState(state);
    } else {
        const result = move(
            this.getList(source.droppableId),
            this.getList(destination.droppableId),
            source,
            destination
        );

        this.setState({
            tasks: result.droppable,
            favorites: result.favorites,
            helm: result.creationStation
        });
    }
  };

  loadTasks = () => {
    console.log(this.state.uuid)
    if (!this.state.uuid) { return window.location.replace("/login") }
    else{
      API.getTasks(this.state.uuid)
      .then(res => {
        let faves = res.data.filter(task => {return task.favorite})
        let todo = res.data.filter(task => {return !task.favorite})
        this.setState({ tasks: todo, favorites: faves, title: "", user: this.props.match.params.uuid, notes: "" })
        console.log("tasks", this.state.tasks)
        console.log("favorites", this.state.favorites)
      })
      .catch(err => console.log(err));
    }
  };

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
      })
      .then(res => this.loadTasks())
      .catch(err => console.log(err));
    }
  };

  render() {
    return (
      <Container fluid>
        <Title>Top Task Dashboard</Title>
          <DragDropContext onDragEnd={this.onDragEnd}>
        <Row>
            <Col size="md-4">
              <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}>
                    {(this.state.tasks.length > 0) ? (
                      this.state.tasks.map((task, index) => (
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
                          Drag tasks to this bar
                        </div>
                      )
                    };
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
                <label>
                  <input
                    name="isfavorite"
                    type="checkbox"
                    value={this.state.isfavorite}
                    onChange={this.handleInputChange}
                  />
                   Add to Favorites
                </label>
                <FormBtn
                  disabled={!this.state.title}
                  onClick={this.handleFormSubmit}
                >
                  Add Task to Library
                </FormBtn>
              </form>
            </Col>
            <Col size="md-4">
              <Droppable droppableId="favorites">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      style={getListStyle(snapshot.isDraggingOver)}>
                      {this.state.favorites.length > 0 &&
                        this.state.favorites.map((task, index) => (
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
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
            </Col>
        </Row>
        <Row>
        <Droppable droppableId="bottom" direction="horizontal">
          {(provided, snapshot) => (
            <div
            ref={provided.innerRef}
            style={getHListStyle(snapshot.isDraggingOver)}
            {...provided.droppableProps}
            >
              {this.state.items.length > 0 &&
                this.state.items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                    ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getHItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                        )}
                        >
                      {item.content}
                    </div>
                  )}
                </Draggable>
              ))}
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
