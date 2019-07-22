import React from "react";

function Nav() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <a className="navbar-brand" href="/">
        Top Task Time Tracker
      </a>
      <span className="navbar-brand"> || </span>
      <a className="navbar-brand" href="/dashboard">
        Dashboard
      </a>
      <span className="navbar-brand"> || </span>
      <a className="navbar-brand" href="/report">
        Review Tasks
      </a>
      <span className="navbar-brand"> || </span>
      <a className="navbar-brand" href="/login">
        Login
      </a>
      <span className="navbar-brand"> || </span>
      <a className="navbar-brand" href="/signup">
        Create Account
      </a>
    </nav>
  );
}

export default Nav;
