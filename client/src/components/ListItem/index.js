import React from 'react';
import ReactDOM from 'react-dom';
import { DeleteBtn } from "../Form";
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
  console.log("props",props)
  return(
    <Draggable
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
          <DeleteBtn onClick={() => props.deleteTask(props.draggableId)} />  
        </div>
      )}
    </Draggable>
  )
}

export default ListItem;