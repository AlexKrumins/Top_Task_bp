import React from "react";

function Nav(props) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-secondary">
      <a className="navbar-brand" href={(props.uuid) ? ("/dashboard/" + props.uuid) : ("/login")}>
        Top Task Time Tracker
      </a>
      <span className="navbar-brand">||</span>
      <a className="navbar-brand" href={(props.uuid) ? ("/dashboard/" + props.uuid) : ("/login")}>
        Dashboard
      </a>
      <span className="navbar-brand">||</span>
      <a className="navbar-brand" href={(props.uuid) ? ("/report/" + props.uuid) : ("/login")}>
        Review Tasks
      </a>
      <span className="navbar-brand">||</span>
      <a className="navbar-brand" href="/login">
        {props.uuid ? "Logout" : "Login"}
      </a>
      <span className="navbar-brand">||</span>
      <a className="navbar-brand" href="/signup">
        Create Account
      </a>
    </nav>
  );
}

export default Nav;
