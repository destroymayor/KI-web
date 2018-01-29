import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./page/index";

import { BrowserRouter } from "react-router-dom";

import { unregister as unregisterServiceWorker } from "./registerServiceWorker";

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
unregisterServiceWorker();
