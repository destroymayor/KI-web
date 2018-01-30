import React, { Component } from "react";

import { BrowserRouter as Router, Route } from "react-router-dom";
import KI from "./KI/index";
import Identify from "./Identify/index";

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={KI} />
          <Route path="/identify" component={Identify} />
        </div>
      </Router>
    );
  }
}

export default App;
