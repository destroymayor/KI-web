const express = require("express");
const app = express();
const path = require("path");

//載入壓縮組件
const compression = require("compression");
//載入Security插件
const helmet = require("helmet");
//載入路由配置
const routes = require("./server/route");

app.use(compression());
app.use(helmet());
app.use(express.static(path.join(__dirname, "client/build")));
routes(app);

//其他頁面導向index
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

//socket.io config
const server = require("http").Server(app);
const SocketIO = require("socket.io").listen(server);
require("./server/socketIO/chat")(SocketIO);

server.listen(process.env.PORT || 5000);
