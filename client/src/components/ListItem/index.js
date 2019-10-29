import React from 'react';
import moment from "moment";

import { SuccessBtn, InfoBtn} from "../Form";
import { Draggable } from 'react-beautiful-dnd';
import { FaTasks } from 'react-icons/fa';

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
  const displayTime = (moment.utc(moment.duration(props.time, "ms").asMilliseconds()).format("H:mm:ss"))

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
          <SuccessBtn onClick={() => {
            props.completeTask({
              draggableId: props.draggableId,
              source: {droppableId: props.source, index: props.index},
              destination: {droppableId: props.destination},
            })
          }}/>  
          <InfoBtn onClick={() => {
            props.getTaskInfo(props.draggableId)
          }}/>  
          <strong className="card-subtitle">
            {props.title}
          </strong>
          <p>
            {(props.source !== "helm") ? displayTime : props.notes}
          </p>
        </div>
      )}
    </Draggable>
  )
}

export default ListItem;