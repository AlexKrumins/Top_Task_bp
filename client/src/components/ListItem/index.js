import React from 'react';
import { SuccessBtn } from "../Form";
import { Draggable } from 'react-beautiful-dnd';

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

function ListItem(props) {
  return(
    <Draggable
      isDragDisabled={props.isDragDisabled}
      draggableId={props.draggableId}
      index={props.index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getItemStyle(
              snapshot.isDragging,
              provided.draggableProps.style
          )}>
          <strong>
            {props.title}
          </strong>
          <SuccessBtn onClick={() => {
            props.completeTask({
              draggableId: props.draggableId,
              source: {droppableId: props.source},
              destination: {droppableId: "bottom"},
            })
          }}/>  
        </div>
      )}
    </Draggable>
  )
}

export default ListItem;