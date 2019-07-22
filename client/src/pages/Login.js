import React, { Component } from "react";
import {FormBtn, Email, Password } from "../components/Form";

import API from "../utils/API";

class Login extends Component {
  state = {
    email: "",
    password: "",
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleFormSubmit = event => {
    event.preventDefault();
    if (this.state.email && this.state.password) {
      console.log("Login state = " + this.state.password)
      API.loginUser({
        email: this.state.email,
        password: this.state.password
      })
        .then(res => {
          window.location.replace("/dashboard/" + res.data.id);
        })
        .catch(err => console.log(err));
    }
  };

  render() {
    return (
          <form>
            <Email
              value={this.state.email}
              onChange={this.handleInputChange}
              name="email"
            />
            <Password
              value={this.state.password}
              onChange={this.handleInputChange}
              name="password"
            />
            <FormBtn
              disabled={!(this.state.email && this.state.password)}
              onClick={this.handleFormSubmit}
            >
              Login
            </FormBtn>
          </form>
    );
  }
}

export default Login;
