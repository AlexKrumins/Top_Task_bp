import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Wrapper from "./components/Wrapper";
import Nav from "./components/Nav";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Report from "./pages/Report";
import NoMatch from "./pages/NoMatch";



function App() {
  return (
    <Router>
      <div>
        <Nav />
        <Wrapper>
          <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/dashboard" component={Login} />              
            <Route exact path="/dashboard/:uuid" component={Dashboard} />              
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/report/:uuid" component={Report} />
            <Route component={NoMatch} />
          </Switch>
        </Wrapper>
      </div>
    </Router>
  );
}

export default App;
