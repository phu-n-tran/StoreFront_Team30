import React, { Component } from "react";
import { Container } from "reactstrap";
import EmployeeTable from "./EmployeeTable";
import "./App.css";

class App extends Component{

  render() {
    return (
      <Container style={{textAlign:"left"}} className="App">
        <EmployeeTable />
      </Container>
    );
  }
}

export default App;
