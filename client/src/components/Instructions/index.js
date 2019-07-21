import React from "react";
import "./style.css";

function Instructions(props) {
  return <h2 className="instructions">{props.children}</h2>;
}

export default Instructions;
