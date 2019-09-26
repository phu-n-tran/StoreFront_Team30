import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component{

  state = {
    people: []
  };

  componentDidMount(){
    this.getData();
  };

  getData = _ =>{
    fetch('http://ec2-54-153-103-160.us-west-1.compute.amazonaws.com:4000/tempTables')
    .then(response => response.json())
    .then(response => this.setState({ people: response.data }))
    .catch(err => console.error(err));
  }

  renderData = ({ id, name, age, dob }) => <div style={{textAlign:"left"}} key={id}>{id}, {name}, {age}</div>

  render() {
    const { people } = this.state;
    return (
    <div style={{textAlign:"left"}} className="App">
      <p>ID, Name, Age</p>
      {people.map(this.renderData)}
    </div>
    );
  }
}

export default App;
