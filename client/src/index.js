import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { unregister as unregisterServiceWorker } from "./registerServiceWorker";

import "./index.css";

//載入路由配置
import App from "./page/index";

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
unregisterServiceWorker();
