import React, { Component } from "react";
import { Redirect } from 'react-router-dom'
import Title from "../components/Title";
import List from "../components/List";
import ListItem from "../components/ListItem";
import { Col, Row, Container } from "../components/Grid";
import { FormBtn } from "../components/Form"
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

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: grid,
    width: 250
});

class Dashboard extends Component {
  state = {
    tasks: [],
    user: "",
    title: "",
    notes: "",
    //dummy list for dnd
    items: getItems(10),
    selected: getItems(5, 10),
  };

  id2List = {
    droppable: 'items',
    droppable2: 'selected'
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
