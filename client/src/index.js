import React from "react";
import ReactDOM from "react-dom";
import { unregister as unregisterServiceWorker } from "./registerServiceWorker";
// import registerServiceWorker from "./registerServiceWorker";
import "./index.css";

import App from "./page/index";

ReactDOM.render(<App />, document.getElementById("root"));

// registerServiceWorker();
unregisterServiceWorker();
