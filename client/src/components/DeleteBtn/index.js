import React from "react";
import { FaSkullCrossbones } from "react-icons/fa";
import "./style.css";

// The ...props means, spread all of the passed props onto this element
// That way we don't have to define them all individually
function DeleteBtn(props) {
  return (
    <span className="delete-btn" {...props} role="button" tabIndex="0">
      <OptimizedIcon Icon={FaSkullCrossbones} />
    </span>
  );
}

export default DeleteBtn;
