import React from "react";
import { FaSkullCrossbones, FaCheckSquare, FaScroll } from "react-icons/fa";
import OptimizedIcon from "../OptimizedIcon";

import "./style.css";

// This file exports the Input, TextArea, and FormBtn components

export function Input(props) {
  return (
    <div className="form-group">
      <input className="form-control" {...props} />
    </div>
  );
}

export function TextArea(props) {
  return (
    <div className="form-group">
      <textarea className="form-control" rows="5" {...props} />
    </div>
  );
}

export function Checkbox(props) {
  return (
    <div className="form-group">
      <label>{props.children}</label>
      <input type="checkbox" className="form-check-input" id="favorite" {...props}/>
    </div>
  );
}

export function FormBtn(props) {
  return (
    <button className="button" {...props} style={{ float: "right", marginBottom: 10 }} >
      {props.children}
    </button>
  );
}

export function SmallButton(props) {
  return (
    <button className="btn btn-success justify-content-center" {...props} style={{ float: "right", marginBottom: 10, marginRight: 10 }} >
      {props.children}
    </button>
  );
}

export function SuccessBtn(props) {
  return (
    <span className="success-btn" {...props} role="button" tabIndex="0">
      <OptimizedIcon className="align-self-start m-2" Icon={FaCheckSquare} />
    </span>
  );
}
export function InfoBtn(props) {
  return (
    <span className="info-btn  btn-outline-light" {...props} role="button" tabIndex="0">
      <OptimizedIcon className="align-self-start m-2" Icon={FaScroll} />
    </span>
  );
}
export function DeleteBtn(props) {
  return (
    <span className="skull border border-dark" {...props} role="button" tabIndex="0">
      <OptimizedIcon className="align-self-start m-2" Icon={FaSkullCrossbones} />
    </span>
  );
}

export function Email(props) {
  return (
    <div className="form-group">
      <label id="email">Email address</label>
      <input type="email" className="form-control" id="email" placeholder="Enter email" {...props}/>
      <small id="loginHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
    </div>
  );
}

export function Password(props) {
  return (
    <div className="form-group">
      <label id="password">Password</label>      
      <input type="password" className="form-control" placeholder="Password"{...props} />
      <small id="loginHelp" className="form-text text-muted">Use a strong password. Or don't. I'm not your mom.</small>
    </div>
  );
}
