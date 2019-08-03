import React from 'react';
import { Droppable } from 'react-beautiful-dnd';


const grid = 8;

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: grid,
});

function List(props) {
  return(
    <Droppable droppableId={props.droppableId} isDropDisabled={props.isDropDisabled}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          style={getListStyle(snapshot.isDraggingOver)}>
            {props.children}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )
}
export default List;