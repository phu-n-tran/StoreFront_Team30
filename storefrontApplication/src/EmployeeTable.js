import React, { Component } from 'react';
import { Row, Col, Input, Button } from "reactstrap";
import Employees from "./Employees";

class EmployeeTable extends Component {

  state = {
    columnNames: ["ID", "Name", "Age"],
    newPerson: {
      name: "",
      age: ""
    },
    people: []
  };

  componentDidMount() {
    this.getData();
  };

  onChange = (e) => {
    let temp = this.state.newPerson;
    temp[e.target.name] = e.target.value;
    this.setState({ newPerson: temp });
  }

  handleKeyDown = (e) => {
    if (e.which === 13) {
      this.submitNewUser();
    }
  }

  submitNewUser = () => {
    fetch(`http://ec2-54-153-103-160.us-west-1.compute.amazonaws.com:4000/tempTables/add?name=
    ${this.state.newPerson.name}&age=${this.state.newPerson.age}`)
    .then(this.getData())
    .catch(err => console.error(err));
    let temp = {
      name: "",
      age: "",
    };
    this.setState({newPerson: temp});
  }

  renderInputs = () => {
    return <React.Fragment>
      <Row>
        <Input
          width="50%"
          name="name"
          placeholder="New Name"
          onKeyDown={this.handleKeyDown}
          value={this.state.newPerson.name}
          onChange={this.onChange} />
        <Input
          width="50%"
          name="age"
          type="number"
          placeholder="New Age"
          onKeyDown={this.handleKeyDown}
          value={this.state.newPerson.age}
          onChange={this.onChange} />
        <Button onClick={this.submitNewUser}>
          Add User
        </Button>
      </Row>
    </React.Fragment>
  }

  removeEntry = (id) => {
    fetch(`http://ec2-54-153-103-160.us-west-1.compute.amazonaws.com:4000/tempTables/remove?id=${id}`)
      .then(this.getData())
      .catch(err => console.error(err));
    
  }

  getData = () => {
    fetch('http://ec2-54-153-103-160.us-west-1.compute.amazonaws.com:4000/tempTables')
      .then(response => response.json())
      .then(response => this.setState({ people: response.data }))
      .catch(err => console.error(err));
  }

  renderEmployees = () => {
    return <Employees people={this.state.people} removeEntry={this.removeEntry} />
  }

  renderData = ({ id, name, age, dob }) => <div style={{ textAlign: "left" }} key={id}>{id}, {name}, {age}</div>

  render() {
    return (
      <div style={{ textAlign: "left" }} className="Employees">
        <Row>
          {this.state.columnNames.map((name) => {
            return (
              <Col>
                <h1>
                  {name}
                </h1>
              </Col>
            );
          })}
        </Row>
        {this.renderEmployees()}
        {this.renderInputs()}
      </div>
    );
  }
}

export default EmployeeTable;
