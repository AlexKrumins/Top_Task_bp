import React, { Component } from "react";
import {FormBtn, Email, Password } from "../components/Form";

import API from "../utils/API";

class SignUp extends Component {
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
      API.signupUser({
        email: this.state.email,
        password: this.state.password
      })
        .then(res => {
          if(res.data) {
            window.location.replace("/dashboard/" + res.data.id);
            console.log(res);
          } else {
            console.log("Sign-up error")
          }
        })
        .catch(err => console.log(err));
    }
  };

  render() {
    return (
          <form>
            <Email
              value={this.state.title}
              onChange={this.handleInputChange}
              name="email"
            />
            <Password
              value={this.state.title}
              onChange={this.handleInputChange}
              name="password"
            />
            <FormBtn
              disabled={!(this.state.email && this.state.password)}
              onClick={this.handleFormSubmit}
            >
              Create Account
            </FormBtn>
          </form>
    );
  }
}

export default SignUp;
