import compression from "compression";

import express from "express";
import helmet from "helmet";
import path from "path";

import ChatRoom from "./socketIO/chat";

import router from "./route/index";

const app = express();
app.use(compression());
app.use(helmet());
app.use(express.static(path.join(__dirname, "../client/build")));

router(app); // load router config

const server = require("http").Server(app); // socket.io config
const SocketIO = require("socket.io").listen(server);

ChatRoom(SocketIO); // Chat room to socket.io

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

server.listen(process.env.PORT || 5000);
