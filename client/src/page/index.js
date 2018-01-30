import React, { Component } from "react";

import { BrowserRouter as Router, Route } from "react-router-dom";
import Ki from "./KI/index";
import Identify from "./Identify/index";

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Ki} />
          <Route path="/identify" component={Identify} />
        </div>
      </Router>
    );
  }
}

export default App;
