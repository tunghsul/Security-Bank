/* eslint-disable no-unused-expressions */
import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import { Container, Button, Card, Input, Box } from "@mui/material";

class App extends Component {
  constructor(props) {
    super(props),
      (this.state = {
        username: "",
        password: "",
        fetchData: [],
        reviewUpdate: "",
      });
  }

  handleChange = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({
      [nam]: val,
    });
  };

  handleChange2 = (event) => {
    this.setState({
      reviewUpdate: event.target.value,
    });
  };

  componentDidMount() {
    axios.get("/api/get").then((response) => {
      this.setState({
        fetchData: response.data,
      });
    });
  }

  submit = () => {
    axios.post("/api/insert", this.state).then(() => {
      // alert("success post");
      console.log("success insert");
    });
    console.log(this.state);
    document.location.reload();
  };

  delete = (id) => {
    // if (confirm("Do you want to delete? ")) {
    //     axios.delete(`/api/delete/${id}`)
    //     document.location.reload()
    // }
  };

  edit = (id) => {
    axios.put(`/api/update/${id}`, this.state);
    document.location.reload();
  };

  render() {
    return (
      <div className="App">
        <h1>Security Bank</h1>
        <div className="form">
          <Input
            name="username"
            placeholder="Enter User Name"
            onChange={this.handleChange}
          />
          <Input
            name="password"
            placeholder="Enter Password"
            onChange={this.handleChange}
          />
        </div>
        <Button className="my-2" variant="primary" onClick={this.submit}>
          Login
        </Button>{" "}
      </div>
    );
  }
}

export default App;
