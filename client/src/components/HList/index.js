import React from 'react';
import { Droppable } from 'react-beautiful-dnd';

const grid = 8;

const getHListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  display: 'flex',
  padding: grid,
  height: grid*20,
  overflow: 'auto',
});

function HList(props) {
  return(
    <Droppable droppableId={props.droppableId} direction="horizontal">
      {(provided, snapshot) => (
        <div
        ref={provided.innerRef}
        style={getHListStyle(snapshot.isDraggingOver)}>
          {props.children}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )
}
export default HList;