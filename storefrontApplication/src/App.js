import React, { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import Routing from "./Routing";
import Navbar from "./Navbar";
import "./App.css";

function App() {

  const [authenticated, setAuthenticated] = useState(true);

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar authed={authenticated} />
        <Routing appProps={{ authenticated, setAuthenticated }} />
      </BrowserRouter>
    </div>
  );
}

export default App;
