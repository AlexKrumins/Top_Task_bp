import React from "react";

function Nav(props) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <a className="navbar-brand" href={"/dashboard/" + props.uuid}>
        Top Task Time Tracker
      </a>
      <span className="navbar-brand"> || </span>
      <a className="navbar-brand" href={"/dashboard/" + props.uuid}>
        Dashboard
      </a>
      <span className="navbar-brand"> || </span>
      <a className="navbar-brand" href={"/report/" + props.uuid}>
        Review Tasks
      </a>
      <span className="navbar-brand"> || </span>
      <a className="navbar-brand" href="/login">
        {props.uuid ? "Logout" : "Login"}
      </a>
      <span className="navbar-brand"> || </span>
      <a className="navbar-brand" href="/signup">
        Create Account
      </a>
    </nav>
  );
}

export default Nav;
