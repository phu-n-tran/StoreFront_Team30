import React, { Component } from 'react';
import { Row, Col, Button } from "reactstrap";
import './App.css';

class Employees extends Component {
  constructor(props) {
    console.log(props);
    super(props);
    this.state = {
      people: this.props.people
    };
  }

  renderPersonEntries = () => {
    console.log("inside where we render");
    console.log(this.props.people);
    if (!this.props.people) {
      return (<p>No entries! Try adding one above.</p>);
    } else {
      return (
        this.props.people.map((person) => {
          return (
            <Row>
              <Col>
                <Button color="warning" onClick={() => {this.props.removeEntry(person.id)}}>
                  x
                </Button>
              </Col>
            <Col>
              {person.id}
            </Col>
            <Col>
              {person.name}
            </Col>
            <Col>
              {person.age}
            </Col>
          </Row>);
      })
      )
    }
  }

  render() {
    const { people } = this.state;
    return (
      <div style={{ textAlign: "left" }} className="Employees">
        {this.renderPersonEntries(people)}
      </div>
    );
  }
}

export default Employees;
