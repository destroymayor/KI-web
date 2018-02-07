import React from "react";
import ReactDOM from "react-dom";
import { unregister as unregisterServiceWorker } from "./registerServiceWorker";
import "./index.css";
//載入路由配置
import App from "./page/index";

ReactDOM.render(<App />, document.getElementById("root"));

unregisterServiceWorker();
