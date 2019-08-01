import React from 'react';
import moment from "moment";

import { DeleteBtn } from "../Form";
import { Draggable } from 'react-beautiful-dnd';

const grid = 8;

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

function HListItem(props) {
  const displayTime = (moment.utc(moment.duration(props.time, "ms").asMilliseconds()).format("H:mm:ss"))

  return(
    <Draggable
      draggableId={props.draggableId}
      index={props.index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getHItemStyle(
              snapshot.isDragging,
              provided.draggableProps.style
          )}>
          <strong>
            {props.title}
            {(props.source !== "helm") ? displayTime: (null)}
          </strong>
          <DeleteBtn onClick={() => props.deleteTask(props.draggableId)} />  
        </div>
      )}
    </Draggable>
  )
}

export default HListItem;